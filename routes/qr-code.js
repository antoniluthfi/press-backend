const express = require("express");
const router = express.Router();
const qrCodeController = require("../controllers/qr-code");
const { qrCodeValidator } = require("../middleware/qrcode");

// Rute untuk mendapatkan semua qr code
router.get("/", qrCodeController.getAllQrCodes);

// Rute untuk generate qr code baru
router.post(
  "/generate",
  qrCodeValidator,
  qrCodeController.generateQrCode
);

// Rute untuk refresh qr code
router.put("/refresh/:id", qrCodeController.refreshQrCode);

// Rute untuk hapus qr code
router.delete("/:id", qrCodeController.deleteQrCode);

module.exports = router;
