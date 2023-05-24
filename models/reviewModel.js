const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      maxlength: [500, "review comment can't be more than 500 charachters"],
    },

    ratings: {
      type: Number,
      min: [1, "min rating is 1.0"],
      max: [5, "max rating is 5.0"],
      required: [true, "ratings are required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "only logged users can provide ratings"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "reviews must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
