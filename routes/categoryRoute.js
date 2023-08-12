const express = require("express");

const { createCategory } = require("../services/categoryService");

const router = express.Router();

router.route("/").post(createCategory);

module.exports = router;
