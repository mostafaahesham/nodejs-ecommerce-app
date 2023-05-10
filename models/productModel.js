const mongoose = require("mongoose");
const variantSchema = require("./variantModel");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      minlength: [3, "product name too short"],
      maxlength: [50, "product name too long"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minlength: [10, "product description too short"],
      maxlength: [200, "product description too long"],
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      required: [true, "product must belong to a brand"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must belong to a category"],
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
      required: [true, "product must belong to a subCategory"],
    },
    currentPrice: {
      type: Number,
      required: [true, "product currentPrice is required"],
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
    // image: String,
    // images: [String],
    discount: {
      type: Number,
      trim: true,
      min: [1, "min discount must be >= 1%"],
      default: function () {
        return Math.ceil((1 - this.discountedPrice / this.currentPrice) * 100);
      },
    },
    sale: {
      type: Boolean,
      default: function () {
        return this.discountedPrice == this.currentPrice ? false : true;
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
    variants: {
      type: [variantSchema],
      validator: function (variants) {
        return variants.length >= 1;
      },
      message: "min number of variants is 1",
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

module.exports = mongoose.model("Product", productSchema);
