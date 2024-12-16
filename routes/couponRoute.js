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
 * /coupons:
 *  post:
 *    tags:
 *      - Coupons
 *    summary: Create a Coupon
 *    description: Add a new coupon to the system.
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
 *            example:
 *              id: 12345
 *              name: BLACKFRIDAY50
 *              expire: 2024-12-31T00:00:00.000Z
 *              discount: 50
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
 *          default: name
 *        description: Sort coupons by field (e.g., name).
 *    responses:
 *      200:
 *        description: Coupons retrieved successfully.
 *        content:
 *          application/json:
 *            example:
 *              total: 3
 *              page: 1
 *              limit: 10
 *              data:
 *                - id: 12345
 *                  name: BLACKFRIDAY50
 *                  expire: 2024-12-31T00:00:00.000Z
 *                  discount: 50
 *                - id: 67890
 *                  name: SUMMER20
 *                  expire: 2024-06-30T00:00:00.000Z
 *                  discount: 20
 *                - id: 13579
 *                  name: NEWYEAR25
 *                  expire: 2025-01-01T00:00:00.000Z
 *                  discount: 25
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
 *            example:
 *              id: 12345
 *              name: BLACKFRIDAY50
 *              expire: 2024-12-31T00:00:00.000Z
 *              discount: 50
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
 *            example:
 *              id: 12345
 *              name: SPRINGSALE30
 *              expire: 2025-01-15T00:00:00.000Z
 *              discount: 30
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
