const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleWare");

const factory = require("./factoryHandlers");

const subCategoryModel = require("../models/subCategoryModel");

exports.resizeSubCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `subCategory-${uuidv4()}-${Date.now()}.png`;
  await sharp(req.file.buffer)
    .toFormat("png")
    .png({ quality: 100 })
    .toFile(`static/images/subCategories/${filename}`);

  req.body.image = filename;

  next();
});

// @desc upload single Category image
exports.uploadSubCategoryImage = uploadSingleImage(
  "image",
  "subCategory",
  "subCategories"
);

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObj = filterObject;
  next();
};

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
