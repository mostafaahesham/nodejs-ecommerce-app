const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userModel = require("../../models/userModel");
const APIError = require("../apiError");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name can't be empty")
    .isLength({ min: 2 })
    .withMessage("User name can't be less than 2 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("E-mail is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
        const user = await userModel.findOne({ email: val });
        if (user) {
          throw new APIError(`E-mail '${val}' already in use`);
        }
      }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Phone number must be Egyptian"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id format"),
  validatorMiddleware,
];
