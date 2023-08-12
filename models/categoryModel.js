const mongoose = require("mongoose");

// 1. Create a schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required!"],
      unique: [true, "Category name must be unique!"],
      minlength: [3, "Too short category name!"],
      maxlength: [32, "Too long category name!"],
    },
    // Car and Phones => shopping/car-and-phones
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// 2. Create a model
const CategoryModel = mongoose.model("Category", categorySchema);

// 3. Export the model
module.exports = CategoryModel;
