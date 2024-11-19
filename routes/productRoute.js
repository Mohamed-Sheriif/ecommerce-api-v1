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
const ReviewRouter = require("./reviewRoute");

const router = express.Router();

// Nested Route (Valid for these routes)
// POST /api/v1/products/:productId/reviews
// GET /api/v1/products/:productId/reviews
// GET /api/v1/products/:productId/reviews/:reviewId
router.use("/:productId/reviews", ReviewRouter);

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
