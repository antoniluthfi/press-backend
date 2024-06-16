const db = require("../config/db");
const { validationResult } = require("express-validator");

// Mengambil semua sesi presensi
exports.getAllSessions = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM attendance_sessions");

    res.json({
      message: "Data retrieved successfuly",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Membuat sesi presensi baru
exports.createSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { course_id, session_date, qr_code, latitude, longitude, radius } =
    req.body;
  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO attendance_sessions (course_id, session_date, qr_code, latitude, longitude, radius) VALUES (?, ?, ?, ?, ?, ?)",
        [course_id, session_date, qr_code, latitude, longitude, radius]
      );

    res.json({ session_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mencatat presensi mahasiswa
exports.recordAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { session_id, student_id, latitude, longitude } = req.body;
  const attendance_time = new Date();
  // Implementasikan logika untuk menentukan status hadir atau tidak hadir berdasarkan koordinat dan radius
  // Sementara di sini diset hadir untuk contoh
  const status = "hadir";

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO attendance_records (session_id, student_id, attendance_time, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?)",
        [session_id, student_id, attendance_time, latitude, longitude, status]
      );
    res.json({ record_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
