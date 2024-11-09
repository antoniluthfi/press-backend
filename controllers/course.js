const db = require("../config/db");
const { validationResult } = require("express-validator");

// Mendapatkan semua course
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const offset = (page - 1) * limit;

    // Query untuk search dan pagination
    const query = `
      SELECT * FROM courses 
      WHERE name LIKE ? 
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;
    const searchQuery = `%${search}%`;

    // Eksekusi query
    const [rows] = await db
      .promise()
      .query(query, [searchQuery, Number(limit), Number(offset)]);

    // Hitung total data untuk pagination
    const [totalRows] = await db
      .promise()
      .query("SELECT COUNT(*) AS total FROM courses WHERE name LIKE ?", [
        searchQuery,
      ]);
    const total = totalRows[0].total;

    res.json({
      message: "Data retrieved successfully",
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan course berdasarkan ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [courseRows] = await db
      .promise()
      .query("SELECT * FROM courses WHERE id = ?", [id]);
    if (courseRows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const [meetingsRows] = await db
      .promise()
      .query("SELECT * FROM course_meetings WHERE course_id = ?", [id]);

    const courseData = {
      ...courseRows[0],
      meetings: meetingsRows,
    };

    res.json({
      message: "Data retrieved successfuly",
      data: courseData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Membuat course baru
exports.createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await db.promise().beginTransaction();

  const { name, code, lecturer_id, location_id, meetings } = req.body;
  try {
    const [courseResult] = await db
      .promise()
      .query("INSERT INTO courses (name, code, lecturer_id, location_id) VALUES (?, ?, ?)", [
        name,
        code,
        lecturer_id,
        location_id,
      ]);
    const courseId = courseResult.insertId;

    if (meetings && meetings.length > 0) {
      const meetingValues = meetings.map((meeting) => [
        courseId,
        meeting.meeting_number,
        meeting.date,
        meeting.start_time,
        meeting.end_time,
      ]);

      await db
        .promise()
        .query(
          "INSERT INTO course_meetings (course_id, meeting_number, date, start_time, end_time) VALUES ?",
          [meetingValues]
        );
    }

    await db.promise().commit();
    res.status(201).json({
      id: courseResult.insertId,
      message: "Course created successfully",
    });
  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ error: error.message });
  }
};

// Mengupdate course
exports.updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await db.promise().beginTransaction();

  const { id } = req.params;
  const { name, code, lecturer_id, location_id, meetings } = req.body;
  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE courses SET name = ?, code = ?, lecturer_id = ?, location_id = ? WHERE id = ?",
        [name, code, lecturer_id, location_id, id]
      );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    await db
      .promise()
      .query("DELETE FROM course_meetings WHERE course_id = ?", [id]);

    if (meetings && meetings.length > 0) {
      const meetingValues = meetings.map((meeting) => [
        id,
        meeting.meeting_number,
        meeting.date,
        meeting.start_time,
        meeting.end_time,
      ]);

      await db
        .promise()
        .query(
          "INSERT INTO course_meetings (course_id, meeting_number, date, start_time, end_time) VALUES ?",
          [meetingValues]
        );
    }

    await db.promise().commit();
    res.json({ message: "Course updated successfully" });
  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ error: error.message });
  }
};

// Menghapus course
exports.deleteCourse = async (req, res) => {
  await db.promise().beginTransaction();

  const { id } = req.params;
  try {
    // Cek course pada data lain
    const [rowsSession] = await db
      .promise()
      .query("SELECT id FROM attendance_sessions WHERE course_id = ?", [id]);

    if (rowsSession.length) {
      return res
        .status(400)
        .json({ message: "Course has been used in other data" });
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM courses WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    await db.promise().query("DELETE FROM courses WHERE id = ?", [courseId]);

    await db.promise().commit();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ error: error.message });
  }
};
