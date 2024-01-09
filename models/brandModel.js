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
    email: {
      type: String,
      required: [true, "brand email is required"],
      unique: [true, "this e-mail is already in use"],
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, "brand image is required"],
    },
    logo: {
      type: String,
      required: [true, "brand logo is required"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "user phone number is required"],
    },
    password: {
      type: String,
      required: [true, "user password is required"],
      minLength: [8, "password must be at least 8 characters"],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode: {
      type: String,
    },
    passwordResetCodeExpiryDate: {
      type: Date,
    },
    passwordResetVerified: {
      type: Boolean,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    slogan: {
      type: String,
      default: "",
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
