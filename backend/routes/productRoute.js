const express = require("express");

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createFilterObject,
  uploadProductVariantImages,
  resizeProductVariantImages,
} = require("../services/productService");
const {
  getProductValidator,
  getProductsValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");

const reviewRoute = require("./reviewRoute");

const router = express.Router({ mergeParams: true });

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getProductsValidator, createFilterObject, getProducts)
  .post(
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
