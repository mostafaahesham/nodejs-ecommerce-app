const productModel = require("../models/productModel");
const factory = require("./factoryHandlers");

// @desc    Create Product
// @route   POST    /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(productModel);

// @desc    Get Specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(productModel);

// @desc    Get List of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(productModel);

// @desc    Update Specific product
// @route   PUT    /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(productModel);

// @desc    Delete Specific product
// @route   DELETE    /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(productModel);
