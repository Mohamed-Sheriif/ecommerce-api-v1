const express = require("express");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const { getCategoryValidator } = require("../validators/categoryValidator");

const router = express.Router();

router.route("/").post(createCategory).get(getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
