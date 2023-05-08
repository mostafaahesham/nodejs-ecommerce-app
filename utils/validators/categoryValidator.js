const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name can't be empty")
    .isLength({ min: 3 })
    .withMessage("Category name can't be less than 3 charachters")
    .isLength({ max: 50 })
    .withMessage("Category name can't be more than 50 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id format"),
  validatorMiddleware,
];
