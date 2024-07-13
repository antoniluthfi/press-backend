const express = require("express");
const router = express.Router();
const qrCodeController = require("../controllers/qr-code");

// Rute untuk mendapatkan semua qr code
router.get("/", qrCodeController.getAllQrCodes);

// Rute untuk refresh qr code baru
router.post("/refresh/:id", qrCodeController.refreshQrCode);

module.exports = router;
