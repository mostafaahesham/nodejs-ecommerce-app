const express = require("express");

const {
  getReviews,
  createReview,
  getReview,
  deleteReview,
  createFilterObject,
} = require("../services/reviewService");
const {
  getReviewValidator,
  deleteReviewValidator,
  createReviewValidator,
} = require("../utils/validators/reviewValidator");

const auth = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    auth.authenticate,
    auth.authorize("user"),
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .delete(
    auth.authenticate,
    auth.authorize("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
