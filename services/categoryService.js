const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/categoryModel");

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ result: categories.length, page, data: categories });
});

/**
 * @desc    Get specific category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);

  // Check if category exists
  if (!category) {
    res.status(404).json({ message: `No category with this id: ${id}` });
  }

  res.status(200).json({ data: category });
});
