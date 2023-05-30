const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      required: [true, "order number is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "product is required"],
        },
        productId: {
          type: String,
          required: [true, "productId is required"],
        },
        colorId: {
          type: String,
          required: [true, "colorId is required"],
        },
        color: {
          type: String,
          required: [true, "color is required"],
        },
        sizeId: {
          type: String,
          required: [true, "sizeId is required"],
        },
        size: {
          type: String,
          required: [true, "size is required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity is required"],
          min: [1, "minimum quantity is 1"],
          default: 1,
        },
        variantImage: {
          type: String,
          required: [true, "variantImage is required"],
        },
      },
    ],
    taxPercentage: {
      type: Number,
      required: [true, "taxPrice is required"],
      default: process.env.TAX_PERCENTAGE,
    },
    shippingPrice: {
      type: Number,
      default: process.env.SHIPPING_PRICE,
      required: [true, "shippingPrice is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "totalPrice is required"],
    },
    checkoutPrice: {
      type: Number,
      required: [true, "totalPrice is required"],
    },
    promocode: {
      type: mongoose.Schema.ObjectId,
      ref: "PromoCode",
    },
    priceAfterPromoCode: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      required: [true, "paymentMethod is required"],
      enum: ["cash", "card"],
      default: "cash",
    },
    status: {
      type: String,
      required: [true, "order status is required"],
      enum: ["pending", "canceled", "processing", "delivered"],
      default: "pending",
    },
    placedAt: {
      type: Date,
      required: [true, "placedAt date is required"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "-variants",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
