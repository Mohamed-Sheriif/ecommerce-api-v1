const express = require("express");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../validators/reviewValidator");

const AuthService = require("../services/authService");

// MergeParams: true is required to access params in other routes
// ex: we need to access productId from product route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  )
  .get(createFilterObject, getReviews);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    AuthService.protect,
    AuthService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
