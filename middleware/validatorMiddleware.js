const { validationResult } = require("express-validator");

// @desc Finds validation errors in the request and wraps them in an object 
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validatorMiddleware;
