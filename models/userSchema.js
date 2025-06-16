const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    email:{
        type: String,
        unique:true
    },
    password:{
        type:String,
    }
})
 const authUser = mongoose.model("user",userSchema);
 module.exports = authUser;