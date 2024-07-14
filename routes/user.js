const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const {
  userIdValidator,
  createNewUserValidator,
  updateUserValidator,
} = require("../middleware/user");

// Rute untuk mendapatkan semua user
router.get("/", userController.getAllUsers);

// Rute untuk mendapatkan user berdasarkan ID
router.get("/:id", userIdValidator, userController.getUserById);

// Rute untuk membuat user baru
router.post("/", createNewUserValidator, userController.createNewUser);

// Rute untuk mengupdate user
router.put("/:id", updateUserValidator, userController.updateUser);

// Rute untuk menghapus user
router.delete("/:id", userIdValidator, userController.deleteUser);

module.exports = router;
