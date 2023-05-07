require("dotenv").config();
const express = require("express");
const multer = require("multer");

const app = express();

//single file upload
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ status: "success" });
});

app.listen(8000, () => console.log("listening on port 8000"));
