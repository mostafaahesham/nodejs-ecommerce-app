const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: false,
      required: [true, "subCategory is required"],
      minLength: [3, "subCategory name too short"],
      maxLength: [50, "subCategory name too long"],
    },
    // ex: A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String, required: [true, "subCategory image is required"] },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to a parent category"],
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/images/subCategories/${doc.image}`;
    doc.image = imageURL;
  }
};

subCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

subCategorySchema.post("init", (doc) => {
  setImageURL(doc);
});

subCategorySchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
