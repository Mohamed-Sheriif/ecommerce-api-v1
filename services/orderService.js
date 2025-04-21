const stripe = require("stripe")(
  `sk_test_51QSGA9DtZB3mkL4ZW6PpNhjSb1RRwJushhkt2Kpqda3uOd3u73HO41i2OyeCriUdXb9w9nrkOBmBs8RxWZLptutg00c443l38X`
);
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
    status: "success",
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

/**
 * @desc      Update order to paid
 * @route     PUT /api/v1/orders/:id/pay
 * @access    Private/Admin-Manager
 */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

/**
 * @desc      Update order to delivered
 * @route     PUT /api/v1/orders/:id/deliver
 * @access    Private/Admin-Manager
 */
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

/**
 * @desc      Get checkout session from stripe and send it as response
 * @route     GET /api/v1/orders/checkout-session/:cartId
 * @access    Protected/User
 */
exports.checkoutSession = asyncHandler(async (req, res, next) => {
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

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp", // Set your currency
          product_data: {
            name: req.user.name, // User's name as the product name
          },
          unit_amount: totalOrderPrice * 100, // Amount in the smallest currency unit (e.g., piasters for EGP)
        },
        quantity: 1, // Quantity of the item
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) Send session as response
  res.status(200).json({
    status: "success",
    session,
  });
});
