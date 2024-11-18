const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/productValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  )
  .get(getProducts);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
