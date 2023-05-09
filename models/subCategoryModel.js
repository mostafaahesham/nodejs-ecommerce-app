const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "SubCategory is required"],
      unique: [true, "SubCategory must be unique"],
      minLength: [3, "SubCategory name too short"],
      maxLength: [50, "SubCategory name too long"],
    },
    // ex: A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a parent Category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
