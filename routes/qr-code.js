const express = require("express");
const router = express.Router();
const qrCodeController = require("../controllers/qr-code");
const { verifyToken } = require("../middleware/auth");
const { qrCodeValidator } = require("../middleware/qrcode");

// Rute untuk mendapatkan semua qr code
router.get("/", verifyToken, qrCodeController.getAllQrCodes);

// Rute untuk generate qr code baru
router.post(
  "/generate",
  verifyToken,
  qrCodeValidator,
  qrCodeController.generateQrCode
);

// Rute untuk refresh qr code
router.put("/refresh/:id", verifyToken, qrCodeController.refreshQrCode);

module.exports = router;
