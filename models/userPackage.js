const mongoose = require('mongoose');

const userPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String, // e.g. "4N/5D"
      required: true,
    },
    thumbnail: {
      type: String, // Single main image
      required: true,
    },
    category: {
      type: String,
      enum: ['Domestic', 'International', 'Cruise'],
      required: true,
    },

    // --- Additional Rich Fields ---
    highlights: [String], // Key points about the package
    inclusions: [String], // Included items
    exclusions: [String], // Excluded items
    specialNotes: String,  // For compliments or offers
    itinerary: [
      {
        dayNumber: Number,
        title: String,
        summary: String,
      },
    ],
    priceOptions: [
      {
        type: { type: String }, // e.g. "3-Star", "Luxury 4-Star"
        pricePerPerson: Number,
      },
    ],
  },
  { timestamps: true }
);

const modelName = 'Package';
module.exports = mongoose.models[modelName] || mongoose.model(modelName, userPackageSchema);
