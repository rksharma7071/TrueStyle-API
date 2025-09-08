const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const userProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipcode: { type: String },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
    profile_pic: { type: String },
    public_id: { type: String },
  },
  { timestamps: true }
);

const userAddressesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address_type: {
      type: String,
      enum: ["home", "work", "billing", "shipping"],
      default: "home",
    },
    address_line1: { type: String },
    address_line2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipcode: { type: String },
  },
  { timestamps: true }
);

const userSessionsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String },
    ip_address: { type: String },
    user_agent: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const UserProfile = mongoose.model("UserProfile", userProfileSchema);
const UserAddress = mongoose.model("UserAddress", userAddressesSchema);
const UserSession = mongoose.model("UserSession", userSessionsSchema);

module.exports = {
  User,
  UserProfile,
  UserAddress,
  UserSession,
};
