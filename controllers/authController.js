const authUser = require("../models/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const existingUser = await authUser.findOne({ email });

      if (existingUser) {
        const comparedPassword = await bcrypt.compare(password, existingUser.password);

        if (comparedPassword) {
          const token = jwt.sign(
            { userID: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
          );

          return res.status(200).json({
            message: "User logged in successfully...",
            success: true,
            token,
            user: existingUser,
          });
        } else {
          return res.status(401).json({ message: "Incorrect password", success: false });
        }
      } else {
        return res.status(404).json({ message: "User not found", success: false });
      }
    } else {
      return res.status(400).json({ message: "Email and password are mandatory", success: false });
    }
  } catch (err) {
    console.error("Login error:", err); 
    return res.status(500).json({ message: err.message, success: false });
  }
};


const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const existingUser = await authUser.findOne({ email });
      if (existingUser) {
        return res.json({ message: "User already exists...", success: false });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await authUser.create({
        email,
        password: hashedPassword
      });

      if (user) {
        return res.json({ message: "User created successfully...", success: true });
      } else {
        return res.json({ message: "User cannot be created", success: false });
      }
    } else {
      return res.json({ message: "Email and password must not be empty", success: false });
    }
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

module.exports = {
  userLogin,
  registerUser,
};
