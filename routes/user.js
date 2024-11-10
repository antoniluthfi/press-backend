const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const {
  userIdValidator,
  createNewUserValidator,
  updateUserValidator,
} = require("../middleware/user");
const { verifyToken } = require("../middleware/auth");
const { uploadUserProfileImage } = require("../middleware/multer");

// Rute untuk mendapatkan semua user
router.get("/", verifyToken, userController.getAllUsers);

// Rute untuk mendapatkan user berdasarkan ID
router.get("/:id", verifyToken, userIdValidator, userController.getUserById);

// Rute untuk membuat user baru
router.post(
  "/",
  uploadUserProfileImage.single("profile_url"),
  verifyToken,
  createNewUserValidator,
  userController.createNewUser
);

// Rute untuk mengupdate user
router.post(
  "/:id",
  uploadUserProfileImage.single("profile_url"),
  verifyToken,
  updateUserValidator,
  userController.updateUser
);

// Rute untuk menghapus user
router.delete("/:id", verifyToken, userIdValidator, userController.deleteUser);

module.exports = router;
