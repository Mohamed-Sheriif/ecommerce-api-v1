const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryToBody,
  createFilterObject,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../validators/subCategoryValidator");

// MergeParams: true is required to access params in other routes
// ex: we need to access categoryId from category route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObject, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
