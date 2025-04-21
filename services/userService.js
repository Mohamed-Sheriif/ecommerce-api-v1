const fs = require("fs");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const User = require("../models/userModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const createToken = require("../utils/createToken");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

// Image processing
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;

    // Check if folder exists, if not create it
    const dir = "uploads/users";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    req.body.profileImage = fileName;
  }

  next();
});

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
exports.createUser = factory.createOne(User);

/**
 * @desc    Get list of users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
exports.getUsers = factory.getAll(User);

/**
 * @desc    Get specific user by id
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
exports.getUser = factory.getOne(User);

/**
 * @desc    Update specific user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  // Check if document exists
  if (!document) {
    return next(
      new ApiError(`No document with this id: ${req.params.id} !`, 404)
    );
  }

  res.status(200).json({ data: document });
});

/**
 * @desc    Update specific user password
 * @route   PUT /api/v1/users/:id/password
 * @access  Private/Admin
 */
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // Check if user exists
  if (!user) {
    return next(new ApiError(`No user with this id: ${req.params.id} !`, 404));
  }

  res.status(200).json({ data: user });
});

/**
 * @desc    Delete specific user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = factory.deleteOne(User);

/**
 * @desc    Get logged user data
 * @route   GET /api/v1/users/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

/**
 * @desc    Update logged user password
 * @route   PUT /api/v1/users/updateMyPassword
 * @access  Private
 */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update password
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // 2) Create new token
  const token = createToken(user);

  res.status(200).json({ data: user, token });
});

/**
 * @desc    Update logged user data(without password - role)
 * @route   PUT /api/v1/users/updateMe
 * @access  Private
 */
exports.updateMe = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: updatedUser });
});

/**
 * @desc    Deactivate logged user
 * @route   DELETE /api/v1/users/deleteMe
 * @access  Private
 */
exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({ status: "success" });
});
