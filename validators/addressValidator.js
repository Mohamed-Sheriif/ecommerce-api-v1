const { check } = require("express-validator");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.addressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Alias is required")
    .isString()
    .withMessage("Alias must be a string"),
  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isString()
    .withMessage("Postal code must be a string"),

  validatorMiddleware,
];
