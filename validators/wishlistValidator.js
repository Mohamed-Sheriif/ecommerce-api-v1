const { check } = require("express-validator");

const Product = require("../models/productModel");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.addProductToWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required!")
    .isMongoId()
    .withMessage("Invalid product id format!")
    .custom(async (value) => {
      const product = await Product.findById(value);

      if (!product) {
        throw new Error("Product not found!");
      }
    }),
  validatorMiddleware,
];

exports.removeProductFromWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required!")
    .isMongoId()
    .withMessage("Invalid product id format!")
    .custom(async (value) => {
      const product = await Product.findById(value);

      if (!product) {
        throw new Error("Product not found!");
      }
    }),
  validatorMiddleware,
];
