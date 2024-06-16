const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const attendanceRoutes = require("./attendance");
const courseRoutes = require("./course");
const locationRoutes = require("./location");

const authMiddleware = require("../middleware/auth");

router.use("/auth", authRoutes);
router.use("/course", authMiddleware.verifyToken, courseRoutes);
router.use("/attendance", authMiddleware.verifyToken, attendanceRoutes);
router.use("/location", authMiddleware.verifyToken, locationRoutes);

module.exports = router;
