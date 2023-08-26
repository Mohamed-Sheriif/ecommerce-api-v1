const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/ApiFeature");

const SubCategory = require("../models/subCategoryModel");

// Middleware to add category to req.body
exports.setCategoryToBody = (req, res, next) => {
  // Nested route
  if (req.params.categoryId) req.body.category = req.params.categoryId;
  next();
};

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

// Nested route
exports.createFilterObject = (req, res, next) => {
  // Check for get subCategories for a category
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

/**
 * @desc    Get list of subCategories
 * @route   GET /api/v1/subCategories
 * @access  Public
 */
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  // Get number of total documents
  const totalDocuments = await SubCategory.countDocuments();

  // Build query
  const apiFeature = new ApiFeature(SubCategory.find(), req.query)
    .paginate(totalDocuments)
    .filter()
    .limitFields()
    .search()
    .sort();

  const { paginationResult, mongooseQuery } = apiFeature;

  // Execute query
  const subCategories = await mongooseQuery;

  res
    .status(200)
    .json({
      result: subCategories.length,
      paginationResult,
      data: subCategories,
    });
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

/**
 * @desc    Update specific subCategory by id
 * @route   PUT /api/v1/subCategories/:id
 * @access  Private
 */
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findByIdAndUpdate(
    { _id: id },
    {
      name,
      slug: slugify(name),
      category,
    },
    { new: true }
  );

  // Check if subCategory exists
  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: subCategory });
});

/**
 * @desc    Delete specific subCategory by id
 * @route   DELETE /api/v1/subCategories/:id
 * @access  Private
 */
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByIdAndDelete(id);

  // Check if subCategory exists
  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id: ${id} !`, 404));
  }

  res.status(204).send();
});
