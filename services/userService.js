const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const User = require("../models/userModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

// Image processing
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;

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
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
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
