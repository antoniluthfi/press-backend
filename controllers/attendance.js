const { validationResult } = require("express-validator");

const db = require("../config/db");
const { haversineDistance } = require("../utils/haversine-distance");

// Mengambil semua record presensi (untuk data rekapan)
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
          users.id AS student_id,
          users.name AS student_name,
          users.identification_number AS student_identification_number
        FROM attendance_records
        JOIN users ON attendance_records.student_id = users.id
      `);

    const sessions = rows.map((row) => ({
      id: row.session_id,
      attendance_time: row.attendance_time,
      longitude: row.longitude,
      latitude: row.latitude,
      student: {
        id: row.student_id,
        name: row.student_name,
        identification_number: row.student_identification_number,
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

// Mencatat presensi mahasiswa (absensi)
exports.recordAttendance = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { course_id, student_id, latitude, longitude, qr_code } = req.body;
  const attendanceTime = new Date();

  try {
    // Ambil QR code yang ada dari database
    const [rowsQrCode] = await db
      .promise()
      .query("SELECT * FROM qr_codes WHERE qr_code = ?", [qr_code]);

    if (rowsQrCode.length === 0) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    // Bandingkan expiration time
    const qrCodeExpirationTime = new Date(rowsQrCode[0].expiration_time);
    if (attendanceTime > qrCodeExpirationTime) {
      return res.status(400).json({ message: "QR Code has expired" });
    }

    // Ambil titik koordinat lokasi
    const [rowsCourse] = await db.promise().query(
      `
        SELECT 
          course.id, 
          locations.latitude, 
          locations.longitude,
          locations.radius 
        FROM course 
        LEFT JOIN locations ON course.location_id = locations.id
        WHERE course.id = ?
      `,
      [course_id]
    );

    if (rowsCourse.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const distance = haversineDistance({
      lat1: Number(rowsCourse[0].latitude),
      lon1: Number(rowsCourse[0].longitude),
      lat2: Number(latitude),
      lon2: Number(longitude),
    });

    // Periksa radius lokasi
    if (distance > Number(rowsCourse[0].radius)) {
      return res.status(400).json({ message: "Location is out of range" });
    }

    // Periksa data student
    const [rowsStudent] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ? AND role = ?", [
        student_id,
        "student",
      ]);

    if (rowsStudent.length === 0) {
      return res.status(404).json({ message: "Student not found" });
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
