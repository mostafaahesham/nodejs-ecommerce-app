const categoryModel = require("../models/categoryModel");
const factory = require("./factoryHandlers");

// @desc    Create category
// @route   POST    /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(categoryModel);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(categoryModel);

// @desc    Get List of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(categoryModel);

// @desc    Update Specific category
// @route   PUT    /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(categoryModel);

// @desc    Delete Specific category
// @route   DELETE    /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(categoryModel);
