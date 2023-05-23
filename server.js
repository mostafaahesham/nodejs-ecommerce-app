const dotenv = require("dotenv");
const path = require("path");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const dbConnection = require("./config/db_connection");
const globalErrorHandler = require("./middleware/errorMiddleware");

const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");

const APIError = require("./utils/apiError");

dotenv.config({ path: "config.env" });

const app = express();
const PORT = process.env.PORT || 8000;

// connect to db
dbConnection();

// MiddleWares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "static")));

if (process.env.NODE_ENV == "dev") {
  app.use(morgan("dev"));
}

console.log(`mode: ${process.env.NODE_ENV}`);
console.log(`BASE_URL: ${process.env.BASE_URL}`);

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

app.all("*", (req, res, next) => {
  next(new APIError(`Cannot find this route: ${req.originalUrl}`, 400));
});

// glonal err handling middleware for express app
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

// Handling Rejections Outside express app
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down ...`);
    process.exit(1);
  });
});
