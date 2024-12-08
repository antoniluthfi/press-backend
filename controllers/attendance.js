const { validationResult } = require("express-validator");

const db = require("../config/db");
const { haversineDistance } = require("../utils/haversine-distance");
const removeFile = require("../utils/remove-file");

// Mengambil semua record presensi (untuk data rekapan)
exports.getAllRecords = async (req, res) => {
  try {
    // Ambil query parameter untuk filter course_meeting_id
    const { course_meeting_id } = req.query;

    // Bangun query SQL dengan kondisi optional berdasarkan course_meeting_id
    const sql = `
      SELECT 
        attendance_records.*,
        users.id AS student_id,
        users.name AS student_name,
        users.identification_number AS student_identification_number
      FROM attendance_records
      JOIN users ON attendance_records.student_id = users.id
      ${
        course_meeting_id
          ? "WHERE attendance_records.course_meeting_id = ?"
          : ""
      }
    `;

    // Eksekusi query dengan parameter jika ada course_meeting_id
    const [rows] = await db
      .promise()
      .query(sql, course_meeting_id ? [course_meeting_id] : []);

    const sessions = rows.map((row) => ({
      id: row.id,
      attendance_time: row.attendance_time,
      longitude: row.longitude,
      latitude: row.latitude,
      course_meeting_id: row.course_meeting_id,
      status: row.status,
      remarks: row.remarks,
      file_path: row.file_path,
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

  const {
    course_meeting_id,
    course_id,
    student_id,
    latitude,
    longitude,
    qr_code,
    status = "absent",
    remarks = "",
  } = req.body;
  const attendanceTime = new Date();

  try {
    // Ambil QR code yang ada dari database
    const [rowsQrCode] = await db
      .promise()
      .query("SELECT * FROM qr_codes WHERE qr_code = ?", [qr_code]);

    if (rowsQrCode.length === 0) {
      removeFile(req.file?.path);
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    // Bandingkan expiration time
    const qrCodeExpirationTime = new Date(rowsQrCode[0].expiration_time);
    if (attendanceTime > qrCodeExpirationTime) {
      removeFile(req.file?.path);
      return res.status(400).json({ message: "QR Code has expired" });
    }

    // Validasi apakah sudah melakukan absensi atau belum
    const [rowsAttendance] = await db
      .promise()
      .query(
        "SELECT * FROM attendance_records WHERE course_meeting_id = ? AND student_id = ? AND status = ?",
        [course_meeting_id, student_id, "present"]
      );

    if (rowsAttendance.length > 0) {
      removeFile(req.file?.path);
      return res.status(400).json({ message: "Attendance already recorded" });
    }

    // Ambil titik koordinat lokasi
    const [rowsCourse] = await db.promise().query(
      `
        SELECT 
          courses.id, 
          locations.latitude, 
          locations.longitude,
          locations.radius 
        FROM courses 
        LEFT JOIN locations ON courses.location_id = locations.id
        WHERE courses.id = ?
      `,
      [course_id]
    );

    if (rowsCourse.length === 0) {
      removeFile(req.file?.path);
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
      removeFile(req.file?.path);
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
      removeFile(req.file?.path);
      return res.status(404).json({ message: "Student not found" });
    }

    await db
      .promise()
      .query(
        "INSERT INTO attendance_records (course_meeting_id, student_id, attendance_time, latitude, longitude, status, remarks, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          course_meeting_id,
          student_id,
          attendanceTime,
          latitude,
          longitude,
          status,
          remarks,
          req.file?.path || "",
        ]
      );

    res.status(201).json({ message: "Attendance has been recorded" });
  } catch (error) {
    removeFile(req.file?.path);
    res.status(500).json({ error: error.message });
  }
};
