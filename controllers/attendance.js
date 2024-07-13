const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const db = require("../config/db");
const { generateRandomString } = require("../utils/generate-random-string");

// Mengambil semua sesi presensi
exports.getAllSessions = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
        SELECT 
          attendance_sessions.id AS session_id,
          attendance_sessions.session_date,
          attendance_sessions.created_at AS session_created_at,
          attendance_sessions.updated_at AS session_updated_at,
          locations.id AS location_id,
          locations.name AS location_name,
          locations.latitude,
          locations.longitude,
          locations.radius,
          qr_codes.id AS qr_id,
          qr_codes.qr_code,
          qr_codes.expiration_time,
          courses.id AS course_id,
          courses.name AS course_name,
          courses.code AS course_code
        FROM attendance_sessions
        JOIN locations ON attendance_sessions.location_id = locations.id
        JOIN qr_codes ON attendance_sessions.qr_id = qr_codes.id
        JOIN courses ON attendance_sessions.course_id = courses.id
      `);

    const sessions = rows.map((row) => ({
      id: row.session_id,
      session_date: row.session_date,
      course: {
        id: row.course_id,
        name: row.course_name,
        code: row.course_code,
      },
      location: {
        id: row.location_id,
        name: row.location_name,
        latitude: row.latitude,
        longitude: row.longitude,
        radius: row.radius,
      },
      qr_code: {
        id: row.qr_id,
        qr_code: row.qr_code,
        expiration_time: row.expiration_time,
      },
      created_at: row.session_created_at,
      updated_at: row.session_updated_at,
    }));

    res.json({
      message: "Data retrieved successfully",
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengambil semua record presensi
exports.getAllRecords = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
        SELECT 
          attendance_records.id AS attendance_record_id,
          attendance_records.attendance_time,
          attendance_records.longitude,
          attendance_records.latitude,
          attendance_records.created_at,
          attendance_records.updated_at,
          attendance_sessions.id AS attendance_session_id,
          users.id AS student_id,
          users.name AS student_name
        FROM attendance_records
        JOIN attendance_sessions ON attendance_records.session_id = attendance_sessions.id
        JOIN users ON attendance_records.student_id = users.id
      `);

    const sessions = rows.map((row) => ({
      id: row.session_id,
      attendance_time: row.attendance_time,
      longitude: row.longitude,
      latitude: row.latitude,
      attendance_session_id: row.attendance_session_id,
      student: {
        id: row.student_id,
        name: row.student_name,
      },
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    res.json({
      message: "Data retrieved successfully",
      data: sessions,
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

  const { session_id, student_id, latitude, longitude, qr_code } = req.body;
  const attendanceTime = new Date();

  try {
    // Ambil QR code yang ada dari database
    const [rowsQrCode] = await db
      .promise()
      .query("SELECT * FROM qr_codes WHERE qr_code = ?", [qr_code]);

    if (rowsQrCode.length === 0) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    const qrCodeExpirationTime = new Date(rowsQrCode[0].expiration_time);
    if (attendanceTime > qrCodeExpirationTime) {
      return res.status(400).json({ message: 'QR Code has expired' });
    }

    await db
      .promise()
      .query(
        "INSERT INTO attendance_records (session_id, student_id, attendance_time, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
        [session_id, student_id, attendanceTime, latitude, longitude]
      );

    res.status(201).json({ message: "Attendance has been recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
