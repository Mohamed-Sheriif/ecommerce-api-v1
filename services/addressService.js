const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

/**
 * @desc    Add address to user addresses
 * @route   POST /api/addresses
 * @access  Private/User
 */
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.addresses,
  });
});

/**
 * @desc    Get user addresses
 * @route   GET /api/addresses
 * @access  Private
 */
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    result: user.addresses.length,
    data: user.addresses,
  });
});

/**
 * @desc    Remove address from user addresses
 * @route   DELETE /api/addresses/:addressId
 * @access  Private/User
 */
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.addresses,
  });
});
