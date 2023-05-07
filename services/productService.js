const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const variantModel = require("../models/variantModel");
const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");
const brandModel = require("../models/brandModel");
const APIError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc    Create Product
// @route   POST    /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);

  const product = await productModel.create(req.body);
  res.status(201).json({ data: product });
});

// @desc    Get List of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  // query building
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .limitFields()
    .sort();

  // execute query
  const products = await apiFeatures.mongooseQuery;

  res.status(200).json({ results: products.length, data: products });
});

// @desc    Get Specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new APIError(`No product of id ${id} exists`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Update Specific product
// @route   PUT    /api/v1/products/:id
// @access  Private

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);

  const product = await productModel.findOneAndUpdate({ _id: id }, req.body);
  if (!product) {
    return next(new APIError(`No product of id ${id} exists`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Delete Specific product
// @route   DELETE    /api/v1/products/:id
// @access  Private

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);

  if (!product) {
    return next(new APIError(`No product of id ${id} exists`, 404));
  }
  res.status(200).json({ msg: `product of id ${id} deleted` });
});
