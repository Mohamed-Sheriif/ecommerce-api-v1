const express = require("express");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../services/brandService");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validators/brandValidator");

const AuthService = require("../services/authService");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 61f29c5e4b0e9c4dc62b3a0a
 *         name:
 *           type: string
 *           example: Samsung
 *         slug:
 *           type: string
 *           example: samsung
 *         image:
 *           type: string
 *           example: http://localhost:8000/brands/brand-image.jpg
 *         createdAt:
 *           type: string
 *           example: 2022-01-28T19:38:38.000Z
 *         updatedAt:
 *           type: string
 *           example: 2022-01-28T19:38:38.000Z
 *     BrandListResponse:
 *       type: object
 *       properties:
 *         result:
 *           type: integer
 *           example: 10
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
 *               example: 2
 *             nextPage:
 *               type: integer
 *               example: 2
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Brand'
 */

/**
 * @swagger
 * /brands:
 *  post:
 *    tags:
 *      - Brands
 *    summary: Create Brand
 *    description: Create a new Brand (requires admin or manager authorization).
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the Brand
 *                example: Electronics
 *              image:
 *                type: string
 *                format: binary
 *                description: Brand image file
 *    responses:
 *      201:
 *        description: Brand created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Brand'
 *      400:
 *        description: Invalid input
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden

 *  get:
 *    tags:
 *      - Brands
 *    summary: Get All Brands
 *    description: Retrieve a list of all Brands.
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        description: The page number for pagination
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        description: The number of Brands per page
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *          default: name
 *        description: The field to sort the results by (e.g., name)
 *    responses:
 *      200:
 *        description: Brands fetched successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryListResponse'
 *      400:
 *        description: Bad request
 */
router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);

/**
 * @swagger
 * /brands/{id}:
 *  get:
 *    tags:
 *      - Brands
 *    summary: Get Brands by ID
 *    description: Retrieve a single Brands by its ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the Brands to retrieve
 *    responses:
 *      200:
 *        description: Brands fetched successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Brand'
 *      400:
 *        description: Bad request
 *      404:
 *        description: Brands not found
 *  put:
 *    tags:
 *      - Brands
 *    summary: Update Brands
 *    description: Update an existing Brands (requires admin or manager authorization).
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the Brands to retrieve
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The updated name of the brand
 *              description:
 *                type: string
 *                description: The updated description of the brand
 *              image:
 *                type: string
 *                format: binary
 *                description: The updated brand image file
 *    responses:
 *      200:
 *        description: Brand updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Brand'
 *      400:
 *        description: Invalid data
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Brand not found
 *  delete:
 *    tags:
 *      - Brands
 *    summary: Delete Brand
 *    description: Delete an existing Brand (requires admin authorization).
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the Brands to delete
 *    responses:
 *      204:
 *        description: Brands deleted successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Brands not found
 */

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
