const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

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

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgotPassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email: ${req.body.email}!`, 404)
    );
  }

  // 2) if user exist , generete hash reset random 6 digit and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Add hashed reset code to user
  user.passwordResetCode = hashedResetCode;

  // Add password reset expires to user (5 min)
  user.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  // Add password reset verified to user
  user.passwordResetVerified = false;

  // Save user
  await user.save();

  // 3) send email with reset code
  const message = `Hi ${user.name},\nwe received a request to reset your password on E-Shop account. \nYour password reset code is: ${resetCode}.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 5 min)",
      message,
    });
  } catch (err) {
    // if error happen delete reset code from db
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    return next(new ApiError("There was an error sending the email.", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Password reset code sent to email!",
  });
});

/**
 * @desc    Verfiy password
 * @route   POST /api/v1/auth/verifyResetCode
 * @access  Public
 */
exports.verifypassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid reset code or reset code expired!", 400));
  }

  // 2) Reset code valid , set passwordResetVerified to true
  user.passwordResetVerified = true;

  await user.save();

  res.status(200).json({
    status: "success",
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/resetPassword
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ApiError("Invalid email!", 400));
  }

  // Check if user has verified reset code
  if (!user.passwordResetVerified) {
    return next(new ApiError("Please verify your reset code!", 400));
  }

  // Update password and reset password fields
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // If everything is ok, send token to client
  const token = createToken(user);

  res.status(200).json({ token });
});
