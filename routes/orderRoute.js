const express = require("express");

const {
  createCashOrder,
  getOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  filterOrdersByLoggedUser,
  checkoutSession,
} = require("../services/orderService");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user who placed the order.
 *           example: "60d21b4667d0d8992e610c85"
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
 *         shippingAddress:
 *           type: object
 *           properties:
 *             details:
 *               type: string
 *               description: The details of the shipping address.
 *               example: "123 Main St, Apt 4B"
 *             phone:
 *               type: string
 *               description: The phone number of the recipient.
 *               example: "+1234567890"
 *             city:
 *               type: string
 *               description: The city of the shipping address.
 *               example: "New York"
 *             postalCode:
 *               type: string
 *               description: The postal code of the shipping address.
 *               example: "10001"
 *         taxPrice:
 *           type: number
 *           description: The tax price of the order.
 *           example: 5.00
 *         shippingPrice:
 *           type: number
 *           description: The shipping price of the order.
 *           example: 10.00
 *         totalOrderPrice:
 *           type: number
 *           description: The total price of the order.
 *           example: 50.00
 *         paymentMethodType:
 *           type: string
 *           enum: ["card", "cash"]
 *           description: The payment method type.
 *           example: "card"
 *         isPaid:
 *           type: boolean
 *           description: Indicates whether the order has been paid.
 *           example: true
 *         paidAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was paid.
 *           example: "2023-10-01T12:34:56Z"
 *         isDelivered:
 *           type: boolean
 *           description: Indicates whether the order has been delivered.
 *           example: true
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was delivered.
 *           example: "2023-10-02T12:34:56Z"
 */

/**
 * @swagger
 * /orders/checkout-session/{cartId}:
 *   get:
 *     summary: Create a checkout session for a cart
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: The ID of the cart to create a checkout session for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Checkout session created successfully.
 *       400:
 *         description: Bad request, invalid cart ID or order data.
 *       404:
 *         description: Cart not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/checkout-session/:cartId",
  AuthService.allowedTo("user"),
  checkoutSession
);

/**
 * @swagger
 * /orders/{cartId}:
 *   post:
 *     summary: Create a cash order for a cart
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: The ID of the cart to create an order for.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Order created successfully.
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request, invalid cart ID or order data.
 *       404:
 *         description: Cart not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/:cartId", AuthService.allowedTo("user"), createCashOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: integer
 *                   example: 10
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     numberOfPages:
 *                       type: integer
 *                       example: 2
 *                     nextPage:
 *                       type: integer
 *                       example: 2
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized, user not logged in or insufficient permissions.
 *       403:
 *         description: Forbidden, user not allowed to access this resource.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/",
  AuthService.allowedTo("admin", "manager", "user"),
  filterOrdersByLoggedUser,
  getOrders
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized, user not logged in or insufficient permissions.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", AuthService.allowedTo("admin", "manager", "user"), getOrder);

/**
 * @swagger
 * /orders/{id}/pay:
 *   put:
 *     summary: Update an order to paid
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order updated to paid successfully.
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized, user not logged in or insufficient permissions.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/:id/pay",
  AuthService.allowedTo("admin", "manager"),
  updateOrderToPaid
);

/**
 * @swagger
 * /orders/{id}/deliver:
 *   put:
 *     summary: Update an order to delivered
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order updated to delivered successfully.
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized, user not logged in or insufficient permissions.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/:id/deliver",
  AuthService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;
