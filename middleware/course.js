const { body, param } = require("express-validator");

exports.createCourseValidator = [
  body("course_name").notEmpty().withMessage("Course name is required"),
  body("course_code").notEmpty().withMessage("Course code is required"),
  body("lecturer_id")
    .notEmpty()
    .withMessage("Lecturer ID is required")
    .isInt()
    .withMessage("Lecturer ID must be an integer"),
];

exports.updateCourseValidator = [
  param("id").isInt().withMessage("Course ID must be an integer"),
  body("course_name").notEmpty().withMessage("Course name is required"),
  body("course_code").notEmpty().withMessage("Course code is required"),
  body("lecturer_id")
    .notEmpty()
    .withMessage("Lecturer ID is required")
    .isInt()
    .withMessage("Lecturer ID must be an integer"),
];

exports.courseIdValidator = [
  param("id").isInt().withMessage("Course ID must be an integer"),
];
