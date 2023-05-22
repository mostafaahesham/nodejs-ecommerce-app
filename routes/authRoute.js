const express = require("express");
const {
  signUp,
  verifyEmail,
  signIn,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");
const {
  signUpValidator,
  signInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/verifyemail/:code").put(verifyEmail);
router.route("/signin").post(signInValidator, signIn);
router.route("/forgotpassword").post(forgotPasswordValidator, forgotPassword);
router.route("/verifyresetcode").post(verifyResetCode);
router.route("/resetPassword").put(resetPasswordValidator, resetPassword);

module.exports = router;
