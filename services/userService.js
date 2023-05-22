const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleWare");
const factory = require("./factoryHandlers");

const generateToken = require("../utils/generateToken");
const checkDocExistence = require("../utils/helpers/checkDocExistence");

const userModel = require("../models/userModel");

// @desc upload single Brand Image
exports.uploadUserImage = uploadSingleImage("image", "user", "users");

// @desc    Create user
// @route   POST    /api/v1/users
// @access  Private
exports.createUser = factory.createOne(userModel);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = factory.getOne(userModel);

// @desc    Get List of users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = factory.getAll(userModel);

// @desc    Update Specific user
// @route   PUT    /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  await checkDocExistence(userModel, "id", req.params.id);

  const doc = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      image: req.body.image,
    },
    {
      new: true,
    }
  );
  console.log(req.body.name);
  res.status(200).json({ data: doc });
});

// @desc    Update user password
// @route   PUT    /api/v1/users/changePassword/:id
// @access  Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  await checkDocExistence(userModel, "id", req.params.id);
  const doc = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: doc });
});

// @desc    Delete Specific user
// @route   DELETE    /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(userModel);

// @desc    Get Logged user Data
// @route   GET /api/v1/users/getme
// @access  Private
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updatemypassword
// @access  Private
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token: token });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateme
// @access  Private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteme
// @access  Private
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(204).json({ status: "Success" });
});
