const express = require("express");
const router = express.Router();
const userCourseController = require("../controllers/user-courses");
const {
  validateUserCourses,
  userCourseIdValidator,
} = require("../middleware/user-courses");

// Rute untuk mendapatkan semua location
router.get("/", userCourseController.getAllUserCourses);

// Rute untuk membuat location baru
router.post("/", validateUserCourses, userCourseController.createUserCourses);

// Rute untuk menghapus location
router.delete(
  "/:id",
  userCourseIdValidator,
  userCourseController.deleteUserCourse
);

module.exports = router;
