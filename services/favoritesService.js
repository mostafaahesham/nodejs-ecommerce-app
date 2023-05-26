const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const checkDocExistence = require("../utils/helpers/checkDocExistence");

// @desc    Add Product to favorites
// @route   PUT    /api/v1/favorites/:productId
// @access  Private
exports.updateFavorites = asyncHandler(async (req, res, next) => {
  let user = await checkDocExistence(userModel, "id", req.user._id);
  let msg = "";
  const favorites = user.favorites.map((objectId) => objectId.toString());
  if (favorites.includes(req.params.productId)) {
    msg = "removed from";
    user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { favorites: req.params.productId },
      },
      { new: true }
    );
  } else {
    msg = "added to";
    user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { favorites: req.params.productId },
      },
      { new: true }
    );
  }

  res.status(200).json({
    status: "success",
    msg: `product ${msg} favorites`,
    data: user.favorites,
  });
});

// @desc    Get Logged user favorites
// @route   GET    /api/v1/favorites
// @access  Private
exports.getLoggedUserFavorites = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("favorites");

  res.status(200).json({
    status: "success",
    data: user.favorites,
  });
});
