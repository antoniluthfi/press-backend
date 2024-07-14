const { body, param } = require("express-validator");

exports.createNewUserValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('identification_number').notEmpty().withMessage('Identification number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone_number').notEmpty().withMessage('Phone number is required'),
  body('profile_url').isURL().withMessage('Valid profile URL is required'),
];

exports.updateUserValidator = [
  param("id").isInt().withMessage("User ID must be an integer"),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('gender').notEmpty().withMessage('Gender is required'),
  body('identification_number').notEmpty().withMessage('Identification number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('phone_number').notEmpty().withMessage('Phone number is required'),
  body('profile_url').isURL().withMessage('Valid profile URL is required'),
  body('status').notEmpty().withMessage('Status is required'),
];

exports.userIdValidator = [
  param("id").isInt().withMessage("User ID must be an integer"),
];
