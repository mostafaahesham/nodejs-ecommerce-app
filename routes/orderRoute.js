const express = require("express");

const {
  createOrder,
  getOrder,
  getOrders,
  cancelOrder,
} = require("../services/orderService");
// const {
//   getPromoCodeValidator,
//   updatePromoCodeValidator,
//   deletePromoCodeValidator,
//   createPromoCodeValidator,
// } = require("../utils/validators/promoCodeValidator");

const auth = require("../services/authService");

const router = express.Router();

router.use(auth.authenticate);

router.route("/").get(getOrders).post(auth.authorize("user"), createOrder);
router.route("/:id").get(auth.authorize("user", "admin"), getOrder);
router.route("/cancel").delete(auth.authorize("user"), cancelOrder);

module.exports = router;
