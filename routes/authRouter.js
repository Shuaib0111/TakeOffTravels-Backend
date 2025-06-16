const express = require('express');
const { userLogin, registerUser } = require('../controllers/authController');
const router = express.Router();

router.post("/login",userLogin);
router.post("/create",registerUser);



module.exports = router;
