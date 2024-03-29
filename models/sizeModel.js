const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "variant size is required"],
  },
  quantity: {
    type: Number,
    required: [true, "variant quantity is required"],
    min: [0, "quantity can't be negative"],
  },
  sold: {
    type: Number,
    min: [0, "sold can't be negative"],
    default: 0,
  },
  availability: {
    type: Boolean,
    default: function () {
      return this.quantity > 0 ? true : false;
    },
  },
});
