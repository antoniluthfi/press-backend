const { body } = require("express-validator");

exports.qrCodeValidator = [
  body("course_meeting_id").notEmpty().withMessage("Course meeting ID is required"),
];
