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
    const publicId = `handlr/resumes/${uniqueHex}-${baseName}`;

    if (!isConfigured) {
      // Simulation mode
      console.log(`[SIMULATION] Uploading ${normalizedFilename} to Cloudinary...`);
      return setTimeout(() => {
        resolve({
          secure_url: `https://res.cloudinary.com/simulation-cloud/raw/upload/${publicId}.${ext}`,
          public_id: `${publicId}`,
        });
      }, 800);
    }

    // Official Cloudinary raw upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // PDFs/DOCXs are uploaded as raw files
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
 * Deletes a file from Cloudinary using publicId
 * @param {string} publicId 
 * @returns {Promise<object>}
 */
exports.deleteResume = async (publicId) => {
  if (!isConfigured) {
    console.log(`[SIMULATION] Deleting Cloudinary asset: ${publicId}`);
    return { result: "ok" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw", // Raw resources MUST specify raw resource_type
    });
    console.log(`Cloudinary asset deleted: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Failed:", error);
    // Return null rather than crashing so DB operations are not blocked by cloud cleanup failures
    return null;
  }
};
