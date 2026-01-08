const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dfyaz7kqr",
  api_key: process.env.CLOUDINARY_API_KEY || "951511546458373",
  api_secret: process.env.CLOUDINARY_API_SECRET || "oZpIqWdB6D8TwjmYrE_9himnxJQ",
});

// Create storage engine for multer
function createCloudinaryStorage(folder) {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: [{ width: 1200, height: 1200, crop: "limit" }],
    },
  });
}

module.exports = {
  cloudinary,
  createCloudinaryStorage,
};

