const express = require("express");

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 61f29c5e4b0e9c4dc62b3a0a
 *         alias:
 *           type: string
 *           example: Home
 *         details:
 *           type: string
 *           example: 123 Main St, Apt 4B
 *         city:
 *           type: string
 *           example: New York
 *         postalCode:
 *           type: string
 *           example: 10001
 */

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Add a new address for the logged-in user
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 example: Home
 *               details:
 *                 type: string
 *                 example: 123 Main St, Apt 4B
 *               city:
 *                 type: string
 *                 example: New York
 *               postalCode:
 *                 type: string
 *                 example: 10001
 *     responses:
 *       201:
 *         description: Address added successfully
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
 *                     $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all addresses of the logged-in user
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Addresses not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /addresses/{addressId}:
 *   delete:
 *     summary: Remove an address by ID
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
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
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */

const {
  addAddress,
  getLoggedUserAddresses,
  removeAddress,
} = require("../services/addressService");

const { addressValidator } = require("../validators/addressValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .post(addressValidator, addAddress)
  .get(getLoggedUserAddresses);

router.route("/:addressId").delete(removeAddress);

module.exports = router;
