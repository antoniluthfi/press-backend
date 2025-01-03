const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance");
const { recordAttendanceValidator } = require("../middleware/attendance");
const { uploadAttendanceRecordFile } = require("../middleware/multer");

// Rute untuk mendapatkan semua sesi presensi
router.get("/records", attendanceController.getAllRecords);

// Rute untuk mencatat presensi mahasiswa
router.post(
  "/record",
  uploadAttendanceRecordFile.single("file"),
  recordAttendanceValidator,
  attendanceController.recordAttendance
);

module.exports = router;
