const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");
const {
  createCourseValidator,
  updateCourseValidator,
  courseIdValidator,
} = require("../middleware/course");

// Rute untuk mendapatkan semua course
router.get("/", courseController.getAllCourses);

// Rute untuk mendapatkan course berdasarkan ID
router.get("/:id", courseIdValidator, courseController.getCourseById);

// Rute untuk membuat course baru
router.post("/", createCourseValidator, courseController.createCourse);

// Rute untuk mengupdate course
router.put("/:id", updateCourseValidator, courseController.updateCourse);

// Rute untuk menghapus course
router.delete("/:id", courseIdValidator, courseController.deleteCourse);

module.exports = router;
