const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category is required"],
      unique: [true, "category must be unique"],
      minLength: [3, "category name too short"],
      maxLength: [50, "category name too long"],
    },
    // ex: A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String, required: [true, "category image is required"] },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/images/categories/${doc.image}`;
    doc.image = imageURL;
  }
};

categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Category", categorySchema);
