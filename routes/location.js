const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location");
const {
  locationValidator,
  locationIdValidator,
} = require("../middleware/location");

// Rute untuk mendapatkan semua location
router.get("/", locationController.getAllLocations);

// Rute untuk mendapatkan location berdasarkan ID
router.get("/:id", locationIdValidator, locationController.getLocationById);

// Rute untuk membuat location baru
router.post("/", locationValidator, locationController.createLocation);

// Rute untuk mengupdate location
router.put("/:id", locationValidator, locationController.updateLocation);

// Rute untuk menghapus location
router.delete("/:id", locationIdValidator, locationController.deleteLocation);

module.exports = router;
