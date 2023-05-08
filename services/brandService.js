const brandModel = require("../models/brandModel");
const factory = require("./factoryHandlers");

// @desc    Create brand
// @route   POST    /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(brandModel);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(brandModel);

// @desc    Get List of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(brandModel);

// @desc    Update Specific brand
// @route   PUT    /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(brandModel);

// @desc    Delete Specific brand
// @route   DELETE    /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(brandModel);
