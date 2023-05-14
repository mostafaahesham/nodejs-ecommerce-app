const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const APIError = require("../utils/apiError");
const userModel = require("../models/userModel");

const generateToken = (payload) => {
  const token = jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

// @desc    SignUp
// @route   POST    /api/v1/auth/signup
// @access  Public
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
  });

  const token = generateToken(user._id);

  res.status(201).json({ data: user, token: token });
});

// @desc    SignIn
// @route   POST    /api/v1/auth/signin
// @access  Public
exports.signIn = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new APIError("incorrect email or password");
  }

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token: token });
});

exports.auth = asyncHandler(async (req, res, next) => {
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
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await userModel.findById(decoded.userId);
  if (!user) {
    return next(new APIError(`user of id ${decoded.userId}`));
  }
  next();
});
