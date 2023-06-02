const dotenv = require("dotenv");
const path = require("path");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const dbConnection = require("./config/db_connection");
const globalErrorHandler = require("./middleware/errorMiddleware");

const mountRoutes = require("./routes/routes");

const APIError = require("./utils/apiError");

dotenv.config({ path: "config.env" });

const app = express();

// connect to db
const server = dbConnection(app);

// MiddleWares
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
app.use(cors());

if (process.env.NODE_ENV == "dev") {
  app.use(morgan("dev"));
}

// mount routes
mountRoutes(app);

console.log(`mode: ${process.env.NODE_ENV}`);
console.log(`BASE_URL: ${process.env.BASE_URL}`);

app.all("*", (req, res, next) => {
  next(new APIError(`Cannot find this route: ${req.originalUrl}`, 400));
});

// glonal err handling middleware for express app
app.use(globalErrorHandler);

// Handling Rejections Outside express app
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down ...`);
    process.exit(1);
  });
});
