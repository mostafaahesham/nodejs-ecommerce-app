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

exports.uploadProductVariantImages = upload.fields([
  { name: "variants[0][image]" },
  { name: "variants[0][images]" },
  { name: "variants[1][image]" },
  { name: "variants[1][images]" },
  { name: "variants[2][image]" },
  { name: "variants[2][images]" },
]);

exports.resizeProductVariantImages = asyncHandler(async (req, res, next) => {
  const variants = req.body.variants;
  const variantsImagesCount = [];

  // number of files
  const files = req.files;
  const fileKeys = Object.keys(files);
  const numberOfVariants = fileKeys.length / 2;
  console.log(fileKeys);
  console.log("number of variants: " + numberOfVariants);

  for (
    let i = 1, j = 0;
    i <= fileKeys.length && j < numberOfVariants;
    i += 2, j++
  ) {
    variantsImagesCount.push(files[fileKeys[i]].length);
    const nullImages = [];
    for (let k = 0; k < variantsImagesCount[j]; k++) {
      nullImages.push("null");
    }
    req.body.variants[j].image = "null";
    req.body.variants[j].images = nullImages;
  }

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
