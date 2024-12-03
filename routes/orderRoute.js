const express = require("express");

const {
  createCashOrder,
  getOrders,
  getOrder,
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

module.exports = router;
