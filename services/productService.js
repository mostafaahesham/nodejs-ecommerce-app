const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const factory = require("./factoryHandlers");
const APIError = require("../utils/apiError");

const memoryStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new APIError("invalid file format", 404), false);
  }
};

const upload = multer({ storage: memoryStorage, fileFilter: multerFilter });

exports.uploadProductVariantImages = upload.array([
  { name: "variants[0][image]", maxCount: 1 },
  { name: "variants[0][images]", maxCount: 5 },
]);

exports.uploadProductVariantImages = upload.single("variants[0][image]");

exports.resizeProductVariantImages = asyncHandler(async (req, res, next) => {
    console.log(req.file);
  //     const filename = `product-${uuidv4()}-${Date.now()}.png`;
  //     await sharp(req.file.buffer)
  //       .resize(100, 100)
  //       .toFormat("png")
  //       .png({ quality: 50 })
  //       .toFile(`static/images/subCategories/${filename}`);

  //     req.body.image = filename;

  next();
});

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
