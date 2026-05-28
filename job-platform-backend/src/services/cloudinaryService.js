const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/AppError");
const crypto = require("crypto");

const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== "your_cloudinary_api_key" &&
  process.env.CLOUDINARY_API_SECRET && 
  process.env.CLOUDINARY_API_SECRET !== "your_cloudinary_api_secret";

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured successfully.");
} else {
  console.warn("Cloudinary is not configured or using default placeholders. Using simulation fallback mode.");
}

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer 
 * @param {string} normalizedFilename 
 * @returns {Promise<object>}
 */
exports.uploadResume = (fileBuffer, normalizedFilename) => {
  return new Promise((resolve, reject) => {
    // Generate secure unguessable prefix
    const uniqueHex = crypto.randomBytes(8).toString("hex");
    const baseName = normalizedFilename.replace(/\.[^/.]+$/, "");
    const ext = normalizedFilename.split(".").pop().toLowerCase();
    // IMPORTANT: raw resource_type requires extension in public_id.
    // This produces a clean single-extension URL: /raw/upload/.../abc123-role-company.pdf
    const publicId = `handlr/resumes/${uniqueHex}-${baseName}.${ext}`;

    if (!isConfigured) {
      // Simulation mode — always raw for documents
      console.log(`[SIMULATION] Uploading ${normalizedFilename} to Cloudinary (raw)...`);
      return setTimeout(() => {
        resolve({
          secure_url: `https://res.cloudinary.com/simulation-cloud/raw/upload/${publicId}`,
          public_id: publicId,
          resource_type: "raw",
        });
      }, 800);
    }

    // Always upload as raw — PDFs and DOCX are document files, not images.
    // resource_type: "raw" guarantees:
    //   1. URL uses /raw/upload/ (correct for document delivery)
    //   2. publicId with extension is used verbatim — no duplicate extension
    //   3. File downloads correctly as PDF/DOCX on any OS
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          return reject(new AppError(`Cloudinary Upload Failed: ${error.message}`, 500));
        }
        resolve(result);
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes a raw file from Cloudinary using publicId.
 * All resume assets are stored as resource_type: "raw".
 * @param {string} publicId 
 * @returns {Promise<object>}
 */
exports.deleteResume = async (publicId) => {
  if (!isConfigured) {
    console.log(`[SIMULATION] Deleting Cloudinary raw asset: ${publicId}`);
    return { result: "ok" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
    console.log(`Cloudinary raw asset deleted: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Failed:", error);
    // Return null rather than crashing — DB ops must not be blocked by cloud cleanup failures
    return null;
  }
};
