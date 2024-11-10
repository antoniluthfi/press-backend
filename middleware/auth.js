const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
require("dotenv").config();

// Middleware untuk memverifikasi token JWT
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }
    console.log('req.file: ', req.file);
    req.userId = decoded.user_id;
    req.userRole = decoded.role;
    next();
  });
};

exports.registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female"])
    .withMessage("Invalid gender"),
  body("identification_number")
    .notEmpty()
    .withMessage("Identification number is required")
    .isInt()
    .withMessage("Identification number must be an integer"),
  body("address").notEmpty().withMessage("Address is required"),
  body("phone_number").notEmpty().withMessage("Phone number is required"),
  body("profile_url")
    .notEmpty()
    .withMessage("Profile URL is required")
    .isURL()
    .withMessage("Invalid profile URL"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

exports.loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.refreshTokenValidator = [
  body("refresh_token").notEmpty().withMessage("Refresh token is required"),
];
