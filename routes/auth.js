const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const {
  registerValidator,
  loginValidator,
  verifyToken,
  forgotPasswordValidator,
} = require("../middleware/auth");

// Rute untuk register
router.post("/register", registerValidator, authController.register);

// Rute untuk login
router.post("/login", loginValidator, authController.login);

// Rute untuk refresh token
router.get("/refresh-token", verifyToken, authController.refreshToken);

// Rute untuk mendapatkan user yang telah terotentikasi
router.get(
  "/authenticated-user",
  verifyToken,
  authController.getAuthenticatedUser
);

// Rute untuk logout
router.get("/logout", verifyToken, authController.logout);

// Rute untuk forgot password
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  authController.forgotPassword
);

module.exports = router;
