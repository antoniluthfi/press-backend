const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

// Register (untuk membuat user mahasiswa baru)
exports.register = async (req, res) => {
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
    password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (name, email, gender, role, identification_number, address, phone_number, profile_url, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          email,
          gender,
          "student",
          identification_number,
          address,
          phone_number,
          profile_url,
          "active",
          hashedPassword,
        ]
      );

    res
      .status(201)
      .json({ user_id: result.insertId, message: "Berhasil mendaftar" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    // Update tokens in the database
    await db
      .promise()
      .query("UPDATE users SET token = ?, refresh_token = ? WHERE id = ?", [
        token,
        refreshToken,
        user.id,
      ]);

    res.json({ token, refresh_token: refreshToken, message: "Berhasil masuk" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to authenticate token" });
        }

        const [rows] = await db
          .promise()
          .query("SELECT * FROM users WHERE id = ? AND refresh_token = ?", [
            decoded.user_id,
            refresh_token,
          ]);

        if (rows.length === 0) {
          return res.status(401).json({ error: "Invalid refresh token" });
        }

        const user = rows[0];
        const newAccessToken = jwt.sign(
          { user_id: user.id, role: user.role },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );

        const newRefreshToken = jwt.sign(
          { user_id: user.id, role: user.role },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "2h",
          }
        );

        // Update tokens in the database
        await db
          .promise()
          .query("UPDATE users SET token = ?, refresh_token = ? WHERE id = ?", [
            newAccessToken,
            newRefreshToken,
            user.id,
          ]);

        res.json({
          token: newAccessToken,
          refresh_token: newRefreshToken,
          message: "Token refreshed",
        });
      }
    );
  } catch (error) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};
