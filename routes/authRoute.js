const express = require("express");
const { signUp, signIn } = require("../services/authService");
const {
  signUpValidator,
  signInValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/signin").post(signInValidator, signIn);

module.exports = router;
