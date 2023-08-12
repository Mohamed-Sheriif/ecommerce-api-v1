const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/categoryModel");

exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
