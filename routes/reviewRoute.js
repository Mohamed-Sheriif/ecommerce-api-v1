const express = require("express");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../services/reviewService");

// const {
//   getReviewValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../validators/brandValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(AuthService.protect, AuthService.allowedTo("user"), createReview)
  .get(getReviews);

router
  .route("/:id")
  .get(getReview)
  .put(AuthService.protect, AuthService.allowedTo("user"), updateReview)
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager", "user"),
    deleteReview
  );

module.exports = router;
