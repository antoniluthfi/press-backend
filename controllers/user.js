const db = require("../config/db");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { generateRandomString } = require("../utils/generate-random-string");
const { sendUserLoginCredentialEmail } = require("./email");

exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 5, search = "", role } = req.query; // Mengambil query params

  const offset = (page - 1) * limit; // Menghitung offset untuk pagination

  try {
    // Menyiapkan query dengan pagination dan search
    const [rows] = await db.promise().query(
      `SELECT id, name, email, role, gender, identification_number, address, phone_number, profile_url, status FROM users 
         WHERE role = ? 
         AND (name LIKE ? OR email LIKE ?)
         LIMIT ? OFFSET ?`,
      [role, `%${search}%`, `%${search}%`, Number(limit), Number(offset)]
    );

    // Mengambil total data untuk keperluan pagination
    const [totalRows] = await db.promise().query(
      `SELECT COUNT(*) AS total 
         FROM users 
         WHERE role = ? 
         AND (name LIKE ? OR email LIKE ?)`,
      [role, `%${search}%`, `%${search}%`]
    );
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

exports.getUserById = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Data retrieved successfuly",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNewUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      email,
      gender,
      role,
      identification_number,
      address,
      phone_number,
      profile_url,
    } = req.body;

    const password = generateRandomString(8); // Panjang string random
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (name, email, gender, role, identification_number, address, phone_number, profile_url, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          email,
          gender,
          role,
          identification_number,
          address,
          phone_number,
          profile_url,
          "active",
          hashedPassword,
        ]
      );

    if (result.affectedRows > 0) {
      sendUserLoginCredentialEmail({ emailDestination: email, password });

      res.status(201).json({
        id: result.insertId,
        message: "User created successfully",
      });
    }

    res.status(400).json({
      message: "",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    gender,
    identification_number,
    address,
    phone_number,
    profile_url,
    status,
  } = req.body;

  try {
    const [user] = await db
      .promise()
      .query(
        "UPDATE users SET name = ?, email = ?, gender = ?, identification_number = ?, address = ?, phone_number = ?, profile_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [
          name,
          email,
          gender,
          identification_number,
          address,
          phone_number,
          profile_url,
          status,
          req.params.id,
        ]
      );
    if (user.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Cek user pada data attendance_records
    const [rowsUser1] = await db
      .promise()
      .query("SELECT id FROM attendance_records WHERE student_id = ?", [
        req.params.id,
      ]);

    if (rowsUser1.length) {
      return res
        .status(400)
        .json({ message: "User has been used in other data" });
    }

    // Cek user pada data courses
    const [rowsUser2] = await db
      .promise()
      .query("SELECT id FROM courses WHERE lecturer_id = ?", [req.params.id]);

    if (rowsUser2.length) {
      return res
        .status(400)
        .json({ message: "User has been used in other data" });
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
