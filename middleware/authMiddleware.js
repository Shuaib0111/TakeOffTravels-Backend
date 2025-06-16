const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isUserAuthenticated = async (req,res,next)=>{
    let token;
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith("Bearer")){
        try{
            token = authorization.split(" ")[1];
            const {userID} = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(userID).select("-password");
            next();
        }
        catch(err){
            res.status(401).json({message: "Unauthorized User",success:false});
        }
    }
    else{
        res.status(401).json({message: "Unauthorized User",success:false});
    }
}

module.exports = isUserAuthenticated;