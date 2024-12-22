const { validationResult } = require("express-validator");

const db = require("../config/db");
const { haversineDistance } = require("../utils/haversine-distance");
const removeFile = require("../utils/remove-file");

// Mengambil semua record presensi (untuk data rekapan)
exports.getAllRecords = async (req, res) => {
  try {
    // Ambil query parameter untuk filter course_meeting_id, user_id, course_id, search, dan pagination
    const { 
      course_meeting_id, 
      user_id, 
      course_id,
      search, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Hitung offset untuk pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Bangun query SQL dengan join ke course_meetings dan courses
    let sql = `
      SELECT 
        attendance_records.*,
        users.id AS student_id,
        users.name AS student_name,
        users.identification_number AS student_identification_number,
        course_meetings.id AS meeting_id,
        course_meetings.meeting_number,
        course_meetings.date AS meeting_date,
        courses.id AS course_id,
        courses.name AS course_name,
        courses.code AS course_code
      FROM attendance_records
      JOIN users ON attendance_records.student_id = users.id
      JOIN course_meetings ON attendance_records.course_meeting_id = course_meetings.id
      JOIN courses ON course_meetings.course_id = courses.id
    `;

    const conditions = [];
    const params = [];

    // Filter berdasarkan course_meeting_id
    if (course_meeting_id) {
      conditions.push("attendance_records.course_meeting_id = ?");
      params.push(course_meeting_id);
    }

    // Filter berdasarkan user_id
    if (user_id) {
      conditions.push("attendance_records.student_id = ?");
      params.push(user_id);
    }

    // Filter berdasarkan course_id
    if (course_id) {
      conditions.push("courses.id = ?");
      params.push(course_id);
    }

    // Filter berdasarkan kata kunci search
    if (search) {
      conditions.push(`
        (
          courses.name LIKE ? OR 
          attendance_records.remarks LIKE ?
        )
      `);
      // Tambahkan '%' di sekitar kata kunci untuk operasi LIKE
      params.push(`%${search}%`, `%${search}%`);
    }

    // Tambahkan kondisi WHERE jika ada filter
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Tambahkan ORDER BY untuk sorting berdasarkan created_at
    sql += ` ORDER BY attendance_records.created_at DESC`;

    // Tambahkan LIMIT dan OFFSET untuk pagination
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    // Query untuk menghitung total data
    let countSql = `
      SELECT COUNT(*) AS total 
      FROM attendance_records 
      JOIN users ON attendance_records.student_id = users.id
      JOIN course_meetings ON attendance_records.course_meeting_id = course_meetings.id
      JOIN courses ON course_meetings.course_id = courses.id
    `;

    if (conditions.length > 0) {
      countSql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Eksekusi query
    const [countRows] = await db
      .promise()
      .query(countSql, params.slice(0, params.length - 2)); // Exclude LIMIT and OFFSET
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    // Eksekusi query utama
    const [rows] = await db.promise().query(sql, params);

    // Mapping data
    const sessions = rows.map((row) => ({
      id: row.id,
      attendance_time: row.attendance_time,
      longitude: row.longitude,
      latitude: row.latitude,
      course_meeting_id: row.course_meeting_id,
      meeting: {
        id: row.meeting_id,
        meeting_number: row.meeting_number,
        date: row.meeting_date,
        course: {
          id: row.course_id,
          name: row.course_name,
          code: row.course_code,
        },
      },
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

    // Kirim response
    res.json({
      message: "Data retrieved successfully",
      data: sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: parseInt(limit),
      },
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
    if (status === "present") {
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
