const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const Category = require("../models/categoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required!")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long!"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required!")
    .isLength({ min: 20 })
    .withMessage("Product description must be at least 20 characters long!"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required!")
    .isNumeric()
    .withMessage("Product quantity must be a number!"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number!"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required!")
    .isNumeric()
    .withMessage("Product price must be a number!")
    .isLength({ max: 32 })
    .withMessage("Too long product price!"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage("Product priceAfterDiscount must be a number!")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Price after discount must be less than price!");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be an array of strings!"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required!"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array of strings!"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required!")
    .isMongoId()
    .withMessage("Invalid id format!")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("Category does not exist!");
      }
      return true;
    }),
  check("subcategory").optional().isMongoId().withMessage("Invalid id format!"),
  check("brand").optional().isMongoId().withMessage("Invalid id format!"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsAverage must be a number!")
    .isLength({ min: 1 })
    .withMessage("Product ratingsAverage must be at least 1.0")
    .isLength({ max: 5 })
    .withMessage("Product ratingsAverage must can not be more than 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsQuantity must be a number!"),

  validatorMiddleware,
];

exports.getProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id is required!")
    .isMongoId()
    .withMessage("Invalid id format!"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id is required!")
    .isMongoId()
    .withMessage("Invalid id format!"),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id is required!")
    .isMongoId()
    .withMessage("Invalid id format!"),

  validatorMiddleware,
];
