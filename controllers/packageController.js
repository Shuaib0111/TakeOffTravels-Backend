const Package = require("../models/userPackage");
const cloudinary = require("../config/cloudinaryConfig"); // configured instance

/* ---------------------------
 * Helpers
 * ------------------------- */
function safeJSON(val, fallback) {
  if (!val) return fallback;
  if (Array.isArray(val) || typeof val === 'object') return val;
  try {
    const parsed = JSON.parse(val);
    return parsed;
  } catch {
    return fallback;
  }
}

/* ---------------------------
 * CREATE
 * ------------------------- */
const createPackage = async (req, res) => {
  const {
    title,
    tagline,
    description,
    price,
    duration,
    category,
    highlights,
    inclusions,
    exclusions,
    specialNotes,
    itinerary,
    priceOptions,
  } = req.body;

  try {
    if (!title || !description || !price || !duration || !category || !req.file) {
      return res.json({ success: false, message: "All required fields must be filled." });
    }

    // Because we're using multer-storage-cloudinary, req.file is *already* uploaded
    // req.file.path       => secure_url
    // req.file.filename   => public_id
    // req.file.mimetype   => mime
    // req.file.originalname => original file name

    const newPackage = await Package.create({
      title,
      tagline,
      description,
      price,
      duration,
      category,
      highlights:   safeJSON(highlights, []),
      inclusions:   safeJSON(inclusions, []),
      exclusions:   safeJSON(exclusions, []),
      specialNotes,
      itinerary:    safeJSON(itinerary, []),
      priceOptions: safeJSON(priceOptions, []),

      thumbnail:         req.file.path,      // Cloudinary secure URL
      thumbnailPublicId: req.file.filename,  // Cloudinary public ID
    });
console.log("Uploaded File Info:", req.file);

    res.json({ success: true, message: "Package created successfully", data: newPackage });
  } catch (err) {
    console.error("Error creating package:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/* ---------------------------
 * GET ALL
 * ------------------------- */
const getAllPackage = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json({ success: true, packages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch packages" });
  }
};

/* ---------------------------
 * GET ONE
 * ------------------------- */
const getOnePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const foundPackage = await Package.findById(id);
    if (!foundPackage) {
      return res.json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, foundPackage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching package" });
  }
};

/* ---------------------------
 * DELETE
 * ------------------------- */
const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    const foundPackage = await Package.findById(id);
    if (!foundPackage) {
      return res.json({ success: false, message: "Package not found" });
    }

    // Clean Cloudinary asset if we stored publicId
    if (foundPackage.thumbnailPublicId) {
      try {
        await cloudinary.uploader.destroy(foundPackage.thumbnailPublicId);
      } catch (clErr) {
        console.warn("Cloudinary delete failed:", clErr.message);
      }
    }

    await Package.findByIdAndDelete(id);
    res.json({ success: true, message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete package" });
  }
};

/* ---------------------------
 * UPDATE
 * ------------------------- */
const updatePackage = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    tagline,
    description,
    price,
    duration,
    category,
    highlights,
    inclusions,
    exclusions,
    specialNotes,
    itinerary,
    priceOptions,
  } = req.body;

  try {
    const foundPackage = await Package.findById(id);
    if (!foundPackage) {
      return res.json({ success: false, message: "Package not found" });
    }

    const updatedFields = {
      title:        title        ?? foundPackage.title,
      tagline:      tagline      ?? foundPackage.tagline,
      description:  description  ?? foundPackage.description,
      price:        price        ?? foundPackage.price,
      duration:     duration     ?? foundPackage.duration,
      category:     category     ?? foundPackage.category,
      highlights:   safeJSON(highlights,   foundPackage.highlights),
      inclusions:   safeJSON(inclusions,   foundPackage.inclusions),
      exclusions:   safeJSON(exclusions,   foundPackage.exclusions),
      specialNotes: specialNotes ?? foundPackage.specialNotes,
      itinerary:    safeJSON(itinerary,    foundPackage.itinerary),
      priceOptions: safeJSON(priceOptions, foundPackage.priceOptions),
    };

    if (req.file) {
      // Delete old cloud image (best effort)
      if (foundPackage.thumbnailPublicId) {
        try {
          await cloudinary.uploader.destroy(foundPackage.thumbnailPublicId);
        } catch (clErr) {
          console.warn("Cloudinary delete failed:", clErr.message);
        }
      }
      updatedFields.thumbnail = req.file.path;        // new secure url
      updatedFields.thumbnailPublicId = req.file.filename;
    }

    const updatedPackage = await Package.findByIdAndUpdate(id, updatedFields, { new: true });
    res.json({ success: true, message: "Package updated successfully", data: updatedPackage });
  } catch (err) {
    console.error("Error updating package:", err);
    res.status(500).json({ success: false, message: "Error updating package" });
  }
};

module.exports = {
  createPackage,
  getAllPackage,
  getOnePackage,
  deletePackage,
  updatePackage,
};
