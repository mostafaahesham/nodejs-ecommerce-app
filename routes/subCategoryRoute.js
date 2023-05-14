const express = require("express");
const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  uploadSubCategoryImage,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const auth = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getSubCategories)
  .post(
    auth.auth,
    uploadSubCategoryImage,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(uploadSubCategoryImage, updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
