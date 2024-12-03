const express = require("express");

const { createCashOrder } = require("../services/orderService");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect, AuthService.allowedTo("user"));

router.route("/:cartId").post(createCashOrder);

module.exports = router;
