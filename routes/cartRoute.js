const express = require("express");

const {
  addToCart,
  removeFromCart,
  getLoggedUserCart,
  emptyLoggedUserCart,
} = require("../services/cartService");

const auth = require("../services/authService");

const router = express.Router();
router.use(auth.authenticate, auth.authorize("user"));
router
  .route("/")
  .put(addToCart)
  .get(getLoggedUserCart)
  .delete(emptyLoggedUserCart);

router.route("/:itemId").put(removeFromCart);
module.exports = router;
