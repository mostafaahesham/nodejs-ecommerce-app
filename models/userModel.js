const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

const setImageURL = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/images/users/${doc.image}`;
    doc.image = imageURL;
  }
};

userSchema.post("init", (doc) => {
  setImageURL(doc);
});

userSchema.post("save", (doc) => {
  setImageURL(doc);
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
