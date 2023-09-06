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

  res.status(200).json({ data: user, token });
});

/**
 * @desc    Make sure user is logged in
 */
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verify token
  const decpded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const curruntUser = await User.findById(decpded.userId);
  if (!curruntUser) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (curruntUser.passwordChangedAt) {
    const changedPasswordInTimestamp = parseInt(
      curruntUser.passwordChangedAt.getTime() / 1000,
      10
    );

    // Passsword changed after token was issued (Error)
    if (decpded.iat < changedPasswordInTimestamp) {
      return next(
        new ApiError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  // Add user to request object
  req.user = curruntUser;

  next();
});

/**
 * @desc    Check if user is allowed to do this action
 */
exports.allowedTo = (...rules) =>
  asyncHandler(async (req, res, next) => {
    // 1) access rules
    // 2) access logged in user (req.user)
    if (!rules.includes(req.user.role)) {
      return next(new ApiError("You are not allowed to do this action!", 403));
    }

    next();
  });
