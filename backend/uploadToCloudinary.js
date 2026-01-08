const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dfyaz7kqr",
  api_key: process.env.CLOUDINARY_API_KEY || "951511546458373",
  api_secret: process.env.CLOUDINARY_API_SECRET || "oZpIqWdB6D8TwjmYrE_9himnxJQ",
});

async function uploadDirectory(dirPath, folder = "blog-app") {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${folder}/${file}`);
    } else {
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: folder,
        });
        console.log(`✅ Uploaded: ${filePath} -> ${result.secure_url}`);
      } catch (error) {
        console.error(`❌ Error uploading ${filePath}:`, error.message);
      }
    }
  }
}

// Upload all images
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  console.error("❌ Uploads directory not found!");
  process.exit(1);
}

console.log("🚀 Starting upload to Cloudinary...");
uploadDirectory(uploadsPath)
  .then(() => {
    console.log("✅ All images uploaded!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

