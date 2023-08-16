const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const SubCategory = require("../models/subCategoryModel");

/**
 * @desc    Create a subCategory
 * @route   POST /api/v1/subCategories
 * @access  Private
 */
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({
    data: subCategory,
  });
});

/**
 * @desc    Get list of subCategories
 * @route   GET /api/v1/subCategories
 * @access  Public
 */
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find({}).skip(skip).limit(limit);

  res
    .status(200)
    .json({ result: subCategories.length, page, data: subCategories });
});

/**
 * @desc    Get specific subCategory by id
 * @route   GET /api/v1/subCategories/:id
 * @access  Public
 */
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);

  // Check if subCategory exists
  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: subCategory });
});
