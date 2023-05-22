const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const checkDocExistence = require("../helpers/checkDocExistence");

const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");
const brandModel = require("../../models/brandModel");

exports.createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product name can't be empty")
    .isLength({ min: 3 })
    .withMessage("Product name can't be less than 3 charachters")
    .isLength({ max: 50 })
    .withMessage("Product name can't be more than 50 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Description can't be empty")
    .isLength({ min: 10 })
    .withMessage("Description can't be less than 10 charachters")
    .isLength({ max: 200 })
    .withMessage("Description can't be more than 200 charachters"),
  check("brand")
    .notEmpty()
    .withMessage("Product must belong to a brand")
    .isMongoId()
    .withMessage("brand must be a valid mongoID")
    .custom(async (brandId) => checkDocExistence(brandModel, "id", brandId)),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("category must be a valid mongoID")
    .custom(async (categoryId) =>
      checkDocExistence(categoryModel, "id", categoryId)
    ),
  check("subCategory")
    .notEmpty()
    .withMessage("Product must belong to a subCategory")
    .isMongoId()
    .withMessage("subCategory must be a valid mongoID")
    .custom(async (subCategoryId) =>
      checkDocExistence(subCategoryModel, "id", subCategoryId)
    ),
  check("currentPrice")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .toInt()
    .withMessage("price must be a number"),
  check("discountedPrice")
    .optional()
    .isNumeric()
    .withMessage("price must be a number")
    .toInt()
    .withMessage("price must be a number")
    .custom((val, { req }) => {
      if (req.body.currentPrice <= val) {
        throw new Error("discountedPrice must be lower than currentPrice");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product Id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product Id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product Id format"),
  validatorMiddleware,
];
