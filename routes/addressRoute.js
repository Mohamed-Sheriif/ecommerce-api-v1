const express = require("express");

const {
  addAddress,
  getLoggedUserAddresses,
  removeAddress,
} = require("../services/addressService");

const { addressValidator } = require("../validators/addressValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .post(addressValidator, addAddress)
  .get(getLoggedUserAddresses);

router.route("/:addressId").delete(removeAddress);

module.exports = router;
