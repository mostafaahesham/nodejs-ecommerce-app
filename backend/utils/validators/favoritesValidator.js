const { param } = require("express-validator");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const checkDocExistence = require("../helpers/checkDocExistence");
const productModel = require("../../models/productModel");

exports.updateFavoritesValidator = [
  param("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("invalid product Id format")
    .custom(async (val) => checkDocExistence(productModel, "id", val)),
  validatorMiddleware,
];
