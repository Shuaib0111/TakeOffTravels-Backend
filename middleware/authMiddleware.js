const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isUserAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userID) {
            return res.status(401).json({
                success: false,
                message: "Invalid token, authorization denied."
            });
        }

        // Find user and attach to request
        const user = await User.findById(decoded.userID).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found, authorization denied."
            });
        }

        req.user = user; // Attach user object to request
        next();
    } catch (err) {
        console.error("Auth Error:", err.message);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired, please log in again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Unauthorized User, invalid token."
        });
    }
};

module.exports = isUserAuthenticated;
