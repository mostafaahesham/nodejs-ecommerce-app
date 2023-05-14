const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const factory = require("./factoryHandlers");
const APIError = require("../utils/apiError");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleWare");

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
  if (!doc) {
    return next(new APIError(`No user of id ${req.params.id} exists`, 404));
  }
  res.status(200).json({ data: doc });
});

// @desc    Update user password
// @route   PUT    /api/v1/users/changePassword/:id
// @access  Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const doc = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
    },
    {
      new: true,
    }
  );
  if (!doc) {
    return next(new APIError(`No user of id ${req.params.id} exists`, 404));
  }
  res.status(200).json({ data: doc });
});

// @desc    Delete Specific user
// @route   DELETE    /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(userModel);
