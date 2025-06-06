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
    subCategories: [
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
  {
    timestamps: true,
    // To enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name-_id",
  }).populate({
    path: "subCategories",
    select: "name-_id",
  });

  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};

// findAll , findSpecific , update
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});

// createS
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
