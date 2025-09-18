// controllers/product.js
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
    let {
      title,
      description,
      price,
      vendor,
      product_type,
      handle,
      status,
      tags = [],
      variants = [],
    } = req.body;

    // ✅ Normalize tags
    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags.replace(/'/g, '"'));
        if (!Array.isArray(tags)) {
          return res.status(400).json({ msg: "Tags must be an array" });
        }
      } catch (error) {
        return res.status(400).json({ msg: "Invalid tags format" });
      }
    }

    // ✅ Normalize variants
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants.replace(/'/g, '"'));
        if (!Array.isArray(variants)) {
          return res.status(400).json({ msg: "Variants must be an array" });
        }
      } catch (error) {
        return res.status(400).json({ msg: "Invalid variants format" });
      }
    }

    // ✅ Required fields validation
    if (!title || !price || !vendor || !product_type || !status) {
      return res.status(400).json({
        msg: "title, price, vendor, product_type, and status are required",
      });
    }

    // ✅ Slugify handle
    const baseHandle = slugify(title, { lower: true, strict: true });

    // ✅ Check if product exists
    const existingProduct = await Product.findOne({
      $or: [{ handle: baseHandle }, { title }],
    });
    if (existingProduct) {
      return res.status(409).json({
        msg: "Product already exists",
        product: existingProduct,
      });
    }

    // ✅ Step 1: Save Images (multiple)
    let imageIds = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageDoc = new Image({
          src: file.path, // Cloudinary URL
          alt: title,
        });
        await imageDoc.save();
        imageIds.push(imageDoc._id);
      }
    }

    // ✅ Step 2: Create Variants
    const variantDocs = await Variant.insertMany(
      variants.map((v) => ({
        title: v.title,
        sku: v.sku || `${baseHandle}-${Date.now()}`,
        price: v.price || price,
        compare_at_price: v.compare_at_price || null,
        inventory_quantity: v.inventory_quantity || 0,
        weight: v.weight || null,
        barcode: v.barcode || null,
        requires_shipping:
          typeof v.requires_shipping === "boolean"
            ? v.requires_shipping
            : true,
      }))
    );
    const variantIds = variantDocs.map((v) => v._id);

    // ✅ Step 3: Create Product
    const newProduct = new Product({
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
    await newProduct.save();

    // ✅ Step 4: Return populated product
    const savedProduct = await Product.findById(newProduct._id)
      .populate("images")
      .populate("variants");

    return res.status(201).json({
      msg: "Product created successfully!",
      product: savedProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ msg: "Duplicate field value", error });
    }
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  handleGetAllProducts,
  handleCreateNewProduct,
};
