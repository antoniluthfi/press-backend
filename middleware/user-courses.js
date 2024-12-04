const { body, param } = require("express-validator");

exports.validateUserCourses = [
  body().isArray().withMessage("Payload harus berupa array."),
  body("*.user_id")
    .notEmpty()
    .withMessage("user_id harus diisi.")
    .isInt()
    .withMessage("user_id harus berupa angka."),
  body("*.course_id")
    .notEmpty()
    .withMessage("course_id harus diisi.")
    .isInt()
    .withMessage("course_id harus berupa angka."),
];

exports.userCourseIdValidator = [
  param("id").isInt().withMessage("Location ID must be an integer"),
];
