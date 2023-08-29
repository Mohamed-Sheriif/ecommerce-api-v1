const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
} = require("../services/userService");

// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeUserImage, updateUser)
  .delete(deleteUser);

module.exports = router;
