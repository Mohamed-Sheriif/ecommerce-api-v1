const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const Product = require("../models/productModel");
const {
  uploadMultipleImages,
} = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = async (req, res, next) => {
  // 1) Cover image
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    req.body.imageCover = imageCoverFileName;
  }

  // 2) Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }

  next();
};

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
