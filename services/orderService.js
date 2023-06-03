const asyncHandler = require("express-async-handler");

const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");

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

  let totalOrderPrice = 0;

  if (cart.priceAfterPromoCode) {
    totalOrderPrice = cart.priceAfterPromoCode;
  } else {
    totalOrderPrice = cart.price;
  }

  const order = await orderModel.create({
    orderNumber: Math.floor(100000000 + Math.random() * 900000000),
    user: req.user,
    cartItems: cart.items,
    shippingPrice: Number(process.env.SHIPPING_PRICE),
    taxPercentage: Number(process.env.TAX_PERCENTAGE),
    totalPrice: totalOrderPrice,
    checkoutPrice: (
      totalOrderPrice * (1 + Number(process.env.TAX_PERCENTAGE) / 100) +
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

// @desc    cancel order
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

  const cancelTimeAllowance = order.placedAt.getTime() + 15 * 60000;
  const now = Date.now();

  if (cancelTimeAllowance < now) {
    return next(new APIError("order cannot be canceled", 403));
  }

  await order.save();

  res.status(200).json({
    status: "success",
    msg: "order canceled",
    data: order,
  });
});
