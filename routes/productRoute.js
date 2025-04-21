const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/productValidator");

const AuthService = require("../services/authService");
const ReviewRouter = require("./reviewRoute");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 1234567890abcdef
 *         title:
 *           type: string
 *           example: "Product Title"
 *         slug:
 *           type: string
 *           example: "product-title"
 *         description:
 *           type: string
 *           example: "Product description goes here."
 *         quantity:
 *           type: integer
 *           example: 100
 *         sold:
 *           type: integer
 *           example: 50
 *         price:
 *           type: number
 *           example: 29.99
 *         priceAfterDiscount:
 *           type: number
 *           example: 19.99
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *             example: "red"
 *         imageCover:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: "https://example.com/image1.jpg"
 *         category:
 *           type: string
 *           example: "Electronics"
 *         subCategories:
 *           type: array
 *           items:
 *             type: string
 *             example: "Smartphones"
 *         brand:
 *           type: string
 *           example: "Apple"
 *         ratingsAverage:
 *           type: number
 *           example: 4.5
 *         ratingsQuantity:
 *           type: integer
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T12:00:00Z"
 */

// Nested Route (Valid for these routes)
// POST /api/v1/products/:productId/reviews
// GET /api/v1/products/:productId/reviews
// GET /api/v1/products/:productId/reviews/:reviewId
router.use("/:productId/reviews", ReviewRouter);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Product Title"
 *               description:
 *                 type: string
 *                 example: "Product description goes here."
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               sold:
 *                 type: integer
 *                 example: 50
 *               price:
 *                 type: number
 *                 example: 29.99
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "red"
 *               imageCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               category:
 *                 type: string
 *                 example: "64ed974a5cdc4315e86eb4fd"
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "64ed974a5cdc4315e86eb4fd"
 *               brand:
 *                 type: string
 *                 example: "64ed974a5cdc4315e86eb4fd"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of products per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sort
 *         in: query
 *         description: Sort order (e.g., price, createdAt)
 *         required: false
 *         schema:
 *           type: string
 *           example: "price"
 *       - name: fields
 *         in: query
 *         description: Fields to include in the response (comma-separated)
 *         required: false
 *         schema:
 *           type: string
 *           example: "title,price"
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  )
  .get(getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *           example: 1234567890abcdef
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *           example: 1234567890abcdef
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Product Title"
 *               description:
 *                 type: string
 *                 example: "Updated product description goes here."
 *               quantity:
 *                 type: integer
 *                 example: 150
 *               sold:
 *                 type: integer
 *                 example: 60
 *               price:
 *                 type: number
 *                 example: 39.99
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "red"
 *               imageCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Smartphones"
 *               brand:
 *                 type: string
 *                 example: "Apple"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *           example: 1234567890abcdef
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
