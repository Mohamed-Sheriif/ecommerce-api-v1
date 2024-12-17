const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryToBody,
  createFilterObject,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../validators/subCategoryValidator");

const AuthService = require("../services/authService");

// MergeParams: true is required to access params in other routes
// ex: we need to access categoryId from category route
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * components:
 *   schemas:
 *     SubCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6704e0d0aa86b5687912c893
 *         name:
 *           type: string
 *           example: Laptops
 *         slug:
 *           type: string
 *           example: laptops
 *         category:
 *           type: string
 *           example: 6704e0a6aa86b5687912c88b
 *         createdAt:
 *           type: string
 *           example: 2024-10-08T07:35:44.240Z
 *         updatedAt:
 *           type: string
 *           example: 2024-10-08T07:35:44.240Z
 *
 *     SubCategoryListResponse:
 *       type: object
 *       properties:
 *         result:
 *           type: integer
 *           example: 7
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
 *             $ref: '#/components/schemas/SubCategory'
 */

/**
 * @swagger
 * /subCategories:
 *  post:
 *    tags:
 *      - Subcategories
 *    summary: Create Subcategory
 *    description: Create a new subcategory under a specific category.
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
 *                description: The name of the subcategory
 *                example: Smartphones
 *              category:
 *                type: string
 *                description: The ID of the parent category
 *                example: 64af8f6e71c4e07e2c5e3d62
 *    responses:
 *      201:
 *        description: Subcategory created successfully
 *        content:
 *          application/json:
 *            example:
 *              id: 64af8f6e71c4e07e2c5e3d62
 *              name: Smartphones
 *              slug: smartphones
 *              category: 64af8f6e71c4e07e2c5e3d62
 *      400:
 *        description: Invalid input
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *  get:
 *    tags:
 *      - Subcategories
 *    summary: Get All Subcategories
 *    description: Retrieve all subcategories, optionally filtered by category ID.
 *    parameters:
 *      - in: query
 *        name: categoryId
 *        schema:
 *          type: string
 *        description: The ID of the parent category to filter subcategories
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
 *        description: The number of subcategories per page
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *          default: createdAt
 *        description: The field to sort the results by (e.g., createdAt)
 *    responses:
 *      200:
 *        description: Subcategories fetched successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SubCategoryListResponse'
 *      400:
 *        description: Invalid input
 */
router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    setCategoryToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);

/**
 * @swagger
 * /subCategories/{id}:
 *  get:
 *    tags:
 *      - Subcategories
 *    summary: Get Subcategory by ID
 *    description: Retrieve a single subcategory by its ID.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the subcategory to retrieve
 *    responses:
 *      200:
 *        description: Subcategory fetched successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/SubCategory'
 *      400:
 *        description: Invalid input
 *      404:
 *        description: Subcategory not found
 *  put:
 *    tags:
 *      - Subcategories
 *    summary: Update Subcategory
 *    description: Update an existing subcategory.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the subcategory to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The updated name of the subcategory
 *                example: Updated Smartphones
 *    responses:
 *      200:
 *        description: Subcategory updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  $ref: '#/components/schemas/SubCategory'
 *      400:
 *        description: Invalid input
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Subcategory not found
 *  delete:
 *    tags:
 *      - Subcategories
 *    summary: Delete Subcategory
 *    description: Delete an existing subcategory.
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the subcategory to delete
 *    responses:
 *      204:
 *        description: Subcategory deleted successfully
 *      400:
 *        description: Invalid input
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Subcategory not found
 */
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
