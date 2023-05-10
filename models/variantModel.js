const mongoose = require("mongoose");
const sizeSchema = require("./sizeModel");

module.exports = new mongoose.Schema({
  color: {
    type: String,
    // required: [true, "variant color is required"],
  },
  image: { type: String, required: true },
  images: {
    type: [String],
    // required: [true, "variant images are required"],
    // validate: {
    //   validator: function (images) {
    //     return images.length >= 1 && images.length <= 5;
    //   },
    //   message: "min number of images is 1, max number of images is 5",
    // },
  },
  sizes: {
    type: [sizeSchema],
    // required: [true, "variant sizes are required"],
    // validate: {
    //   validator: function (sizes) {
    //     return sizes.length >= 1;
    //   },
    //   message: "min number of sizes >= 1",
    // },
  },
});
