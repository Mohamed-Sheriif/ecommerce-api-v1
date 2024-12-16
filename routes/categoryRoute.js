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
 *      400:
 *        description: Invalid data
 *  get:
 *    tags:
 *      - Categories
 *    summary: Get All Categories
 *    description: Retrieve a list of all categories.
 *    responses:
 *      200:
 *        description: Categories fetched successfully
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
 *              description:
 *                type: string
 *                description: The updated description of the category
 *              image:
 *                type: string
 *                format: binary
 *                description: The updated category image file
 *    responses:
 *      200:
 *        description: Category updated successfully
 *      400:
 *        description: Invalid data
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
