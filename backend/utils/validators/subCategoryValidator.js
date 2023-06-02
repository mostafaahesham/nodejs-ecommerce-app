const { check, body, param } = require("express-validator");
const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const checkDocExistence = require("../helpers/checkDocExistence");

const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");

const APIError = require("../apiError");

exports.getSubCategoriesValidator = [
  param("categoryId")
    .optional()
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(async (val) => await checkDocExistence(categoryModel, "id", val)),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name can't be empty")
    .isLength({ min: 3 })
    .withMessage("subCategory name can't be less than 3 charachters")
    .isLength({ max: 50 })
    .withMessage("subCategory name can't be more than 50 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must belong to a parent category")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(async (categoryId) =>
      checkDocExistence(categoryModel, "id", categoryId)
    ),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  check("category")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(async (categoryId) =>
      checkDocExistence(categoryModel, "id", categoryId)
    ),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid subCategory id format")
    .custom(
      asyncHandler(async (subCategoryId) => {
        const productsCount = await productModel.countDocuments({
          subCategory: subCategoryId,
        });
        if (productsCount) {
          throw new APIError(
            `failed to delete subCategory of id ${subCategoryId}, ${productsCount} products fall under this subCategory`
          );
        }
        return true;
      })
    ),
  validatorMiddleware,
];
