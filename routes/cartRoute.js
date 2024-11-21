const express = require("express");

const { addProductToCart } = require("../services/cartService");

const { addProductToCartValidator } = require("../validators/cartValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect, AuthService.allowedTo("user"));

router.route("/").post(addProductToCartValidator, addProductToCart);

module.exports = router;
