const express = require("express");

const {
  addToCart,
  removeFromCart,
  getLoggedUserCart,
  emptyLoggedUserCart,
} = require("../services/cartService");
const { addToCartValidator } = require("../utils/validators/cartValidator");

const auth = require("../services/authService");

const router = express.Router();
router.use(auth.authenticate, auth.authorize("user"));
router
  .route("/")
  .put(addToCartValidator, addToCart)
  .get(getLoggedUserCart)
  .delete(emptyLoggedUserCart);
// .patch(applyPromoCodeValidator, applyPromoCode);

router.route("/:itemId").put(removeFromCart);
module.exports = router;
