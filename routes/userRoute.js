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

const router = express.Router();

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
