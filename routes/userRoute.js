const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateLoggedUserPassword,
  updateMe,
  getMe,
  deleteMe,
  uploadUserImage,
  resizeUserImage,
} = require("../services/userService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateLoggedUserValidator,
  updateUserPasswordValidator,
  deleteUserValidator,
} = require("../validators/userValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect);

// User
router.get("/me", getMe, getUser);
router.put("/updateMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateMe);
router.delete("/deleteMe", deleteMe);

router.use(AuthService.allowedTo("admin"));

// Admin routes
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
