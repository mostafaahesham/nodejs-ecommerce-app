const mongoose = require("mongoose");

const sizeSchema = require("./sizeModel");

module.exports = new mongoose.Schema({
  color: {
    type: String,
    required: [true, "variant color is required"],
  },
  variantImage: {
    type: String,
    required: [true, "variantImage is required"],
  },
  variantImages: {
    type: [String],
    required: [true, "variant images are required"],
    validate: {
      validator: function (variantImages) {
        return variantImages.length >= 1 && variantImages.length <= 20;
      },
      msg: "min number of variantImages is 1, max number of variantImages is 20",
    },
  },
  sizes: {
    type: [sizeSchema],
    required: [true, "variant sizes are required"],
    validate: {
      validator: function (sizes) {
        return sizes.length >= 1;
      },
      message: "min number of sizes >= 1",
    },
  },
});
