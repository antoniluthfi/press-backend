const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const attendanceRoutes = require("./attendance");
const courseRoutes = require("./course");
const locationRoutes = require("./location");
const qrCodeRoutes = require("./qr-code");
const userRoutes = require("./user");
const userCourseRoutes = require("./user-course");

const authMiddleware = require("../middleware/auth");

router.use("/auth", authRoutes);
router.use("/course", authMiddleware.verifyToken, courseRoutes);
router.use("/attendance", authMiddleware.verifyToken, attendanceRoutes);
router.use("/location", authMiddleware.verifyToken, locationRoutes);
router.use("/qr-code", authMiddleware.verifyToken, qrCodeRoutes);
router.use("/user", authMiddleware.verifyToken, userRoutes);
router.use("/user-course", authMiddleware.verifyToken, userCourseRoutes);

module.exports = router;
