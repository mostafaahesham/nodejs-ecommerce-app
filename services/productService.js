const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const factory = require("./factoryHandlers");
const APIError = require("../utils/apiError");

const productModel = require("../models/productModel");

const memoryStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new APIError("invalid file format", 404), false);
  }
};

const upload = multer({ storage: memoryStorage, fileFilter: multerFilter });

exports.uploadProductVariantImages = upload.fields(
  Array.from({ length: 10 }, (_, index) => [
    { name: `variants[${index}][variantImages]` },
    { name: `variants[${index}][variantImage]` },
  ]).flatMap((arr) => arr)
);

exports.resizeProductVariantImages = asyncHandler(async (req, res, next) => {
  const variants = req.body.variants;
  const variantsImagesCount = [];

  // number of files
  const files = req.files;
  const fileKeys = Object.keys(files);
  const numberOfVariants = fileKeys.length / 2;
  // console.log(fileKeys);

  for (
    let i = 1, j = 0;
    i <= fileKeys.length && j < numberOfVariants;
    i += 2, j++
  ) {
    const color = variants[j].color;
    const variantColorImage = `product-${color}-${uuidv4()}-${Date.now()}.png`;
    if (files[fileKeys[j * 2]].length > 1) {
      console.log(files[fileKeys[j * 2]].length);
      throw new APIError("only one image is allowed for variantImage", 404);
    }
    await sharp(files[fileKeys[j]][0].buffer)
      .toFormat("png")
      .png({ quality: 100 })
      .toFile(`static/images/products/${variantColorImage}`);

    variantsImagesCount.push(files[fileKeys[i]].length);
    const variantImages = [];
    for (let k = 0; k < variantsImagesCount[j]; k++) {
      const variantColorImages = `product-${color}-${uuidv4()}-${Date.now()}.png`;
      await sharp(files[fileKeys[i]][k].buffer)
        .toFormat("png")
        .png({ quality: 100 })
        .toFile(`static/images/products/${variantColorImages}`);
      variantImages.push(
        `${process.env.BASE_URL}/images/products/${variantColorImages}`
      );
    }
    req.body.variants[
      j
    ].variantImage = `${process.env.BASE_URL}/images/products/${variantColorImage}`;
    req.body.variants[j].variantImages = variantImages;
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
exports.getProduct = factory.getOne(productModel, "reviews");

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
