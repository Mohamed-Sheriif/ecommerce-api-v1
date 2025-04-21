const express = require("express");

const {
  addProductToWishlist,
  getLoggedUserWishlist,
  removeProductFromWishlist,
} = require("../services/wishlistService");

const {
  addProductToWishlistValidator,
  removeProductFromWishlistValidator,
} = require("../validators/wishlistValidator");

const AuthService = require("../services/authService");

const router = express.Router();

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 61f29c5e4b0e9c4dc62b3a0a
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example: 671757030d1c5eafc7f31693
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *
 *   get:
 *     summary: Get the logged-in user's wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 61f29c5e4b0e9c4dc62b3a0a
 *                       title:
 *                         type: string
 *                         example: Product Title
 *                       price:
 *                         type: number
 *                         example: 29.99
 *                       imageUrl:
 *                         type: string
 *                         example: https://example.com/image.jpg
 *
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove from the wishlist
 *     responses:
 *       204:
 *         description: Product removed from wishlist successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in wishlist
 */

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .post(addProductToWishlistValidator, addProductToWishlist)
  .get(getLoggedUserWishlist);

router
  .route("/:productId")
  .delete(removeProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;
