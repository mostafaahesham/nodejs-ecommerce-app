const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      required: [true, "promo code name is required"],
      unique: [true, "promo code name must be unique"],
    },
    expiryDate: {
      type: String,
      required: [true, "promo code expiry data is required"],
    },
    type: {
      type: String,
      enum: ["%", "$"],
      required: [true, "promo code type is required"],
      default: "%",
    },
    value: {
      type: Number,
      required: [true, "promo code value is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
