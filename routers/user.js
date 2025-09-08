const express = require("express");
const { handleGetAllUsers } = require("../controllers/user");

const router = express.Router();

router.route("/").get(handleGetAllUsers);

module.exports = router;
