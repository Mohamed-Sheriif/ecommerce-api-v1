const express = require("express");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../validators/reviewValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("user"),
    createReviewValidator,
    createReview
  )
  .get(getReviews);

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
