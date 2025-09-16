const { Product, Variant, Image } = require("../models/product");
const slugify = require("slugify");

// Get all products
async function handleGetAllProducts(req, res) {
  try {
    const products = await Product.find({})
      .populate("variants")
      .populate("images");
    return res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
}

// Create a new product
async function handleCreateNewProduct(req, res) {
  try {
    const {
      title,
      description,
      price,
      vendor,
      product_type,
      handle,
      status,
      tags = [],
      images = [],
      variants = [],
    } = req.body;

    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch (error) {
        return res
          .status(400)
          .json({ msg: "Invalid tags format", error: error });
      }
    }

    // Required fields validation
    if (!title || !price || !vendor || !product_type || !handle || !status) {
      return res.status(400).json({
        msg: "title, price, vendor, product_type, handle, and status are required",
      });
    }

    // Step 1: create Images (if provided)
    const imageDocs = await Image.insertMany(images || []);
    const imageIds = imageDocs.map((img) => img._id);

    // Step 2: create Variants (if provided)
    const variantDocs = await Variant.insertMany(variants || []);
    const variantIds = variantDocs.map((v) => v._id);

    const baseHandle = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const existingProduct = await Product.findOne({
      $or: [{ handle: baseHandle }, { title }],
    });
    if (existingProduct) {
      return res.status(200).json({
        msg: "Product already exists",
        post: {
          id: existingPost._id,
          slug: existingPost.handle,
          title: existingPost.title,
          status: existingPost.status,
          createdAt: existingPost.createdAt,
        },
      });
    }
    // Step 3: create Product
    const newProduct = await Product({
      title,
      description,
      price,
      vendor,
      product_type,
      handle: baseHandle,
      status,
      tags,
      images: imageIds,
      variants: variantIds,
    });
    const product = await newProduct.save();

    return res.status(201).json({
      msg: "Product created successfully!",
      product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  handleGetAllProducts,
  handleCreateNewProduct,
};
