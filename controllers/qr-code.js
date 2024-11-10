const { validationResult } = require("express-validator");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { generateRandomString } = require("../utils/generate-random-string");

// Mendapatkan semua course
exports.getAllQrCodes = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM qr_codes");

    res.json({
      message: "Data retrieved successfuly",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate QR Code
exports.generateQrCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { course_meeting_id } = req.body;
  const expirationTime = new Date(Date.now() + 1 * 60000); // Menambahkan 1 menit dari waktu saat ini

  try {
    const randomString = generateRandomString(16); // Panjang string random
    const hashedQrCode = await bcrypt.hash(randomString, 10);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO qr_codes (qr_code, expiration_time, course_meeting_id) VALUES (?, ?, ?)",
        [hashedQrCode, expirationTime, course_meeting_id]
      );

    const [newRows] = await db
      .promise()
      .query("SELECT * FROM qr_codes WHERE id = ?", [result.insertId]);

    res.json({ message: "QR Code generated successfully", data: newRows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh QR Code
exports.refreshQrCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { qr_code } = req.body;
  const expirationTime = new Date(Date.now() + 1 * 60000); // Menambahkan 1 menit dari waktu saat ini

  try {
    // Ambil QR code yang ada dari database
    const [rows] = await db
      .promise()
      .query("SELECT qr_code FROM qr_codes WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "QR Code not found" });
    }

    const existingQrCode = rows[0].qr_code;

    // Validasi QR code baru dengan QR code yang ada
    if (existingQrCode !== qr_code) {
      return res.status(400).json({ message: "Invalid QR Code" });
    }

    const randomString = generateRandomString(16); // Panjang string random
    const hashedQrCode = await bcrypt.hash(randomString, 10);

    await db
      .promise()
      .query(
        "UPDATE qr_codes SET qr_code = ?, expiration_time = ? WHERE id = ?",
        [hashedQrCode, expirationTime, id]
      );

    const [newRows] = await db
      .promise()
      .query("SELECT * FROM qr_codes WHERE id = ?", [id]);

    res.json({ message: "QR Code updated successfully", data: newRows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hapus QR Code
exports.deleteQrCode = async (req, res) => {
  try {
    const [result] = await db
      .promise()
      .query("DELETE FROM qr_codes WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "QR code not found" });

    res.json({ message: "QR code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
