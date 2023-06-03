const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      unique: [true, "brand name must be unique"],
      minLength: [2, "brand name too short"],
      maxLength: [50, "brand name too long"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, "brand image is required"],
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/images/brands/${doc.image}`;
    doc.image = imageURL;
  }
};

brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Brand", brandSchema);
