
const express = require("express");
const { handleGetAllProducts, handleCreateNewProduct } = require("../controllers/product");
const upload = require("../config/multer");

const router = express.Router();

router.route("/")
    .get(handleGetAllProducts)
    .post("/", upload.array("images", 5), handleCreateNewProduct);

module.exports = router;
