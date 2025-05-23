const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist
 * @access  Private/User
 */
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  // $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.wishlist,
  });
});

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 * @access  Private/User
 */
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  // remove unnecessary fields from the wishlist object
  const wishlist = user.wishlist.map((product) => ({
    _id: product._id,
    title: product.title,
    price: product.price,
  }));

  res.status(200).json({
    result: user.wishlist.length,
    data: wishlist,
  });
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private/User
 */
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  // $pull operator removes from an existing array all instances of a value or values that match a specified condition.
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.wishlist,
  });
});
