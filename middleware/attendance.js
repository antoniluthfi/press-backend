const { body } = require("express-validator");

exports.createSessionValidator = [
  body("course_id")
    .notEmpty()
    .withMessage("Course ID is required")
    .isInt()
    .withMessage("Course ID must be an integer"),
  body("session_date")
    .notEmpty()
    .withMessage("Session date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("location_id")
    .notEmpty()
    .withMessage("Location ID is required")
    .isInt()
    .withMessage("Location ID must be an integer"),
];

exports.recordAttendanceValidator = [
  body("session_id")
    .notEmpty()
    .withMessage("Session ID is required")
    .isInt()
    .withMessage("Session ID must be an integer"),
  body("student_id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isInt()
    .withMessage("Student ID must be an integer"),
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
];
