const { check } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const validatorMiddleware = require("../middlewares/validatorMiddleware");
const User = require("../models/userModel");

exports.getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  validatorMiddleware,
];

exports.createUserValidator = [
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
  check("profileImage").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA phone numbers!"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Too short brand name!")
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
  check("profileImage").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA phone numbers!"),
  validatorMiddleware,
];

exports.updateUserPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  check("currentPassword")
    .notEmpty()
    .withMessage("User current password is required!"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("User new password confirm is required!"),
  check("password")
    .notEmpty()
    .withMessage("User new password is required!")
    .isLength({ min: 6 })
    .withMessage("Too short password!")
    .custom(async (value, { req }) => {
      // 1) Verfiy current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found!");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("Current password is incorrect!");
      }

      // 2) Verfiy password confirmation
      if (value !== req.body.passwordConfirm) {
        throw new Error("Password confirmation does not match!");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required!")
    .isMongoId()
    .withMessage("Invalid user id format!"),
  validatorMiddleware,
];
