const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const checkDocExistence = require("../helpers/checkDocExistence");
const reviewModel = require("../../models/reviewModel");
const userModel = require("../../models/userModel");
const productModel = require("../../models/productModel");

const APIError = require("../apiError");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid review Id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("comment")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("review comment can't be more than 1000 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("ratings must be between 1.0 & 5.0"),
  check("user")
    .isMongoId()
    .withMessage("invalid user id format")
    .custom(async (val) => {
      await checkDocExistence(userModel, "id", val);
      return true;
    }),
  check("product")
    .isMongoId()
    .withMessage("invalid product id format")
    .custom(async (val, { req }) => {
      await checkDocExistence(productModel, "id", val);
      const review = await reviewModel.findOne({
        user: req.body.user,
        product: req.body.product,
      });
      if (review) {
        throw new APIError("user has already created a review on this product");
      }
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid review id format")
    .custom(async (val, { req }) => {
      const review = await checkDocExistence(reviewModel, "id", val);
      if (review.user._id.toString() != req.user._id.toString()) {
        throw new APIError("not allowed to perform this action");
      }
    }),
  validatorMiddleware,
];
