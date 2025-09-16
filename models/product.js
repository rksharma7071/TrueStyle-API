const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sku: { type: String },
    price: { type: Number, required: true },
    compare_at_price: { type: Number },
    inventory_quantity: { type: Number, default: 0 },
    weight: { type: Number },
    barcode: { type: String },
    requires_shipping: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String },
    position: { type: Number },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    vendor: { type: String, required: true },
    product_type: { type: String, required: true },
    handle: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "draft",
    },
    tags: [{ type: String }],
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Variant" }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Variant = mongoose.model("Variant", variantSchema);
const Image = mongoose.model("Image", imageSchema);

module.exports = { Product, Variant, Image };
