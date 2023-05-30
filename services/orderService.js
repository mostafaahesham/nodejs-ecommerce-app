const asyncHandler = require("express-async-handler");
const checkDocExistence = require("../utils/helpers/checkDocExistence");

const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const promoCodeModel = require("../models/promoCodeModel");

const factory = require("./factoryHandlers");

const APIError = require("../utils/apiError");

// @desc    Get order
// @route   GET    /api/v1/orders/:id
// @access  Private
exports.getOrder = factory.getOne(orderModel);

// @desc    Get orders
// @route   GET    /api/v1/orders
// @access  Private
exports.getOrders = factory.getAll(orderModel);

// @desc    create order
// @route   POST    /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({
    user: req.user._id,
  });
  if (!cart || cart.items.length == 0) {
    return next(new APIError("your cart is empty", 404));
  }

  const cartPrice = cart.price;

  const order = await orderModel.create({
    orderNumber: Math.floor(100000000 + Math.random() * 900000000),
    user: req.user,
    cartItems: cart.items,
    shippingPrice: Number(process.env.SHIPPING_PRICE),
    taxPercentage: Number(process.env.TAX_PERCENTAGE),
    totalPrice: cartPrice,
    checkoutPrice: (
      cartPrice * (1 + Number(process.env.TAX_PERCENTAGE) / 100) +
      Number(process.env.SHIPPING_PRICE)
    ).toFixed(1),
    placedAt: Date.now(),
  });

  if (!order) {
    return next(new APIError("couldn't create order", 403));
  }

  res.status(200).json({
    status: "success",
    msg: "order placed",
    data: order,
  });
});

// @desc    Apply PromoCode on order
// @route   PATCH    /api/v1/orders
// @access  Private
exports.applyPromoCode = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findOne({ user: req.user._id });

  if (!order) {
    return next(new APIError("order not found", 404));
  }

  const promoCode = await promoCodeModel.findOne({ name: req.body.promoCode });
  if (!promoCode) {
    return next(new APIError("invalid promoCode", 404));
  }

  if (new Date(promoCode.expiryDate) < Date.now()) {
    return next(new APIError("expired promoCode", 401));
  }

  if (req.user.promoCodes.includes(promoCode.name)) {
    return next(
      new APIError("user has already used this promoCode before", 401)
    );
  }
  if (promoCode.type == "$") {
    order.priceAfterPromoCode = Math.max(order.totalPrice - promoCode.value, 0);
  }
  if (promoCode.type == "%") {
    order.priceAfterPromoCode = Math.max(
      (1 - promoCode.value / 100) * order.price,
      0
    );
  }
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { promoCodes: req.body.promoCode },
    },
    { new: true }
  );
  await order.save();
  res.status(200).json({
    status: "success",
    msg: `promoCode ${promoCode.name} applied -${promoCode.value}${promoCode.type}`,
    data: order,
  });
});

// @desc    cancelOrder
// @route   DELETE    /api/v1/orders/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findOneAndUpdate(
    { user: req.user._id },
    {
      status: "canceled",
    },
    { new: true }
  );

  if (!order) {
    return next(new APIError("order not found", 404));
  }

  await order.save();

  res.status(200).json({
    status: "success",
    msg: "order canceled",
    data: order,
  });
});
