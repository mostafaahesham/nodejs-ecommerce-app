const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");
const APIError = require("../utils/apiError");

// @desc    Get List of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await categoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new APIError(`No Category of id ${id} exists`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Create category
// @route   POST    /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const {name} = req.body;

  const category = await categoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc    Update Specific category
// @route   PUT    /api/v1/categories/:id
// @access  Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await categoryModel.findOneAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new APIError(`No Category of id ${id} exists`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Delete Specific category
// @route   DELETE    /api/v1/categories/:id
// @access  Private

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new APIError(`No Category of id ${id} exists`, 404));
  }
  res.status(200).json({ msg: `category of id ${id} deleted` });
});
