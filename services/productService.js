const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

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
  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  // Filtering
  const queryStringObj = { ...req.query };
  const excludeFields = ["page", "limit", "sort", "fields"];
  excludeFields.forEach((field) => delete queryStringObj[field]);

  // if query contain gte, gt, lte, lt add $ sign
  const queryStr = JSON.stringify(queryStringObj);
  const queryStrWithDollarSign = queryStr.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  // Build query
  let mongooseQuery = Product.find(JSON.parse(queryStrWithDollarSign))
    .skip(skip)
    .limit(limit)
    .populate({
      path: "category",
      select: "name -_id",
    });

  // Sorting
  if (req.query.sort) {
    // if query contain sort, add space between them
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    // Default sorting by latest
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // Execute query
  const products = await mongooseQuery;

  res.status(200).json({ result: products.length, page, data: products });
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
