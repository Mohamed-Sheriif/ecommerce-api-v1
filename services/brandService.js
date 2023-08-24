const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Brand = require("../models/brandModel");

/**
 * @desc    Create brand
 * @route   POST /api/v1/brands
 * @access  Private
 */
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}).skip(skip).limit(limit);

  res.status(200).json({ result: brands.length, page, data: brands });
});

/**
 * @desc    Get specific brand by id
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  // Check if Brand exists
  if (!brand) {
    return next(new ApiError(`No brand with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: brand });
});

/**
 * @desc    Update specific brand
 * @route   PUT /api/v1/brands/:id
 * @access  Private
 */
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  // Check if brand exists
  if (!brand) {
    return next(new ApiError(`No brand with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: brand });
});

/**
 * @desc    Delete specific brand
 * @route   DELETE /api/v1/brands/:id
 * @access  Private
 */
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete({ _id: id });

  // Check if Brand exists
  if (!brand) {
    return next(new ApiError(`No Brand with this id: ${id} !`, 404));
  }

  res.status(204).send();
});
