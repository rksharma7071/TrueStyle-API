const express = require("express");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const apiRoutes = {
    "/users": "User related operations",
    "/auth": "Login related operations"
  };

  res.json({
    msg: "Welcome to the API!",
    availableRoutes: apiRoutes,
  });
});

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/product", productRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}...`);
});
