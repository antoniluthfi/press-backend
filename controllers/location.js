const db = require("../config/db");
const { validationResult } = require("express-validator");
const removeFile = require("../utils/remove-file");

exports.getAllLocations = async (req, res) => {
  try {
    // Ambil query parameter dari request
    const { page = 1, limit = 10, search = "" } = req.query;

    // Validasi input page dan limit
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Query database dengan filter search dan pagination
    const query = `
      SELECT * 
      FROM locations 
      WHERE name LIKE ? 
      LIMIT ? OFFSET ?
    `;

    const searchValue = `%${search}%`;

    // Eksekusi query
    const [rows] = await db
      .promise()
      .query(query, [searchValue, limitNumber, offset]);

    // Query untuk menghitung total data (untuk pagination)
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM locations 
      WHERE name LIKE ?
    `;

    const [[{ total }]] = await db.promise().query(countQuery, [searchValue]);

    // Menghitung total halaman
    const totalPages = Math.ceil(total / limitNumber);

    // Mengirimkan response
    res.json({
      message: "Data retrieved successfully",
      data: rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalItems: total,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM locations WHERE id = ?", [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Location not found" });

    res.json({
      message: "Data retrieved successfuly",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    removeFile(req.file?.path);
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, latitude, longitude, radius } = req.body;
  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO locations (name, latitude, longitude, radius, file_path) VALUES (?, ?, ?, ?, ?)",
        [name, latitude, longitude, radius, req.file?.path]
      );

    res.status(201).json({
      id: result.insertId,
      message: "Location created successfully",
    });
  } catch (error) {
    removeFile(req.file?.path);
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    removeFile(req.file?.path);
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, latitude, longitude, radius } = req.body;
  const locationId = req.params.id;

  try {
    // Cari data berdasarkan ID untuk mendapatkan file path lama
    const [locationRows] = await db
      .promise()
      .query("SELECT file_path FROM locations WHERE id = ?", [locationId]);

    if (locationRows.length === 0) {
      removeFile(req.file?.path);
      return res.status(404).json({ error: "Location not found" });
    }

    // Gunakan file path lama jika tidak ada file baru yang diunggah
    let filePath = req.file?.path || locationRows[0].file_path;

    const [result] = await db
      .promise()
      .query(
        "UPDATE locations SET name = ?, latitude = ?, longitude = ?, radius = ?, file_path = ? WHERE id = ?",
        [name, latitude, longitude, radius, filePath, locationId]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Hapus file lama jika file baru diunggah
    if (req.file?.path && locationRows[0].file_path) {
      removeFile(locationRows[0].file_path);
    }

    res.json({ message: "Location updated successfully" });
  } catch (error) {
    removeFile(req.file?.path);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    // Cek lokasi pada data lain
    const [rowsCourse] = await db
      .promise()
      .query("SELECT id FROM courses WHERE location_id = ?", [req.params.id]);

    if (rowsCourse.length) {
      return res
        .status(400)
        .json({ message: "Location has been used in other data" });
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM locations WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Location not found" });

    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
