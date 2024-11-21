const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
} = require("../services/cartService");

const { addProductToCartValidator } = require("../validators/cartValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getLoggedUserCart);

module.exports = router;
