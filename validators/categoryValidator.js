const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id is required!")
    .isMongoId()
    .withMessage("Invalid category id format!"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required!")
    .isLength({ min: 3 })
    .withMessage("Too short category name!")
    .isLength({ max: 32 })
    .withMessage("Too long category name!")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id is required!")
    .isMongoId()
    .withMessage("Invalid category id format!"),
  check("name")
    .notEmpty()
    .withMessage("Category name is required!")
    .isLength({ min: 2 })
    .withMessage("Too short category name!")
    .isLength({ max: 32 })
    .withMessage("Too long category name!")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id is required!")
    .isMongoId()
    .withMessage("Invalid Category id format!"),
  validatorMiddleware,
];
