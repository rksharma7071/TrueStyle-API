
const express = require("express");
const { handleGetAllProducts } = require("../controllers/product");

const router = express.Router();

router.route("/").get(handleGetAllProducts);

module.exports = router;
