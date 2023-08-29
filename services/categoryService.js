const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  req.body.image = fileName;

  next();
});

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private
 */
exports.createCategory = factory.createOne(Category);

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getCategories = factory.getAll(Category);

/**
 * @desc    Get specific category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getCategory = factory.getOne(Category);

/**
 * @desc    Update specific category
 * @route   PUT /api/v1/categories/:id
 * @access  Private
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @desc    Delete specific category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
exports.deleteCategory = factory.deleteOne(Category);
