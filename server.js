const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config({ path: "config.env" });

const app = express();
const PORT = process.env.PORT || 8000;

const APIError = require("./utils/apiError");
const dbConnection = require("./config/db_connection");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const globalErrorHandler = require("./middleware/errorMiddleware");

// connect to db
dbConnection();

// MiddleWare
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

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
