const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const APIError = require("../apiError");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name can't be empty")
    .isLength({ min: 3 })
    .withMessage("SubCategory name can't be less than 3 charachters")
    .isLength({ max: 50 })
    .withMessage("SubCategory name can't be more than 50 charachters"),
  check("category")
    .notEmpty()
    .withMessage("SubCategory Must belong to a parent Category")
    .isMongoId()
    .withMessage("Invalid Category Id format")
    .custom(async (categoryId) => {
      const category = await categoryModel.findById({ _id: categoryId });
      if (!category) {
        throw new APIError(`Category of id ${categoryId} does not exist`);
      }
    }),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id format"),
  check("category")
    .isMongoId()
    .withMessage("Invalid Category Id format")
    .custom(async (categoryId) => {
      const category = await categoryModel.findById({ _id: categoryId });
      if (!category) {
        throw new APIError(`Category of id ${categoryId} does not exist`);
      }
    }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory Id format"),
  validatorMiddleware,
];
