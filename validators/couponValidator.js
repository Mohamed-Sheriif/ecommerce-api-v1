const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name required!")
    .isString()
    .withMessage("Coupon name must be a string!"),
  check("expire").notEmpty().withMessage("Coupon expire time required!"),
  check("discount")
    .notEmpty()
    .withMessage("Coupon discount value required!")
    .isNumeric()
    .withMessage("Coupon discount value must be a number!"),
  validatorMiddleware,
];

exports.getCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id required!")
    .isMongoId()
    .withMessage("Invalid coupon id format!"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id required!")
    .isMongoId()
    .withMessage("Invalid coupon id format!"),
  check("name")
    .optional()
    .isString()
    .withMessage("Coupon name must be a string!"),
  check("expire").optional(),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Coupon discount value must be a number!"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id required!")
    .isMongoId()
    .withMessage("Invalid coupon id format!"),
  validatorMiddleware,
];
