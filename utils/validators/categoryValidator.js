const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

const APIError = require("../apiError");

const subCategoryModel = require("../../models/subCategoryModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name can't be empty")
    .isLength({ min: 3 })
    .withMessage("category name can't be less than 3 charachters")
    .isLength({ max: 50 })
    .withMessage("category name can't be more than 50 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(
      asyncHandler(async (categoryId) => {
        const subCategoriesCount = await subCategoryModel.countDocuments({
          category: categoryId,
        });
        if (subCategoriesCount) {
          throw new APIError(
            `failed to delete category of id ${categoryId}, ${subCategoriesCount} subCategories fall under this category`
          );
        }
        return true;
      })
    ),
  validatorMiddleware,
];
