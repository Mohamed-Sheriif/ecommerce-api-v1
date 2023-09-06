const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  uploadUserImage,
  resizeUserImage,
} = require("../services/userService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  deleteUserValidator,
} = require("../validators/userValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    createUserValidator,
    createUser
  )
  .get(AuthService.protect, AuthService.allowedTo("admin"), getUsers);

router
  .route("/:id")
  .get(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

router.put("/:id/password", updateUserPasswordValidator, updateUserPassword);

module.exports = router;
