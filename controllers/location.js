const db = require("../config/db");
const { validationResult } = require("express-validator");

exports.getAllLocations = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM locations");

    res.json({
      message: "Data retrieved successfuly",
      data: rows,
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
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, latitude, longitude, radius } = req.body;
  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO locations (name, latitude, longitude, radius) VALUES (?, ?, ?, ?)",
        [name, latitude, longitude, radius]
      );

    res.status(201).json({
      id: result.insertId,
      message: "Location created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, latitude, longitude, radius } = req.body;
  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE locations SET name = ?, latitude = ?, longitude = ?, radius = ? WHERE id = ?",
        [name, latitude, longitude, radius, req.params.id]
      );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Location not found" });

    res.json({ message: "Location updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    // Cek lokasi pada data lain
    const [rowsSession] = await db
      .promise()
      .query("SELECT id FROM attendance_sessions WHERE location_id = ?", [
        req.params.id,
      ]);

    if (rowsSession.length) {
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
