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

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .post(addProductToWishlistValidator, addProductToWishlist)
  .get(getLoggedUserWishlist);

router
  .route("/:productId")
  .delete(removeProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;
