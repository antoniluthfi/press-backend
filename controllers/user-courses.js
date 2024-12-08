const db = require("../config/db");
const { validationResult } = require("express-validator");
const {
  getCurrentAcademicYear,
  getCurrentSemester,
} = require("../utils/generate-current-academic-year");

exports.getAllUserCourses = async (req, res) => {
  const {
    page = 1,
    limit = 5,
    search = "",
    course_id = "",
    user_id = "",
    include_upcoming_schedule = 0,
  } = req.query; // Mengambil query params

  const offset = (page - 1) * limit; // Menghitung offset untuk pagination

  try {
    const currentAcademicYear = getCurrentAcademicYear();
    const currentSemester = getCurrentSemester();

    const baseQuery = `
      SELECT 
        user_courses.id,
        user_id,
        users.name AS user_name, 
        users.identification_number,
        users.role,
        course_id, 
        courses.name AS course_name,
        academic_year,
        semester
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
      FROM user_courses
      JOIN users ON user_courses.user_id = users.id
      JOIN courses ON user_courses.course_id = courses.id
      WHERE user_courses.academic_year = ? 
        AND user_courses.semester = ?
        AND (users.name LIKE ? OR courses.name LIKE ?)
        ${course_id ? "AND course_id = ?" : ""}
        ${user_id ? "AND user_id = ?" : ""}
      ORDER BY user_courses.id DESC
      LIMIT ? OFFSET ?;
    `;

    const params = [
      currentAcademicYear,
      currentSemester,
      `%${search}%`,
      `%${search}%`,
    ];

    if (course_id) {
      params.push(course_id); // Menambahkan filter course_id jika ada
    }

    if (user_id) {
      params.push(user_id); // Menambahkan filter user_id jika ada
    }

    params.push(Number(limit), Number(offset));

    const [rows] = await db.promise().query(baseQuery, params);

    // Mengambil total data untuk keperluan pagination
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM user_courses
      JOIN users ON user_courses.user_id = users.id
      JOIN courses ON user_courses.course_id = courses.id
      WHERE user_courses.academic_year = ? 
        AND user_courses.semester = ?
        AND (users.name LIKE ? OR courses.name LIKE ?)
        ${course_id ? "AND course_id = ?" : ""}
        ${user_id ? "AND user_id = ?" : ""}
    `;

    const countParams = [
      currentAcademicYear,
      currentSemester,
      `%${search}%`,
      `%${search}%`,
    ];

    if (course_id) {
      countParams.push(course_id); // Menambahkan filter course_id jika ada
    }

    if (user_id) {
      countParams.push(user_id); // Menambahkan filter user_id jika ada
    }

    const [totalRows] = await db.promise().query(countQuery, countParams);
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

exports.createUserCourses = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userCourses = req.body;

  // Dapatkan tahun akademik dan semester saat ini
  const currentAcademicYear = getCurrentAcademicYear();
  const currentSemester = getCurrentSemester();

  await db.promise().beginTransaction();

  try {
    // Validasi: Periksa apakah user_id dan course_id ada
    const userIds = [...new Set(userCourses.map((course) => course.user_id))];
    const courseIds = [
      ...new Set(userCourses.map((course) => course.course_id)),
    ];

    const [usersResult] = await db
      .promise()
      .query("SELECT id FROM users WHERE id IN (?) AND role = ?", [
        userIds,
        "student",
      ]);
    const [coursesResult] = await db
      .promise()
      .query("SELECT id FROM courses WHERE id IN (?)", [courseIds]);

    const validUserIds = new Set(usersResult.map((user) => user.id));
    const validCourseIds = new Set(coursesResult.map((course) => course.id));

    // Periksa apakah ada user_id atau course_id yang tidak valid
    const invalidUsers = userIds.filter((id) => !validUserIds.has(id));
    const invalidCourses = courseIds.filter((id) => !validCourseIds.has(id));

    if (invalidUsers.length > 0 || invalidCourses.length > 0) {
      await db.promise().rollback();
      return res.status(400).json({
        error: "Invalid user_id or course_id",
        data: {
          invalidUsers,
          invalidCourses,
        },
      });
    }

    // Validasi: Periksa duplikasi
    const validationPromises = userCourses.map((course) => {
      const { user_id, course_id } = course;
      return db
        .promise()
        .query(
          "SELECT 1 FROM user_courses WHERE user_id = ? AND course_id = ? AND academic_year = ? AND semester = ?",
          [user_id, course_id, currentAcademicYear, currentSemester]
        )
        .then(([rows]) => rows.length > 0); // Jika ada data, kembalikan true
    });

    // Tunggu semua validasi selesai
    const validationResults = await Promise.all(validationPromises);

    // Jika ada duplikasi, batalkan proses
    if (validationResults.some((isDuplicate) => isDuplicate)) {
      await db.promise().rollback();
      return res.status(400).json({
        error: "Duplicate entry found. Operation aborted.",
      });
    }

    // Jika tidak ada masalah, lakukan penyisipan data
    const insertPromises = userCourses.map((course) => {
      const { user_id, course_id } = course;
      return db
        .promise()
        .query(
          "INSERT INTO user_courses (user_id, course_id, academic_year, semester) VALUES (?, ?, ?, ?)",
          [user_id, course_id, currentAcademicYear, currentSemester]
        );
    });

    // Eksekusi semua query secara paralel
    await Promise.all(insertPromises);

    await db.promise().commit();
    res.status(201).json({
      message: "Data created successfully",
    });
  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserCourses = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const userCourses = req.body;

  // Dapatkan tahun akademik dan semester saat ini
  const currentAcademicYear = getCurrentAcademicYear();
  const currentSemester = getCurrentSemester();

  await db.promise().beginTransaction();

  try {
    // Hapus semua data user_courses berdasarkan course_id
    await db
      .promise()
      .query("DELETE FROM user_courses WHERE course_id = ?", [id]);

    // Validasi: Periksa apakah user_id dan course_id ada
    const userIds = [...new Set(userCourses.map((course) => course.user_id))];
    const courseIds = [
      ...new Set(userCourses.map((course) => course.course_id)),
    ];

    const [usersResult] = await db
      .promise()
      .query("SELECT id FROM users WHERE id IN (?) AND role = ?", [
        userIds,
        "student",
      ]);
    const [coursesResult] = await db
      .promise()
      .query("SELECT id FROM courses WHERE id IN (?)", [courseIds]);

    const validUserIds = new Set(usersResult.map((user) => user.id));
    const validCourseIds = new Set(coursesResult.map((course) => course.id));

    // Periksa apakah ada user_id atau course_id yang tidak valid
    const invalidUsers = userIds.filter((id) => !validUserIds.has(id));
    const invalidCourses = courseIds.filter((id) => !validCourseIds.has(id));

    if (invalidUsers.length > 0 || invalidCourses.length > 0) {
      await db.promise().rollback();
      return res.status(400).json({
        error: "Invalid user_id or course_id",
        data: {
          invalidUsers,
          invalidCourses,
        },
      });
    }

    // Validasi: Periksa duplikasi
    const validationPromises = userCourses.map((course) => {
      const { user_id, course_id } = course;
      return db
        .promise()
        .query(
          "SELECT 1 FROM user_courses WHERE user_id = ? AND course_id = ? AND academic_year = ? AND semester = ?",
          [user_id, course_id, currentAcademicYear, currentSemester]
        )
        .then(([rows]) => rows.length > 0); // Jika ada data, kembalikan true
    });

    // Tunggu semua validasi selesai
    const validationResults = await Promise.all(validationPromises);

    // Jika ada duplikasi, batalkan proses
    if (validationResults.some((isDuplicate) => isDuplicate)) {
      await db.promise().rollback();
      return res.status(400).json({
        error: "Duplicate entry found. Operation aborted.",
      });
    }

    // Jika tidak ada masalah, lakukan penyisipan data
    const insertPromises = userCourses.map((course) => {
      const { user_id, course_id } = course;
      return db
        .promise()
        .query(
          "INSERT INTO user_courses (user_id, course_id, academic_year, semester) VALUES (?, ?, ?, ?)",
          [user_id, course_id, currentAcademicYear, currentSemester]
        );
    });

    // Eksekusi semua query secara paralel
    await Promise.all(insertPromises);

    await db.promise().commit();
    res.status(200).json({
      message: "Data updated successfully",
    });
  } catch (error) {
    await db.promise().rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserCourse = async (req, res) => {
  try {
    const [result] = await db
      .promise()
      .query("DELETE FROM user_courses WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Data not found" });

    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
