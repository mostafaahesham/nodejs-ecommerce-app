const express = require("express");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brandValidator");

const auth = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
