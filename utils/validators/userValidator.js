const bcrypt = require("bcrypt");
const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const userModel = require("../../models/userModel");
const APIError = require("../apiError");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
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

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new APIError(`no user of id ${req.params.id} exists`);
      }
      // verify current password
      const verifyCurrentPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!verifyCurrentPassword) {
        throw new APIError(`incorrect current password`);
      }
      // password confirmation
      if (val != req.body.newPasswordConfirm) {
        throw new APIError(`password confirmation incorrect`);
      }
      return true;
    }),
  check("newPasswordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user id format"),
  validatorMiddleware,
];
