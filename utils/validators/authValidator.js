const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userModel = require("../../models/userModel");
const APIError = require("../apiError");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name can't be empty")
    .isLength({ min: 2 })
    .withMessage("user name can't be less than 2 charachters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("e-mail is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      const user = await userModel.findOne({ email: val });
      if (user) {
        throw new APIError(`e-mail :'${val}' already in use`);
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password != req.body.passwordConfirm) {
        throw new APIError(`password confirmation incorrect`);
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  check("phoneNumber")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("phone number must be egyptian"),
  validatorMiddleware,
];

exports.signInValidator = [
  check("email")
    .notEmpty()
    .withMessage("e-mail is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) => {
      const user = userModel.findOne({ email: val });
      if (!user) {
        throw new APIError("incorrect email or password");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),
  validatorMiddleware,
];
