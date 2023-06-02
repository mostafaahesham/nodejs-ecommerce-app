const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items: [
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
    promocode: {
      type: mongoose.Schema.ObjectId,
      ref: "PromoCode",
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [1, "min price is 1$"],
    },
    priceAfterPromoCode: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.product",
    select: "-variants",
  });
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
