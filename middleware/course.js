const { body, param } = require("express-validator");

exports.createCourseValidator = [
  body("name").notEmpty().withMessage("Course name is required"),
  body("code").notEmpty().withMessage("Course code is required"),
  body("lecturer_id")
    .notEmpty()
    .withMessage("Lecturer ID is required")
    .isInt()
    .withMessage("Lecturer ID must be an integer"),
    
  // Validasi untuk 'meetings' (harus array dan tidak boleh kosong)
  body("meetings")
    .isArray({ min: 1 })
    .withMessage("Meetings must be a non-empty array"),

  // Validasi untuk setiap elemen di 'meetings' array
  body("meetings.*.meeting_number")
    .notEmpty()
    .withMessage("Meeting number is required")
    .isInt()
    .withMessage("Meeting number must be an integer"),

  body("meetings.*.date")
    .notEmpty()
    .withMessage("Meeting date is required")
    .isISO8601()
    .withMessage(
      "Meeting date must be a valid ISO 8601 date format (YYYY-MM-DD)"
    ),

  body("meetings.*.start_time")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm format"),

  body("meetings.*.end_time")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm format"),
];

exports.updateCourseValidator = [
  param("id").isInt().withMessage("Course ID must be an integer"),
  body("name").notEmpty().withMessage("Course name is required"),
  body("code").notEmpty().withMessage("Course code is required"),
  body("lecturer_id")
    .notEmpty()
    .withMessage("Lecturer ID is required")
    .isInt()
    .withMessage("Lecturer ID must be an integer"),

  // Validasi untuk 'meetings' (harus array dan tidak boleh kosong)
  body("meetings")
    .isArray({ min: 1 })
    .withMessage("Meetings must be a non-empty array"),

  // Validasi untuk setiap elemen di 'meetings' array
  body("meetings.*.meeting_number")
    .notEmpty()
    .withMessage("Meeting number is required")
    .isInt()
    .withMessage("Meeting number must be an integer"),

  body("meetings.*.date")
    .notEmpty()
    .withMessage("Meeting date is required")
    .isISO8601()
    .withMessage(
      "Meeting date must be a valid ISO 8601 date format (YYYY-MM-DD)"
    ),

  body("meetings.*.start_time")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in HH:mm format"),

  body("meetings.*.end_time")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in HH:mm format"),
];

exports.courseIdValidator = [
  param("id").isInt().withMessage("Course ID must be an integer"),
];
