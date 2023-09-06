const factory = require("./handlersFactory");
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
 * @access  Private/Admin-Manager
 */
exports.createSubCategory = factory.createOne(SubCategory);

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
exports.getSubCategories = factory.getAll(SubCategory);

/**
 * @desc    Get specific subCategory by id
 * @route   GET /api/v1/subCategories/:id
 * @access  Public
 */
exports.getSubCategory = factory.getOne(SubCategory);

/**
 * @desc    Update specific subCategory by id
 * @route   PUT /api/v1/subCategories/:id
 * @access  Private/Admin-Manager
 */
exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * @desc    Delete specific subCategory by id
 * @route   DELETE /api/v1/subCategories/:id
 * @access  Private/Admin
 */
exports.deleteSubCategory = factory.deleteOne(SubCategory);
