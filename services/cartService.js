const asyncHandler = require("express-async-handler");

const checkDocExistance = require("../utils/helpers/checkDocExistence");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const promoCodeModel = require("../models/promoCodeModel");

const APIError = require("../utils/apiError");

const calculateCartprice = (cart) => {
  let totalCartPrice = 0;
  cart.items.forEach((item) => {
    totalCartPrice += item.quantity * item.product.discountedPrice;
  });
  cart.price = totalCartPrice;
  return totalCartPrice;
};

// @desc    Get Logged User Cart
// @route   Get    /api/v1/carts
// @access  Private
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new APIError("no cart exists for this user", 404));
  }
  res.status(200).json({
    status: "success",
    numberOfItems: cart.items.length,
    data: cart,
  });
});

// @desc    Add Product to cart
// @route   PUT    /api/v1/carts
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, colorId, sizeId, quantity } = req.body;

  const product = await checkDocExistance(productModel, "id", productId);

  const { variants, ...productWithoutVariants } = product.toJSON();
  const tempProduct = new productModel();

  Object.assign(tempProduct, productWithoutVariants);

  const color = product.variants.find((clr) => clr._id == colorId);

  if (!color) {
    return next(
      new APIError(
        `color of id: ${colorId} not found for product of id: ${productId}`,
        404
      )
    );
  }

  const size = color.sizes.find((sz) => sz._id == sizeId);

  if (!size) {
    return next(
      new APIError(
        `size of id: ${sizeId} not found for color of id: ${colorId}`,
        404
      )
    );
  }

  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      items: [
        {
          product: tempProduct,
          productId: productId,
          colorId: colorId,
          color: color.color,
          sizeId: sizeId,
          size: size.name,
          variantImage: color.variantImage,
          quantity: quantity,
        },
      ],
      price: quantity * product.discountedPrice,
    });
  } else {
    const sizeIndex = cart.items.findIndex((sz) => sz.sizeId == sizeId);

    if (sizeIndex > -1) {
      const item = cart.items[sizeIndex];
      item.quantity += 1;
      cart.items[sizeIndex] = item;
    } else {
      cart.items.push({
        product: tempProduct,
        productId: productId,
        colorId: colorId,
        color: color.color,
        sizeId: sizeId,
        size: size.name,
        variantImage: color.variantImage,
        quantity: quantity,
      });
    }
  }

  calculateCartprice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    msg: "cart updated successfully",
    data: cart,
  });
});

// @desc    remove Product from cart
// @route   PUT    /api/v1/carts/:itemId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { items: { _id: req.params.itemId } },
    },
    { new: true }
  );
  if (!cart) {
    return next(new APIError("cart not found", 404));
  }
  calculateCartprice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfItems: cart.items.length,
    data: cart,
  });
});

// @desc    clear logged user Cart
// @route   DELETE    /api/v1/carts
// @access  Private
exports.emptyLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: { items: [] },
    },
    { new: true }
  );
  if (!cart) {
    return next(new APIError("cart not found", 404));
  }
  calculateCartprice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    msg: "cart cleared",
    data: cart,
  });
});
