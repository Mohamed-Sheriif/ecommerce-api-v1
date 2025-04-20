const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  updateProductQuantity,
  removeProductFromCart,
  deleteUserCart,
  applyCoupon,
} = require("../services/cartService");

const {
  addProductToCartValidator,
  updateProductQuantityValidator,
  removeProductFromCartValidator,
} = require("../validators/cartValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect, AuthService.allowedTo("user"));

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         cartItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: The ID of the product.
 *                 example: "60d21b4667d0d8992e610c85"
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product in the cart.
 *                 example: 2
 *               color:
 *                 type: string
 *                 description: The color of the product.
 *                 example: "red"
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *                 example: 29.99
 *         totalCartPrice:
 *           type: number
 *           description: The total price of the cart.
 *           example: 59.98
 *         totalPriceAfterDiscount:
 *           type: number
 *           description: The total price after applying any discounts.
 *           example: 49.98
 *         user:
 *           type: string
 *           description: The ID of the user who owns the cart.
 *           example: "60d21b4667d0d8992e610c85"
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: The ID of the product to add.
 *                 example: "60d21b4667d0d8992e610c85"
 *               color:
 *                 type: string
 *                 description: The color of the product.
 *                 example: "red"
 *     responses:
 *       200:
 *         description: Product added to cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: "success"
 *                 numOfCartItems:
 *                   type: number
 *                   description: The number of items in the cart.
 *                   example: 3
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request. Invalid input data.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 *   get:
 *     summary: Get the logged user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numOfCartItems:
 *                   type: number
 *                   description: The number of items in the cart.
 *                   example: 3
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found for the user.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete the logged user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cart deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Cart not found for the user.
 *       500:
 *         description: Internal server error.
 */
router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getLoggedUserCart)
  .delete(deleteUserCart);

/**
 * @swagger
 * /cart/applyCoupon:
 *   put:
 *     summary: Apply a coupon to the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coupon:
 *                 type: string
 *                 description: The coupon code to apply.
 *                 example: "SUMMER2023"
 *     responses:
 *       200:
 *         description: Coupon applied successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: "success"
 *                 numOfCartItems:
 *                   type: number
 *                   description: The number of items in the cart.
 *                   example: 3
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request. Invalid coupon code.
 *       404:
 *         description: Coupon not found or expired.
 *       500:
 *         description: Internal server error.
 */
router.route("/applyCoupon").put(applyCoupon);

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to update.
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The new quantity of the product.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Product quantity updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: "success"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request. Invalid input data.
 *       404:
 *         description: Product not found in cart.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Remove a product from the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to remove.
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       200:
 *         description: Product removed from cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response.
 *                   example: "success"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request. Invalid input data.
 *       404:
 *         description: Product not found in cart.
 *       500:
 *         description: Internal server error.
 */
router
  .route("/:productId")
  .put(updateProductQuantityValidator, updateProductQuantity)
  .delete(removeProductFromCartValidator, removeProductFromCart);

module.exports = router;
