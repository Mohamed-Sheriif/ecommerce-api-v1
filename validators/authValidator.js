const { check } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../middlewares/validatorMiddleware");
const User = require("../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required!")
    .isLength({ min: 3 })
    .withMessage("Too short user name!")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User email is required!")
    .isEmail()
    .withMessage("Invalid email format!")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

      if (user) {
        throw new Error("Email already exists!");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("User password is required!")
    .isLength({ min: 6 })
    .withMessage("Too short password!")
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirm) {
        throw new Error("Password confirmation does not match!");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("User password confirm is required!"),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required!")
    .isEmail()
    .withMessage("Invalid email format!"),
  check("password")
    .notEmpty()
    .withMessage("User password is required!")
    .isLength({ min: 6 })
    .withMessage("Too short password!"),
  validatorMiddleware,
];
