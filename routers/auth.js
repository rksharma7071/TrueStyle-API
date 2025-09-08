const express = require("express");
const router = express.Router();
const {
  handleAuthLogin,
  handleAuthSignUp,
  handleAuthChangePassword,
  handleAuthRequestOTP,
  handleAuthVerifyOTP,
  handleAuthResetPassword,
} = require("../controllers/auth");

router.route("/signup").post(handleAuthSignUp);
router.route("/login").post(handleAuthLogin);
router.route("/change-password").post(handleAuthChangePassword);
router.route("/request-otp").post(handleAuthRequestOTP);
router.route("/verify-otp").post(handleAuthVerifyOTP);
router.route("/reset-password").post(handleAuthResetPassword);

module.exports = router;
