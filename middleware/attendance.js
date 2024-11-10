const { body } = require("express-validator");

exports.recordAttendanceValidator = [
  body("qr_code").notEmpty().withMessage("QR Code is required"),
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
