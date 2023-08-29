const mongoose = require("mongoose");

// 1. Create a schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required!"],
      unique: [true, "Brand name must be unique!"],
      minlength: [2, "Too short brand name!"],
      maxlength: [32, "Too long brand name!"],
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

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findAll , findSpecific , update
BrandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

// createS
BrandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2. Create a model
const BrandModel = mongoose.model("Brand", BrandSchema);

// 3. Export the model
module.exports = BrandModel;
