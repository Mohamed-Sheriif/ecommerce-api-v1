const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

// Middleware to add product to req.body
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  // Nested route
  if (req.params.productId) req.body.product = req.params.productId;
  req.body.user = req.user.id;
  next();
};

/**
 * @desc    Create review
 * @route   POST /api/v1/reviews
 * @access  Private/Protect/User
 */
exports.createReview = factory.createOne(Review);

// Nested route for get reviews
// GET /api/v1/products/:productId/reviews
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

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
