const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const db = require("../config/db");
const { generateRandomString } = require("../utils/generate-random-string");

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

  const { course_id, session_date, location_id } = req.body;
  try {
    const randomString = generateRandomString(16); // Panjang string random
    const hashedQrCode = await bcrypt.hash(randomString, 10);
    const expirationTime = new Date(Date.now() + 1 * 60000); // 1 menit dari sekarang

    const [qrCode] = await db
      .promise()
      .query("INSERT INTO qr_codes (qr_code, expiration_time) VALUES (?, ?)", [
        hashedQrCode,
        expirationTime,
      ]);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO attendance_sessions (course_id, session_date, qr_id, location_id) VALUES (?, ?, ?, ?)",
        [course_id, session_date, qrCode.insertId, location_id]
      );

    res.status(201).json({
      message: "Session created successfuly",
      data: {
        id: result.insertId,
        qr_code: hashedQrCode,
      },
    });
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

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO attendance_records (session_id, student_id, attendance_time, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)",
        [session_id, student_id, attendance_time, latitude, longitude]
      );

    res.statue(201).json({ record_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
