const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

const APIError = require("../utils/apiError");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const checkDocExistence = require("../utils/helpers/checkDocExistence");

const userModel = require("../models/userModel");

// @desc    Sign Up
// @route   POST    /api/v1/auth/signup
// @access  Public
exports.signUp = asyncHandler(async (req, res, next) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    confirmationCode: code,
  });

  const token = generateToken(user._id);

  const confirmationLink = `${process.env.BASE_URL}/api/v1/auth/verifyemail/${code}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Verification link",
      message: confirmationLink,
    });
  } catch (err) {
    return next(
      new APIError("an error happned while trying to send this email", 500)
    );
  }

  res.status(201).json({ data: user, token: token });
});

// @desc    Verify email
// @route   GET    /api/v1/auth/verfifyemail/:code
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  console.log(req.params.code);

  const user = await userModel.findOneAndUpdate(
    { confirmationCode: req.params.code },
    {
      isVerified: true,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new APIError("user not found", 404));
  }

  res.status(201).json({ msg: `email: ${user.email} successfully verified` });
});

// @desc    Sign In
// @route   POST    /api/v1/auth/signin
// @access  Public
exports.signIn = asyncHandler(async (req, res, next) => {
  const user = await checkDocExistence(userModel, "email", req.body.email);

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new APIError("incorrect email or password", 400));
  }
  if (!user.isVerified) {
    return next(new APIError("email not verified", 400));
  }

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token: token });
});

exports.authenticate = asyncHandler(async (req, res, next) => {
  // check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new APIError("not authorized", 401));
  }

  // check if token is valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check if user exists
  const user = await checkDocExistence(userModel, "id", decoded.userId);

  // check if user changed password
  if (user.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(passwordChangedTimeStamp, decoded.iat);
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new APIError(
          `user of id ${decoded.userId} has recently changed password, please login again.`,
          401
        )
      );
    }
  }
  req.user = user;
  next();
});

exports.authorize = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new APIError("not authorized", 403));
    }
    next();
  });

// @desc    Forogt Password
// @route   POST    /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await checkDocExistence(userModel, "email", req.body.email);

  const passwordResetCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const hashedPasswordResetCode = crypto
    .createHash("sha256")
    .update(passwordResetCode)
    .digest("hex");

  user.passwordResetCode = hashedPasswordResetCode;
  user.passwordResetCodeExpiryDate = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Code",
      message: `this is your password reset code ${passwordResetCode} vaild for 10 minutes`,
    });
  } catch (err) {
    user.passwordResetCode = null;
    user.passwordResetCodeExpiryDate = null;
    user.passwordResetVerified = null;

    await user.save();
    return next(
      new APIError("an error happned while trying to send this email", 500)
    );
  }

  res
    .status(200)
    .json({ status: "success", message: `Reset Code sent to ${user.email}` });
});

// @desc    Verify reset code
// @route   POST    /api/v1/auth/verifyresetcode
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedPasswordResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashedPasswordResetCode,
    passwordResetCodeExpiryDate: { $gt: Date.now() },
  });

  if (!user) {
    return next(new APIError("invalid or expired reset code", 401));
  }

  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "success" });
});

// @desc    reset password
// @route   PUT    /api/v1/auth/resetpassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await checkDocExistence(userModel, "email", req.body.email);

  if (!user.passwordResetVerified) {
    return next(new APIError(`reset code not verified`, 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = null;
  user.passwordResetCodeExpiryDate = null;
  user.passwordResetVerified = null;

  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({ data: user, token: token });
});
