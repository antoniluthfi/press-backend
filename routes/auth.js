const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { registerValidator, loginValidator } = require("../middleware/auth");

// Rute untuk register
router.post("/register", registerValidator, authController.register);

// Rute untuk login
router.post("/login", loginValidator, authController.login);

module.exports = router;
