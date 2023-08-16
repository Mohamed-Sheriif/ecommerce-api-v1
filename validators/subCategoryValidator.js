const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory id is required!")
    .isMongoId()
    .withMessage("Invalid subCategory id format!"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required!")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name!")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name!"),
  check("category")
    .notEmpty()
    .withMessage("Category is required!")
    .isMongoId()
    .withMessage("Invalid category id format!"),
  validatorMiddleware,
];

// exports.updateCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalid category id format!"),
//   validatorMiddleware,
// ];

// exports.deleteCategoryValidator = [
//   check("id").isMongoId().withMessage("Invalid category id format!"),
//   validatorMiddleware,
// ];
