const Package = require("../models/userPackage");

// Create a new package
const createPackage = async (req, res) => {
  const { title, description, price, duration, category } = req.body;

  try {
    if (!title || !description || !price || !duration || !category || !req.file) {
      return res.json({ success: false, message: "All fields are required." });
    }

    const newPackage = await Package.create({
      title,
      description,
      price,
      duration,
      category,
      thumbnail: req.file.filename
    });

    res.json({ success: true, message: "Package created successfully", data: newPackage });
  } catch (err) {
    console.error("Error creating package:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all packages
const getAllPackage = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json({ success: true, packages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch packages" });
  }
};

// Get one package
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

// Delete a package
const deletePackage = async (req, res) => {
  const { id } = req.params;

  try {
    const foundPackage = await Package.findById(id);
    if (!foundPackage) {
      return res.json({ success: false, message: "Package not found" });
    }

    await Package.findByIdAndDelete(id);
    res.json({ success: true, message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete package" });
  }
};

// Update a package
const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, duration, category } = req.body;

  try {
    const foundPackage = await Package.findById(id);
    if (!foundPackage) {
      return res.json({ success: false, message: "Package not found" });
    }

    const updatedFields = {
      title,
      description,
      price,
      duration,
      category,
    };

    if (req.file) {
      updatedFields.thumbnail = req.file.filename;
    }

    const updatedPackage = await Package.findByIdAndUpdate(id, updatedFields, { new: true });

    res.json({ success: true, message: "Package updated successfully", data: updatedPackage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating package" });
  }
};

module.exports = {
  createPackage,
  getAllPackage,
  getOnePackage,
  deletePackage,
  updatePackage
};
