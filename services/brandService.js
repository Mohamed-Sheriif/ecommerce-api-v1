const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/ApiFeature");

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
  // Get number of total documents
  const totalDocuments = await Brand.countDocuments();

  // Build query
  const apiFeature = new ApiFeature(Brand.find(), req.query)
    .paginate(totalDocuments)
    .filter()
    .limitFields()
    .search()
    .sort();

  const { paginationResult, mongooseQuery } = apiFeature;

  // Execute query
  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ result: brands.length, paginationResult, data: brands });
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
