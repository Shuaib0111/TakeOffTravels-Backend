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
      default: "",
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
    thumbnailPublicId: {
  type: String,
  default: ""
},
    category: {
      type: String,
      enum: ['Domestic', 'International', 'Cruise'],
      required: true,
    },

    // --- Additional Rich Fields ---
    highlights: {
      type: [String],
      default: [], // <-- Add default
    },
    inclusions: {
      type: [String],
      default: [], // <-- Add default
    },
    exclusions: {
      type: [String],
      default: [], // <-- Add default
    },
    specialNotes: {
      type: String,
      default: "", // <-- Add default
    },
    itinerary: {
      type: [
        {
          dayNumber: Number,
          title: String,
          summary: String,
        },
      ],
      default: [], // <-- Add default
    },
    priceOptions: {
      type: [
        {
          type: { type: String },
          pricePerPerson: Number,
        },
      ],
      default: [], // <-- Add default
    },
  },
  { timestamps: true }
);

const modelName = 'Package';
module.exports =
  mongoose.models[modelName] || mongoose.model(modelName, userPackageSchema);
