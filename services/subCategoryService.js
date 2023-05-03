const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../models/subCategoryModel");
const APIError = require("../utils/apiError");
const categoryModel = require("../models/categoryModel");

// @desc    Create subCategory
// @route   POST    /api/v1/subcategories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const categoryDoc = await categoryModel.findOne({ _id: category });
  if (!categoryDoc) {
    return next(new APIError(`No Category of id ${category} exists`, 404));
  }

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

// @desc    Get Specific subCategory by id
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const SubCategory = await subCategoryModel.findById(id);
  if (!SubCategory) {
    return next(new APIError(`No subCategory of id ${id} exists`, 404));
  }
  res.status(200).json({ data: SubCategory });
});

// Nested route
// @desc    Get List of subcategories of a specific category
// @route   GET /api/v1/categories/:categoryId/subcategories
// @route   GET /api/v1/subcategories/
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const { categoryId } = req.params;
  console.log(categoryId);

  const filterObject = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};

  const subCategories = await subCategoryModel
    .find(filterObject)
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc    Update Specific subcategory
// @route   PUT    /api/v1/categories/:id
// @access  Private

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const categoryDoc = await categoryModel.findOne({ _id: category });
  if (!categoryDoc) {
    return next(new APIError(`No Category of id ${category} exists`, 404));
  }

  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: id },
    { name: name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    return next(new APIError(`No SubCategory of id ${id} exists`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc    Delete Specific subcategory
// @route   DELETE    /api/v1/subcategories/:id
// @access  Private

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new APIError(`No SubCategory of id ${id} exists`, 404));
  }
  res.status(200).json({ msg: `subcategory of id ${id} deleted` });
});
