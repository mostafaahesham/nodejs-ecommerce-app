const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "user email is required"],
      unique: [true, "this e-mail is already in use"],
      lowercase: true,
    },
    image: { type: String },
    phoneNumber: {
      type: Number,
      required: [true, "user phone number is required"],
    },
    password: {
      type: String,
      required: [true, "user password is required"],
      minLength: [8, "password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
