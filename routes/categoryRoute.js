const express = require("express");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");

const auth = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
