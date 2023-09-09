const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  verifypassResetCode,
  resetPassword,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
} = require("../validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);
router.post("/verifyResetCode", verifypassResetCode);
router.post("/resetPassword", resetPassword);

module.exports = router;
