const db = require("../config/db");
const { validationResult } = require("express-validator");

// Mendapatkan semua course
exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM courses");

    res.json({
      message: "Data retrieved successfuly",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan course berdasarkan ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query("SELECT * FROM courses WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      message: "Data retrieved successfuly",
      data: rows[0],
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

  const { course_name, course_code, lecturer_id } = req.body;
  try {
    const [result] = await db.promise().query(
      "INSERT INTO courses (course_name, course_code, lecturer_id) VALUES (?, ?, ?)",
      [course_name, course_code, lecturer_id]
    );
    
    res.status(201).json({
      id: result.insertId,
      message: "Course created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mengupdate course
exports.updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { course_name, course_code, lecturer_id } = req.body;
  try {
    const [result] = await db.promise().query(
      "UPDATE courses SET course_name = ?, course_code = ?, lecturer_id = ? WHERE id = ?",
      [course_name, course_code, lecturer_id, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.promise().query("DELETE FROM courses WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
