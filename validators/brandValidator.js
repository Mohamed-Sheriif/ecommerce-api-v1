const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required!")
    .isMongoId()
    .withMessage("Invalid brand id format!"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required!")
    .isLength({ min: 3 })
    .withMessage("Too short brand name!")
    .isLength({ max: 32 })
    .withMessage("Too long brand name!")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required!")
    .isMongoId()
    .withMessage("Invalid brand id format!"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short brand name!")
    .isLength({ max: 32 })
    .withMessage("Too long brand name!")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required!")
    .isMongoId()
    .withMessage("Invalid brand id format!"),
  validatorMiddleware,
];
