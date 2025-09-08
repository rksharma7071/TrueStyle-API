const express = require("express");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

const mongoose_url = process.env.MONGO_URI;

mongoose
  .connect(mongoose_url)
  .then(() => console.log("✅ MongoDB Connected Successfully..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const apiRoutes = {
    "/users": "User related operations",
    "/auth": "Login related operations",
    "/posts": "Post related operations",
    "/tags": "Tag related operations",
    "/categories": "Category related operations",
    "/postTags": "Post-Tag relationship operations",
    "/comments": "Comment related operations",
  };

  res.json({
    msg: "Welcome to the API!",
    availableRoutes: apiRoutes,
  });
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}...`);
});
