const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  getMe,
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

router.get("/me", AuthService.protect, getMe, getUser);

// Admin routes
router.use(AuthService.protect, AuthService.allowedTo("admin"));

router
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put("/:id/password", updateUserPasswordValidator, updateUserPassword);

module.exports = router;
