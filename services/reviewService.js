const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

/**
 * @desc    Create review
 * @route   POST /api/v1/reviews
 * @access  Private/Protect/User
 */
exports.createReview = factory.createOne(Review);

/**
 * @desc    Get list of reviews
 * @route   GET /api/v1/reviews
 * @access  Public
 */
exports.getReviews = factory.getAll(Review);

/**
 * @desc    Get specific review by id
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
exports.getReview = factory.getOne(Review);

/**
 * @desc    Update specific review
 * @route   PUT /api/v1/reviews/:id
 * @access  Private/Protect/User
 */
exports.updateReview = factory.updateOne(Review);

/**
 * @desc    Delete specific review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private/Protect/User-Admin-Manager
 */
exports.deleteReview = factory.deleteOne(Review);
