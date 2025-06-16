const mongoose = require('mongoose');

const userPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  thumbnail: {
        type: String,
    },
  category: {
    type: String,
    enum: ['Domestic', 'International', 'Cruise'],
    required: true
  },
},{timestamps: true});


const modelName = "Package";
module.exports = mongoose.models[modelName] || mongoose.model(modelName, userPackageSchema);
