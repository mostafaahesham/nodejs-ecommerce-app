const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product name can't be empty")
    .isLength({ min: 3 })
    .withMessage("Product name can't be less than 3 charachters")
    .isLength({ max: 50 })
    .withMessage("Product name can't be more than 50 charachters"),
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
    .withMessage("brand must be a valid mongoID"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("category must be a valid mongoID"),
  check("subCategory")
    .notEmpty()
    .withMessage("Product must belong to a subCategory")
    .isMongoId()
    .withMessage("subCategory must be a valid mongoID"),
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
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product Id format"),
  validatorMiddleware,
];
