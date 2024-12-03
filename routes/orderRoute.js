const express = require("express");

const {
  createCashOrder,
  getOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  filterOrdersByLoggedUser,
} = require("../services/orderService");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect);

router.post("/:cartId", AuthService.allowedTo("user"), createCashOrder);

router.get(
  "/",
  AuthService.allowedTo("admin", "manager", "user"),
  filterOrdersByLoggedUser,
  getOrders
);
router.get("/:id", AuthService.allowedTo("admin", "manager", "user"), getOrder);

router.put(
  "/:id/pay",
  AuthService.allowedTo("admin", "manager"),
  updateOrderToPaid
);

router.put(
  "/:id/deliver",
  AuthService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);

module.exports = router;
