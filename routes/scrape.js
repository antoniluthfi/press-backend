const express = require("express");
const router = express.Router();
const scrapeController = require("../controllers/scrape");

// Rute untuk mendapatkan semua pengumuman terbaru
router.get("/latest-announcement", scrapeController.getLatestAnnouncement);

module.exports = router;
