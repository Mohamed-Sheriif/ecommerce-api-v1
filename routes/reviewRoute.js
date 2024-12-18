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

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6719fa1d361e122914a25498"
 *         title:
 *           type: string
 *           example: "Amazing product!"
 *         ratings:
 *           type: number
 *           example: 4.5
 *         user:
 *           type: string
 *           example: "6704e0d0aa86b5687912c893"
 *         product:
 *           type: string
 *           example: "6704e0a6aa86b5687912c88b"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-10-24T07:13:21.310Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-10-24T07:13:21.310Z"
 *
 *     ReviewListResponse:
 *       type: object
 *       properties:
 *         result:
 *           type: integer
 *           example: 5
 *         paginationResult:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *             pageSize:
 *               type: integer
 *               example: 10
 *             numberOfPages:
 *               type: integer
 *               example: 1
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 */

/**
 * @swagger
 * /reviews:
 *  post:
 *    tags:
 *      - Reviews
 *    summary: Create a Review
 *    description: Add a new review for a product.
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Title of the review.
 *                example: "Amazing product!"
 *              ratings:
 *                type: number
 *                description: Rating of the product.
 *                example: 4.5
 *              user:
 *                type: string
 *                description: ID of the user who created the review.
 *                example: "6704e0d0aa86b5687912c893"
 *              product:
 *                type: string
 *                description: ID of the product being reviewed.
 *                example: "6704e0a6aa86b5687912c88b"
 *    responses:
 *      201:
 *        description: Review created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Review'
 *      401:
 *        description: Unauthorized user.
 *      403:
 *        description: Forbidden access.
 *      400:
 *        description: Validation error or bad input.
 *      500:
 *        description: Internal server error.
 *  get:
 *    tags:
 *      - Reviews
 *    summary: Get All Reviews
 *    description: Retrieve all reviews, optionally filtered by product. Supports pagination and sorting.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: productId
 *        schema:
 *          type: string
 *        description: The ID of the product to filter reviews (optional).
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: Page number for pagination.
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        description: Number of reviews per page.
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *          default: ratings
 *        description: Field to sort the results by (e.g., ratings or createdAt).
 *    responses:
 *      200:
 *        description: Reviews fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReviewListResponse'
 *      404:
 *        description: No reviews found.
 *      500:
 *        description: Internal server error.
 */
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

/**
 * @swagger
 * /reviews/{id}:
 *  get:
 *    tags:
 *      - Reviews
 *    summary: Get a Review by ID
 *    description: Retrieve a specific review by its ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the review.
 *    responses:
 *      200:
 *        description: Review fetched successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Review'
 *      404:
 *        description: Review not found.
 *  put:
 *    tags:
 *      - Reviews
 *    summary: Update a Review
 *    description: Modify an existing review by ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the review to update.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: Updated title for the review.
 *                example: Awesome Product!
 *              ratings:
 *                type: number
 *                description: Updated rating (1-5).
 *                example: 4
 *    responses:
 *      200:
 *        description: Review updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Review'
 *      400:
 *        description: Validation error or bad input.
 *      401:
 *        description: Unauthorized user.
 *      403:
 *        description: Forbidden access.
 *      404:
 *        description: Review not found.
 *  delete:
 *    tags:
 *      - Reviews
 *    summary: Delete a Review
 *    description: Remove an existing review by ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the review to delete.
 *    responses:
 *      200:
 *        description: Review deleted successfully.
 *      401:
 *        description: Unauthorized user.
 *      403:
 *        description: Forbidden access.
 *      404:
 *        description: Review not found.
 */
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
