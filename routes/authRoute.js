const express = require("express");
const {
  signUp,
  signIn,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");
const {
  signUpValidator,
  signInValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/signin").post(signInValidator, signIn);
router.route("/forgotpassword").post(forgotPassword);
router.route("/verifyresetcode").post(verifyResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
