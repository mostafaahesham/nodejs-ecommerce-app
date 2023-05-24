const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");
const APIError = require("../apiError");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid review Id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("review comment can't be more than 500 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("ratings")
    .notEmpty()
    .withMessage("review ratings are required")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("ratings must be between 1.0 & 5.0"),
  check("user").isMongoId().withMessage("invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("invalid product id format")
    .custom(async (val, { req }) => {
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
      if (req.user.role == "user") {
        const review = await reviewModel.findById(val);
        if (review.user.toString() != req.user._id.toString()) {
          throw new APIError("not allowed to perform this action");
        }
      }
    }),
  validatorMiddleware,
];
