const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report");
const {
  attendanceRecapReportValidator,
  attendanceRecapPerUserReportValidator,
} = require("../middleware/report");

// Rute untuk mendapatkan report attendance recap
router.post(
  "/attendance-recap",
  attendanceRecapReportValidator,
  reportController.generateAttendanceRecapReport
);

// Rute untuk mendapatkan report attendance recap per mahasiswa
router.post(
  "/attendance-recap-per-user",
  attendanceRecapPerUserReportValidator,
  reportController.generateAttendanceRecapPerUserReport
);

module.exports = router;
