const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required!"],
      trim: true,
      minLength: [3, "Too short product title!"],
      maxLength: [100, "Too long product title!"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required!"],
      minLength: [20, "Too short product description!"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required!"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required!"],
      trim: true,
      max: [10000000, "Too long product price!"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product imageCover is required!"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to category!"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
        required: [true, "Product must belong to subCategory!"],
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must can not be more than 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
