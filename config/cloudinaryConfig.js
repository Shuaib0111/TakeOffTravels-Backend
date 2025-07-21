// config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config(); // ensure env is loaded (safe even if already loaded)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(
  "[Cloudinary] Config Loaded:",
  process.env.CLOUDINARY_CLOUD_NAME,
  process.env.CLOUDINARY_API_KEY ? "(api_key present)" : "(api_key MISSING!)"
);

module.exports = cloudinary;
