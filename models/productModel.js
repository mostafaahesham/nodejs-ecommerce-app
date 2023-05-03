const mongoose = require("mongoose");
const variantSchema = require("./variantModel");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
      minlength: [3, "Too short Product Name"],
      maxlength: [50, "Too long Product Name"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
      minlength: [10, "Too short Product Description"],
      maxlength: [200, "Too long Product Description"],
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
      required: [true, "Product must belong to a SubCategory"],
    },
    currentPrice: {
      type: Number,
      required: [true, "Product CurrentPrice is required"],
      trim: true,
      min: [1, "min price must be >= 1"],
    },
    discountedPrice: {
      type: Number,
      trim: true,
      min: [1, "min price must be >= 1"],
      default: function () {
        return this.currentPrice;
      },
    },
    discount: {
      type: Number,
      trim: true,
      min: [1, "min price must be >= 1"],
      default: function () {
        return Math.ceil((1 - this.discountedPrice / this.currentPrice) * 100);
      },
    },
    ratingsAverage: {
      type: Number,
      min: [1, "min rating must be >= 1.0"],
      max: [5, "max rating must be <= 5.0"],
      default: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    variants: [variantSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
