const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    ratings: {
      type: Number,
      required: [true, "Review ratings required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  // this method is called when a new review is created to calculate the average rating and quantity of the product
  // stats return an array of object
  const stats = await this.aggregate([
    // Stage 1 : match the product id
    {
      $match: { product: productId },
    },
    // Stage 2 : group the product id and calculate the average rating and the number of ratings
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$ratings" },
        nRating: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post("deleteOne", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
