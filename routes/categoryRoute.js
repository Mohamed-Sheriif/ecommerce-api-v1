const express = require("express");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../services/categoryService");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../validators/categoryValidator");

const AuthService = require("../services/authService");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 61f29c5e4b0e9c4dc62b3a0a
 *         name:
 *           type: string
 *           example: Electronics
 *         slug:
 *           type: string
 *           example: electronics
 *         image:
 *           type: string
 *           example: http://localhost:8000/categories/category-image.jpg
 *         createdAt:
 *           type: string
 *           example: 2022-01-28T19:38:38.000Z
 *         updatedAt:
 *           type: string
 *           example: 2022-01-28T19:38:38.000Z
 *     CategoryListResponse:
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
 *             $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /categories/:categoryId/subCategories:
 *  use:
 *    tags:
 *      - Categories
 *    summary: Subcategories Operations
 *    description: Routes for handling subcategories under a specific category.
 */
router.use("/:categoryId/subCategories", subCategoryRoute);

/**
 * @swagger
 * /categories:
 *  post:
 *    tags:
 *      - Categories
 *    summary: Create Category
 *    description: Create a new category (requires admin or manager authorization).
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
 *                description: The name of the category
 *                example: Electronics
 *              image:
 *                type: string
 *                format: binary
 *                description: Category image file
 *    responses:
 *      201:
 *        description: Category created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Category'
 *      400:
 *        description: Invalid input
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden

 *  get:
 *    tags:
 *      - Categories
 *    summary: Get All Categories
 *    description: Retrieve a list of all categories.
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
 *        description: The number of categories per page
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *          default: createdAt
 *        description: The field to sort the results by (e.g., createdAt)
 *    responses:
 *      200:
 *        description: Categories fetched successfully
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
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);

/**
 * @swagger
 * /categories/{id}:
 *  get:
 *    tags:
 *      - Categories
 *    summary: Get Category by ID
 *    description: Retrieve a single category by its ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the category to retrieve
 *    responses:
 *      200:
 *        description: Category fetched successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Category'
 *      400:
 *        description: Bad request
 *      404:
 *        description: Category not found
 *  put:
 *    tags:
 *      - Categories
 *    summary: Update Category
 *    description: Update an existing category (requires admin or manager authorization).
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the category to retrieve
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The updated name of the category
 *                example: Electronics
 *              image:
 *                type: string
 *                format: binary
 *                description: The updated category image file
 *    responses:
 *      200:
 *        description: Category updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/Category'
 *      400:
 *        description: Invalid data
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Category not found
 *  delete:
 *    tags:
 *      - Categories
 *    summary: Delete Category
 *    description: Delete an existing category (requires admin authorization).
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the category to delete
 *    responses:
 *      204:
 *        description: Category deleted successfully
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Category not found
 */
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
