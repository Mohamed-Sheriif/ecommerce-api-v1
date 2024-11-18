const express = require("express");

const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../services/brandService");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validators/brandValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
