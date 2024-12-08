const db = require("../config/db");
const { validationResult } = require("express-validator");

// Mendapatkan semua course
exports.getAllCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      lecturer_id = "",
      include_upcoming_schedule = 0,
    } = req.query;
    const offset = (page - 1) * limit;

    // Query untuk search dan pagination
    const query = `
      SELECT
        courses.*,
        users.name AS lecturer_name,
        locations.name AS location_name
        ${Number(include_upcoming_schedule) ? `,
        (
          SELECT JSON_OBJECT(
            'id', cm.id,
            'meeting_number', cm.meeting_number,
            'date', cm.date,
            'start_time', cm.start_time,
            'end_time', cm.end_time
          )
          FROM course_meetings cm
          WHERE cm.course_id = courses.id
            AND CONCAT(cm.date, ' ', cm.end_time) > NOW()
          ORDER BY CONCAT(cm.date, ' ', cm.start_time) ASC
          LIMIT 1
        ) AS upcoming_schedule` : ''}
      FROM courses
      JOIN users ON courses.lecturer_id = users.id
      JOIN locations ON courses.location_id = locations.id
      WHERE courses.name LIKE ? 
      ${lecturer_id ? "AND courses.lecturer_id = ?" : ""}
      ORDER BY courses.id DESC
      LIMIT ? OFFSET ?
    `;

    const searchQuery = `%${search}%`;
    const params = [searchQuery];

    // Tambahkan lecturer_id jika ada
    if (lecturer_id) {
      params.push(lecturer_id);
    }

    // Tambahkan limit dan offset
    params.push(Number(limit), Number(offset));

    // Eksekusi query
    const [rows] = await db.promise().query(query, params);

    // Hitung total data untuk pagination
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM courses
      ${
        lecturer_id
          ? "WHERE name LIKE ? AND lecturer_id = ?"
          : "WHERE name LIKE ?"
      }
    `;
    const countParams = lecturer_id
      ? [searchQuery, lecturer_id]
      : [searchQuery];
    const [totalRows] = await db.promise().query(countQuery, countParams);

    const total = totalRows[0].total;

    res.json({
      message: "Data retrieved successfully",
      data: rows,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit, 10),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Mendapatkan course berdasarkan ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        courses.*,
        users.name AS lecturer_name,
        locations.name AS location_name
      FROM courses 
      JOIN users ON courses.lecturer_id = users.id
      JOIN locations ON courses.location_id = locations.id
      WHERE courses.id = ?
    `;

    const [courseRows] = await db.promise().query(query, [id]);
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
      .query(
        "INSERT INTO courses (name, code, lecturer_id, location_id) VALUES (?, ?, ?)",
        [name, code, lecturer_id, location_id]
      );
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
    // Update course data
    const [result] = await db
      .promise()
      .query(
        "UPDATE courses SET name = ?, code = ?, lecturer_id = ?, location_id = ? WHERE id = ?",
        [name, code, lecturer_id, location_id, id]
      );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Retrieve existing course meetings
    const [existingMeetings] = await db
      .promise()
      .query("SELECT id FROM course_meetings WHERE course_id = ?", [id]);

    // Store mapping of old meeting IDs for updating attendance_records
    const oldMeetingIds = existingMeetings.map((meeting) => meeting.id);

    // Delete old course meetings
    await db.promise().query("DELETE FROM course_meetings WHERE course_id = ?", [id]);

    // Insert new course meetings
    if (meetings && meetings.length > 0) {
      const meetingValues = meetings.map((meeting) => [
        id,
        meeting.meeting_number,
        meeting.date,
        meeting.start_time,
        meeting.end_time,
      ]);

      const [insertResult] = await db
        .promise()
        .query(
          "INSERT INTO course_meetings (course_id, meeting_number, date, start_time, end_time) VALUES ?",
          [meetingValues]
        );

      const newMeetingIds = Array.from(
        { length: insertResult.affectedRows },
        (_, i) => insertResult.insertId + i
      );

      // Update attendance_records with new course_meeting_ids
      for (let i = 0; i < oldMeetingIds.length; i++) {
        if (newMeetingIds[i]) {
          await db
            .promise()
            .query(
              "UPDATE attendance_records SET course_meeting_id = ? WHERE course_meeting_id = ?",
              [newMeetingIds[i], oldMeetingIds[i]]
            );
        }
      }
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
    const [result] = await db
      .promise()
      .query("DELETE FROM courses WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    await db
      .promise()
      .query("DELETE FROM course_meetings WHERE course_id = ?", [id]);

    await db.promise().commit();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ error: error.message });
  }
};
