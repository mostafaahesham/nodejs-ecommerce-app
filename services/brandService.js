const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const brandModel = require("../models/brandModel");
const factory = require("./factoryHandlers");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleWare");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.png`;
  await sharp(req.file.buffer)
    .toFormat("png")
    .png({ quality: 10 })
    .toFile(`static/images/brands/${filename}`);

  req.body.image = filename;

  next();
});

// @desc upload single Brand Image
exports.uploadBrandImage = uploadSingleImage("image", "brand", "brands");

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
