const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const createToken = (payload) =>
  jwt.sign(
    {
      userId: payload._id,
      username: payload.name,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

/**
 * @desc    Signup user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  // 1) Create user
  const user = await User.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    password: req.body.password,
  });

  // 2) Generate token
  const token = createToken(user);

  res.status(201).json({ data: { user, token } });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  // 1) Check if email and password exist
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid credentials!", 401));
  }

  // 2) Generate token
  const token = createToken(user);

  res.status(200).json({ data: { user, token } });
});
