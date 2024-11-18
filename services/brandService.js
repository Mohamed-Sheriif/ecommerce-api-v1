const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  req.body.image = fileName;

  next();
});

/**
 * @desc    Create brand
 * @route   POST /api/v1/brands
 * @access  Private/Admin-Manager
 */
exports.createBrand = factory.createOne(Brand);

/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
exports.getBrands = factory.getAll(Brand);

/**
 * @desc    Get specific brand by id
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
exports.getBrand = factory.getOne(Brand);

/**
 * @desc    Update specific brand
 * @route   PUT /api/v1/brands/:id
 * @access  Private/Admin-Manager
 */
exports.updateBrand = factory.updateOne(Brand);

/**
 * @desc    Delete specific brand
 * @route   DELETE /api/v1/brands/:id
 * @access  Private/Admin
 */
exports.deleteBrand = factory.deleteOne(Brand);
