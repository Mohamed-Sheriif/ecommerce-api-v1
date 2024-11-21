const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  updateProductQuantity,
  removeProductFromCart,
  deleteUserCart,
} = require("../services/cartService");

const {
  addProductToCartValidator,
  updateProductQuantityValidator,
  removeProductFromCartValidator,
} = require("../validators/cartValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getLoggedUserCart)
  .delete(deleteUserCart);

router
  .route("/:productId")
  .delete(removeProductFromCartValidator, removeProductFromCart)
  .put(updateProductQuantityValidator, updateProductQuantity);

module.exports = router;
