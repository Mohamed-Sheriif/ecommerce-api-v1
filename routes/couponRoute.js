const express = require("express");

const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../validators/couponValidator");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("admin", "manager"));

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6704e0d0aa86b5687912c893
 *         name:
 *           type: string
 *           example: NEWYEAR2024
 *         expire:
 *           type: string
 *           format: date-time
 *           example: 2024-12-31T23:59:59.000Z
 *         discount:
 *           type: number
 *           example: 20
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-10-08T07:35:44.240Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-10-08T07:35:44.240Z
 *
 *     CouponListResponse:
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
 *             $ref: '#/components/schemas/Coupon'
 */

/**
 * @swagger
 * /coupons:
 *  post:
 *    tags:
 *      - Coupons
 *    summary: Create a Coupon
 *    description: Add a new coupon to the system.
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Unique name for the coupon.
 *                example: BLACKFRIDAY50
 *              expire:
 *                type: string
 *                format: date
 *                description: Expiration date of the coupon.
 *                example: 2024-12-31
 *              discount:
 *                type: number
 *                description: Discount percentage for the coupon.
 *                example: 50
 *    responses:
 *      201:
 *        description: Coupon created successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Coupon'
 *      400:
 *        description: Validation error or bad input.
 *      401:
 *        description: Unauthorized.
 *      403:
 *        description: Forbidden.
 *      500:
 *        description: Internal server error.
 *  get:
 *    tags:
 *      - Coupons
 *    summary: Get All Coupons
 *    description: Retrieve a list of all available coupons with optional pagination and sorting.
 *    security:
 *      - bearerAuth: []
 *    parameters:
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
 *        description: Number of coupons to retrieve per page.
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *          default: createdAt
 *        description: Sort coupons by field (e.g., createdAt).
 *    responses:
 *      200:
 *        description: Coupons retrieved successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CouponListResponse'
 *      401:
 *        description: Unauthorized.
 *      403:
 *        description: Forbidden.
 *      500:
 *        description: Internal server error.
 */
router.route("/").post(createCouponValidator, createCoupon).get(getCoupons);

/**
 * @swagger
 * /coupons/{id}:
 *  get:
 *    tags:
 *      - Coupons
 *    summary: Get Coupon by ID
 *    description: Retrieve details of a specific coupon by its ID.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the coupon.
 *    responses:
 *      200:
 *        description: Coupon retrieved successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Coupon'
 *      400:
 *        description: Validation error or bad input.
 *      401:
 *        description: Unauthorized.
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Coupon not found.
 *      500:
 *        description: Internal server error.
 *  put:
 *    tags:
 *      - Coupons
 *    summary: Update a Coupon
 *    description: Update the details of an existing coupon by its ID.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the coupon to update.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: New name for the coupon.
 *                example: SPRINGSALE30
 *              expire:
 *                type: string
 *                format: date
 *                description: Updated expiration date of the coupon.
 *                example: 2025-01-15
 *              discount:
 *                type: number
 *                description: Updated discount percentage.
 *                example: 30
 *    responses:
 *      200:
 *        description: Coupon updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Coupon'
 *      400:
 *        description: Validation error or bad input.
 *      401:
 *        description: Unauthorized.
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Coupon not found.
 *      500:
 *        description: Internal server error.
 *  delete:
 *    tags:
 *      - Coupons
 *    summary: Delete a Coupon
 *    description: Remove an existing coupon by its ID.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID of the coupon to delete.
 *    responses:
 *      200:
 *        description: Coupon deleted successfully.
 *      400:
 *        description: Validation error or bad input.
 *      401:
 *        description: Unauthorized.
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Coupon not found.
 *      500:
 *        description: Internal server error.
 */
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
