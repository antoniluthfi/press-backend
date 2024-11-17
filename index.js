const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const path = require("path");
require("dotenv").config();

const app = express();

// Konfigurasi CORS
app.use(cors({
  credentials: true,
  origin: [
    process.env.CLIENT_WEB_URL,
    process.env.CLIENT_WEB_URL_2,
  ],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menggunakan cookie-parser untuk membaca cookie
app.use(cookieParser());

// Serve static files
app.use("/documents", express.static(path.join(__dirname, "documents")));

// API routes
app.use("/api", routes);

// Mengizinkan proxy jika diperlukan
app.set("trust proxy", true);

// Menjalankan server
app.listen(8000, () => {
  console.log("Server berjalan di port 8000");
});
