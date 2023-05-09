const userModel = require("../models/userModel");
const factory = require("./factoryHandlers");

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
exports.updateUser = factory.updateOne(userModel);

// @desc    Delete Specific user
// @route   DELETE    /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(userModel);
