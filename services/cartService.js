const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

/**
 * @desc   Add product to cart
 * @route  POST /api/v1/cart
 * @access Private/User
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  // 1) Get cart for logged user
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    // Create cart for logged user with product
    cart = await Cart.create({
      user: req.user.id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // 1) Check if product already in cart with same color (increase product quantity)
    const productExist = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productExist !== -1) {
      cart.cartItems[productExist].quantity += 1;
    } else {
      // Add product to cart
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  // Calculate total price
  cart.totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save cart
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    cart,
  });
});

/**
 * @desc   Get user cart
 * @route  GET /api/v1/cart
 * @access Private/User
 */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ApiError("There is not cart for this user", 404));
  }

  res.status(200).json({
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

/**
 * @desc   Update product quantity in cart
 * @route  PATCH /api/v1/cart/:productId
 * @access Private/User
 */
exports.updateProductQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ApiError("There is not cart for this user", 404));
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (productIndex === -1) {
    return next(new ApiError("Product not found in cart", 404));
  }

  cart.cartItems[productIndex].quantity = quantity;

  // Calculate total price
  cart.totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    status: "success",
    cart,
  });
});

/**
 * @desc   Remove product from cart
 * @route  DELETE /api/v1/cart/:productId
 * @access Private/User
 */
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ApiError("There is not cart for this user", 404));
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (productIndex === -1) {
    return next(new ApiError("Product not found in cart", 404));
  }

  cart.cartItems.splice(productIndex, 1);

  // Calculate total price
  cart.totalCartPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    status: "success",
    cart,
  });
});

/**
 * @desc   Delete user cart
 * @route  DELETE /api/v1/cart
 * @access Private/User
 */
exports.deleteUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user.id });
  if (!cart) {
    return next(new ApiError("There is not cart for this user", 404));
  }

  res.status(204).send();
});

/**
 * @desc   Apply coupon to cart
 * @route  POST /api/v1/cart/applyCoupon
 * @access Private/User
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  // Check if coupon exist and not expired
  if (!coupon) {
    return next(new ApiError("Coupon not found or expired", 404));
  }

  const cart = await Cart.findOne({ user: req.user.id });

  // Check if user has cart
  if (!cart) {
    return next(new ApiError("There is not cart for this user", 404));
  }

  // Apply coupon to cart
  const { totalCartPrice } = cart;
  const discount = (totalCartPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = (totalCartPrice - discount).toFixed(2);

  // Save cart
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
