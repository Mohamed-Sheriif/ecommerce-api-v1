const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const Review = require("../models/reviewModel");

exports.getReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required!")
    .isMongoId()
    .withMessage("Invalid review id format!"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Review ratings required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("user")
    .notEmpty()
    .withMessage("Review must belong to a user")
    .isMongoId()
    .withMessage("Invalid User id format!"),
  check("product")
    .notEmpty()
    .withMessage("Review must belong to a product")
    .isMongoId()
    .withMessage("Invalid Product id format!")
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });

      if (review) {
        throw new Error(
          "Review already submitted for this product by this user"
        );
      }
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required!")
    .isMongoId()
    .withMessage("Invalid Review id format!")
    .custom(async (val, { req }) => {
      const review = await Review.findById(req.params.id);

      // Check if review exists
      if (!review) {
        throw new Error("Review not found!");
      }

      // Check if review belongs to the user
      if (review.user.toString() !== req.user._id.toString()) {
        throw new Error("You are not authorized to update this review");
      }
    }),
  check("title").optional(),
  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required!")
    .isMongoId()
    .withMessage("Invalid review id format!")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(req.params.id);

        // Check if review exists
        if (!review) {
          throw new Error("Review not found!");
        }

        // Check if review belongs to the user
        if (review.user.toString() !== req.user._id.toString()) {
          throw new Error("You are not authorized to delete this review");
        }
      }
    }),
  validatorMiddleware,
];
