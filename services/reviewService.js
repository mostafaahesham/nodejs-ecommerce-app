const asyncHandler = require("express-async-handler");

const factory = require("./factoryHandlers");

const reviewModel = require("../models/reviewModel");

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject;
  next();
};

// @desc    Create review
// @route   POST    /api/v1/reviews
// @access  Private
exports.createReview = factory.createOne(reviewModel);

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(reviewModel);

// @desc    Get List of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(reviewModel);

// @desc    Delete Specific review
// @route   DELETE    /api/v1/reviews/:id
// @access  Private
exports.deleteReview = factory.deleteOne(reviewModel);
