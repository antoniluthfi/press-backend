const { body, param } = require("express-validator");

exports.locationValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("radius")
    .notEmpty()
    .withMessage("Radius is required")
    .isInt({ min: 1 })
    .withMessage("Radius must be a positive integer"),
];

exports.locationIdValidator = [
  param("id").isInt().withMessage("Course ID must be an integer"),
];
