const { check, body, param } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.addToCartValidator = [
  body("productId")
    .notEmpty()
    .withMessage("productId can't be empty")
    .isMongoId()
    .withMessage("invalid product id format"),
  body("colorId")
    .notEmpty()
    .withMessage("colorId can't be empty")
    .isMongoId()
    .withMessage("invalid color id format"),
  body("sizeId")
    .notEmpty()
    .withMessage("sizeId can't be empty")
    .isMongoId()
    .withMessage("invalid size id format"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity can't be empty")
    .isInt({
      min: 1,
    })
    .withMessage("min quantity is 1"),
  validatorMiddleware,
];

exports.applyPromoCodeValidator = [
  body("promoCode").notEmpty().withMessage("promoCode can't be empty"),
  validatorMiddleware,
];
