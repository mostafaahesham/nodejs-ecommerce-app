const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const APIError = require("../utils/apiError");

const categoryModel = require("../models/categoryModel");
const factory = require("./factoryHandlers");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleWare");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat("png")
    .png({ quality: 100 })
    .toFile(`static/images/categories/${filename}`);

  req.body.image = filename;

  next();
});

// @desc upload single Category Image
exports.uploadCategoryImage = uploadSingleImage(
  "image",
  "category",
  "categories"
);

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
