const express = require("express");

const {
  getPromoCodes,
  createPromoCode,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
} = require("../services/promoCodeService");
const {
  getPromoCodeValidator,
  updatePromoCodeValidator,
  deletePromoCodeValidator,
  createPromoCodeValidator,
} = require("../utils/validators/promoCodeValidator");

const auth = require("../services/authService");

const router = express.Router();

router.use(auth.authenticate, auth.authorize("admin"));

router
  .route("/")
  .get(getPromoCodes)
  .post(createPromoCodeValidator, createPromoCode);
router
  .route("/:id")
  .get(getPromoCodeValidator, getPromoCode)
  .put(updatePromoCodeValidator, updatePromoCode)
  .delete(deletePromoCodeValidator, deletePromoCode);

module.exports = router;
