const express = require("express");

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductVariantImages,
  resizeProductVariantImages,
} = require("../services/productService");
const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");

const reviewRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:productId/reviews", reviewRoute);

router.route("/").get(getProducts).post(
  // upload.none(),
  // uploadProductVariantImages,
  // resizeProductVariantImages,
  createProductValidator,
  createProduct
);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
