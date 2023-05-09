const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  color: {
    type: String,
    required: [true, "Variant Color is required"],
  },
  image: { type: String },
  images: [String],
  sizes: [
    {
      size: {
        type: String,
        required: [true, "Variant Size is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Variant Stock Quantity is required"],
        min: [0, "Stock Quantity can't be negative"],
      },
    },
  ],
});
