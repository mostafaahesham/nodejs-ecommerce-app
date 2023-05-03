const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// mergeParams:  allows params access  on other routes
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getSubCategories)
  .post(createSubCategoryValidator, createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
