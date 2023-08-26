const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/ApiFeature");

const Category = require("../models/categoryModel");

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  // Get number of total documents
  const totalDocuments = await Category.countDocuments();

  // Build query
  const apiFeature = new ApiFeature(Category.find(), req.query)
    .paginate(totalDocuments)
    .filter()
    .limitFields()
    .search()
    .sort();

  const { paginationResult, mongooseQuery } = apiFeature;

  // Execute query
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ result: categories.length, paginationResult, data: categories });
});

/**
 * @desc    Get specific category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  // Check if category exists
  if (!category) {
    return next(new ApiError(`No category with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: category });
});

/**
 * @desc    Update specific category
 * @route   PUT /api/v1/categories/:id
 * @access  Private
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  // Check if category exists
  if (!category) {
    return next(new ApiError(`No category with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: category });
});

/**
 * @desc    Delete specific category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete({ _id: id });

  // Check if category exists
  if (!category) {
    return next(new ApiError(`No category with this id: ${id} !`, 404));
  }

  res.status(204).send();
});
