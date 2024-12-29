const express = require("express");
const router = express.Router();
const userCourseController = require("../controllers/user-courses");
const {
  validateUserCourses,
  userCourseIdValidator,
  validateUpdateUserCourses,
} = require("../middleware/user-courses");

// Rute untuk mendapatkan semua data
router.get("/", userCourseController.getAllUserCourses);

// Rute untuk membuat data baru
router.post("/", validateUserCourses, userCourseController.createUserCourses);

// Rute untuk update data baru
router.put(
  "/:id",
  validateUpdateUserCourses,
  userCourseController.updateUserCourses
);

// Rute untuk menghapus data
router.delete(
  "/:id",
  userCourseIdValidator,
  userCourseController.deleteUserCourse
);

module.exports = router;
