const mongoose = require("mongoose");
const productModel = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      maxlength: [1000, "review comment can't be more than 1000 charachters"],
    },

    rating: {
      type: Number,
      min: [1, "min rating is 1.0"],
      max: [5, "max rating is 5.0"],
      required: [true, "rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "only logged users can provide ratings"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "rating must be applied on a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);
  console.log(result);

  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsCount: result[0].ratingsCount,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
