const { check } = require("express-validator");
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
    .withMessage("Too long category name!"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format!"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format!"),
  validatorMiddleware,
];
