const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance");
const {
  createSessionValidator,
  recordAttendanceValidator,
} = require("../middleware/attendance");

// Rute untuk mendapatkan semua sesi presensi
router.get("/sessions", attendanceController.getAllSessions);

// Rute untuk membuat sesi presensi baru
router.post(
  "/sessions",
  createSessionValidator,
  attendanceController.createSession
);

// Rute untuk mencatat presensi mahasiswa
router.post(
  "/record",
  recordAttendanceValidator,
  attendanceController.recordAttendance
);

module.exports = router;
