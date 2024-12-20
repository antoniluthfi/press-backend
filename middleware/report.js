const { body } = require("express-validator");

exports.attendanceRecapReportValidator = [
  body("course_id").notEmpty().withMessage("Course ID is required"),
];

exports.attendanceRecapPerUserReportValidator = [
  body("course_id").notEmpty().withMessage("Course ID is required"),
  body("user_id").notEmpty().withMessage("User ID is required"),
];