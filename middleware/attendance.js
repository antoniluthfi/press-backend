const { body } = require("express-validator");

exports.recordAttendanceValidator = [
  body("qr_code")
    .if((value, { req }) => req.body.status === "present")
    .notEmpty()
    .withMessage("QR Code is required"),
  body("course_id")
    .notEmpty()
    .withMessage("Course ID is required")
    .isInt()
    .withMessage("Course ID must be an integer"),
  body("course_meeting_id")
    .notEmpty()
    .withMessage("Course Meeting ID is required")
    .isInt()
    .withMessage("Course Meeting ID must be an integer"),
  body("student_id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isInt()
    .withMessage("Student ID must be an integer"),
  body("latitude")
    .if((value, { req }) => req.body.status === "present")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a number between -90 and 90"),
  body("longitude")
    .if((value, { req }) => req.body.status === "present")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a number between -180 and 180"),
  body("status").notEmpty().withMessage("Status is required"),
  body("remarks")
    .notEmpty()
    .withMessage("Remarks is required"),
];
