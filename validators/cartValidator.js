const { check } = require("express-validator");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  check("color")
    .notEmpty()
    .withMessage("Color is required")
    .isString()
    .withMessage("Color must be a string"),
  validatorMiddleware,
];

exports.updateProductQuantityValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  validatorMiddleware,
];

exports.removeProductFromCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),
  validatorMiddleware,
];
