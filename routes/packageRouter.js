const express = require('express');
const {
  createPackage,
  getAllPackage,
  getOnePackage,
  deletePackage,
  updatePackage
} = require('../controllers/packageController');

const isUserAuthenticated = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // central config

const router = express.Router();

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'packages',
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
    public_id: (req, file) =>
      `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-")}`
  },
});

const upload = multer({ storage });

// Routes
router.post("/create", isUserAuthenticated, upload.single("thumbnail"), createPackage);
router.get("/getAll", getAllPackage);
router.get("/getOne/:id", getOnePackage);
router.delete("/delete/:id", isUserAuthenticated, deletePackage);
router.put("/update/:id", isUserAuthenticated, upload.single("thumbnail"), updatePackage);

module.exports = router;
