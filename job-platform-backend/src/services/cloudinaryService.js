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
    const publicId = `handlr/resumes/${uniqueHex}-${baseName}.${ext}`;

    if (!isConfigured) {
      // Simulation mode
      const detectedResourceType = ext === "pdf" ? "image" : "raw";
      console.log(`[SIMULATION] Uploading ${normalizedFilename} to Cloudinary...`);
      return setTimeout(() => {
        resolve({
          secure_url: `https://res.cloudinary.com/simulation-cloud/${detectedResourceType}/upload/${publicId}`,
          public_id: `${publicId}`,
          resource_type: detectedResourceType,
        });
      }, 800);
    }

    // Official Cloudinary auto upload stream (automatically detects image/raw/etc.)
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
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
 * Deletes a file from Cloudinary using publicId and resourceType
 * @param {string} publicId 
 * @param {string} resourceType 
 * @returns {Promise<object>}
 */
exports.deleteResume = async (publicId, resourceType = "raw") => {
  if (!isConfigured) {
    console.log(`[SIMULATION] Deleting Cloudinary asset: ${publicId} (type: ${resourceType})`);
    return { result: "ok" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Cloudinary asset deleted: ${publicId} (type: ${resourceType})`, result);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Failed:", error);
    // Return null rather than crashing so DB operations are not blocked by cloud cleanup failures
    return null;
  }
};
