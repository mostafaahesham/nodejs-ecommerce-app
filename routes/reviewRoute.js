const express = require("express");

const {
  getReviews,
  createReview,
  getReview,
  deleteReview,
} = require("../services/reviewService");
const {
  getReviewValidator,
  deleteReviewValidator,
  createReviewValidator,
} = require("../utils/validators/reviewValidator");

const auth = require("../services/authService");

const router = express.Router();

router.route("/").get(getReviews).post(createReviewValidator, createReview);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .delete(deleteReviewValidator, deleteReview);

module.exports = router;
