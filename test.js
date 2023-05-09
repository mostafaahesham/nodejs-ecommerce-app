const express = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // limit file size to 1MB
});

const app = express();

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Construct the URL for the uploaded image
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  // Return the URL in the response
  return res.status(200).send({ imageUrl });
});

app.listen(3000, () => console.log("Server started on port 3000"));
