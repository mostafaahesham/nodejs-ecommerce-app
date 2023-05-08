const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name can't be empty")
    .isLength({ min: 2 })
    .withMessage("Brand name can't be less than 2 charachters")
    .isLength({ max: 50 })
    .withMessage("Brand name can't be more than 50 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id format"),
  validatorMiddleware,
];
