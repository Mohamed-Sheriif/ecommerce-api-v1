const factory = require("./handlersFactory");
const Product = require("../models/productModel");

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private
 */
exports.createProduct = factory.createOne(Product);

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getProducts = factory.getAll(Product, "product");

/**
 * @desc    Get specific product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = factory.getOne(Product);

/**
 * @desc    Update specific product
 * @route   PUT /api/v1/products/:id
 * @access  Private
 */
exports.updateProduct = factory.updateOne(Product);

/**
 * @desc    Delete specific product
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
exports.deleteProduct = factory.deleteOne(Product);
