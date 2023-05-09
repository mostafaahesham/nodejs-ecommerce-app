const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  uploadSubCategoryImage,
  resizeSubCategoryImage,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router();

router
  .route("/")
  .get(getSubCategories)
  .post(
    uploadSubCategoryImage,
    resizeSubCategoryImage,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    uploadSubCategoryImage,
    resizeSubCategoryImage,
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
