const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance");
const { recordAttendanceValidator } = require("../middleware/attendance");

// Rute untuk mendapatkan semua sesi presensi
router.get("/records", attendanceController.getAllRecords);

// Rute untuk mencatat presensi mahasiswa
router.post(
  "/record",
  recordAttendanceValidator,
  attendanceController.recordAttendance
);

module.exports = router;
