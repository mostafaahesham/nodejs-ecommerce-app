const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./factoryHandlers");

// @desc    Create subCategory
// @route   POST    /api/v1/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(subCategoryModel);

// @desc    Get Specific subCategory by id
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategory = factory.getOne(subCategoryModel);

// Nested route
// @desc    Get List of subcategories of a specific category
// @route   GET /api/v1/categories/:categoryId/subcategories
// @route   GET /api/v1/subcategories/
// @access  Public
exports.getSubCategories = factory.getAll(subCategoryModel);

// @desc    Update Specific subcategory
// @route   PUT    /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(subCategoryModel);

// @desc    Delete Specific subcategory
// @route   DELETE    /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
