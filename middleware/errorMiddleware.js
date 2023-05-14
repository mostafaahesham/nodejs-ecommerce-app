const APIError = require("../utils/apiError");

const sendErrorForDevMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProdMode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const JWTinvalidSignatureHandler = () =>
  new APIError("invalid token, please login again", 401);

const JWTexpiredTokenHandler = () =>
  new APIError("expired token, please login again", 401);

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV == "dev") {
    sendErrorForDevMode(err, res);
  } else {
    if (err.name == "JsonWebTokenError") {
      err = JWTinvalidSignatureHandler();
    }
    if (err.name == "TokenExpiredError") {
      err = JWTexpiredTokenHandler();
    }
    sendErrorForProdMode(err, res);
  }
};

module.exports = globalErrorHandler;
