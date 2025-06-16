const express = require('express');
const { createPackage, getAllPackage, getOnePackage, deletePackage, updatePackage } = require('../controllers/packageController');
const isUserAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/upload/');
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({storage: storage});

router.post("/create", upload.single("thumbnail"),createPackage);

router.get("/getAll", getAllPackage);
router.get("/getOne/:id",getOnePackage);
router.delete("/delete/:id",isUserAuthenticated,deletePackage);
router.put("/update/:id", isUserAuthenticated, upload.single("thumbnail"), updatePackage);

module.exports = router;
