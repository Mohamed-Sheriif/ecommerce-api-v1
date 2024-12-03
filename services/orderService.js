const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

/**
 * @desc      Create a new order
 * @route     POST /api/v1/orders/cartId
 * @access    Protected/User
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0.0;
  const shippingPrice = 0.0;

  // 1) Get cart based on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // 2) Get otder total price based on cart price "check if coupon is applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default paymentMethodType
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.user.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order decrease the quantity of products and increase the sold of products
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOptions, {});
  }

  // 5) Clear the cart
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(201).json({
    data: order,
  });
});

exports.filterOrdersByLoggedUser = (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
};

/**
 * @desc      Get orders
 * @route     POST /api/v1/orders/cartId
 * @access    Private/User-Admin-Manager
 */
exports.getOrders = factory.getAll(Order);

/**
 * @desc      Get order
 * @route     POST /api/v1/orders/:id
 * @access    Private/User-Admin-Manager
 */
exports.getOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (req.user.role === "user" && order.user.toString() !== userId.toString()) {
    return next(new ApiError("You are not allowed to access this order", 403));
  }

  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  res.status(200).json({
    data: order,
  });
});
