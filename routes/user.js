const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const {
  userIdValidator,
  createNewUserValidator,
  updateUserValidator,
} = require("../middleware/user");
const { uploadUserProfileImage } = require("../middleware/multer");

// Rute untuk mendapatkan semua user
router.get("/", userController.getAllUsers);

// Rute untuk mendapatkan user berdasarkan ID
router.get("/:id", userIdValidator, userController.getUserById);

// Rute untuk reset user device berdasarkan ID
router.get("/reset/:id", userIdValidator, userController.resetUserDevice);

// Rute untuk membuat user baru
router.post(
  "/",
  uploadUserProfileImage.single("profile_url"),
  createNewUserValidator,
  userController.createNewUser
);

// Rute untuk mengupdate user
router.post(
  "/:id",
  uploadUserProfileImage.single("profile_url"),
  updateUserValidator,
  userController.updateUser
);

// Rute untuk menghapus user
router.delete("/:id", userIdValidator, userController.deleteUser);

module.exports = router;
