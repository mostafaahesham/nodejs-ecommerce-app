const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const moment = require("moment");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const APIError = require("../apiError");

exports.getPromoCodeValidator = [
  check("id").isMongoId().withMessage("invalid promoCode Id format"),
  validatorMiddleware,
];

exports.createPromoCodeValidator = [
  check("name")
    .notEmpty()
    .withMessage("promoCode name can't be empty")
    .isLength({ min: 2 })
    .withMessage("promoCode name can't be less than 2 charachters")
    .isLength({ max: 50 })
    .withMessage("promoCode name can't be more than 50 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("expiryDate")
    .notEmpty()
    .withMessage("expiryDate is required")
    .custom((val) => {
      if (!moment(val, "M/D/YYYY", true).isValid()) {
        throw new APIError(
          "invalid date or date format. expected format: DD/MM/YYYY",
          401
        );
      }
      console.log(new Date(val));
      if (new Date(val) < Date.now()) {
        throw new APIError("expiry date cannot be earlier than today", 401);
      }
      return true;
    }),
  check("type")
    .notEmpty()
    .withMessage("promoCode type is required")
    .custom((val) => {
      if (val != "$" && val != "%") {
        throw new APIError("invalid type. expected % or $", 401);
      }
      return true;
    }),
  check("value")
    .notEmpty()
    .withMessage("promoCode value is required")
    .isNumeric()
    .withMessage("promoCode value must be a number")
    .custom((val, { req }) => {
      if (req.body.type == "%") return val >= 1 && val <= 100;
      if (req.body.type == "$") return val >= 1;

      return true;
    })
    .withMessage("promoCode value out of boundaries"),
  validatorMiddleware,
];

exports.updatePromoCodeValidator = [
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("promoCode name can't be less than 2 charachters")
    .isLength({ max: 50 })
    .withMessage("promoCode name can't be more than 50 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("expiryDate")
    .optional()
    .custom((val) => {
      if (!moment(val, "M/D/YYYY", true).isValid()) {
        throw new APIError(
          "invalid date or date format. expected format: DD/MM/YYYY",
          401
        );
      }
      console.log(new Date(val));
      if (new Date(val) < Date.now()) {
        throw new APIError("expiry date cannot be earlier than today", 401);
      }
      return true;
    }),
  check("type")
    .optional()
    .custom((val) => {
      if (val != "$" && val != "%") {
        throw new APIError("invalid type. expected % or $", 401);
      }
      return true;
    }),
  check("value")
    .optional()
    .isNumeric()
    .withMessage("promoCode value must be a number")
    .custom((val, { req }) => {
      if (req.body.type == "%") return val >= 1 && val <= 100;
      if (req.body.type == "$") return val >= 1;

      return true;
    })
    .withMessage("promoCode value out of boundaries"),
  validatorMiddleware,
];

exports.deletePromoCodeValidator = [
  check("id").isMongoId().withMessage("invalid promoCode id format"),
  validatorMiddleware,
];
