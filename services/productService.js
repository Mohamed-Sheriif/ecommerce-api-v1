const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/ApiFeature");

const Product = require("../models/productModel");

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private
 */
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  // Get number of total documents
  const totalDocuments = await Product.countDocuments();

  // Build query
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .paginate(totalDocuments)
    .filter()
    .limitFields()
    .search("product")
    .sort();

  const { paginationResult, mongooseQuery } = apiFeature;

  // Execute query
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ result: products.length, paginationResult, data: products });
});

/**
 * @desc    Get specific product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });

  // Check if product exists
  if (!product) {
    return next(new ApiError(`No product with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: product });
});

/**
 * @desc    Update specific product
 * @route   PUT /api/v1/products/:id
 * @access  Private
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if title exists update slug
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  // Check if product exists
  if (!product) {
    return next(new ApiError(`No product with this id: ${id} !`, 404));
  }

  res.status(200).json({ data: product });
});

/**
 * @desc    Delete specific product
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  // Check if product exists
  if (!product) {
    return next(new ApiError(`No product with this id: ${id} !`, 404));
  }

  res.status(204).send();
});
