const express = require("express");
const auth = require("./auth");
const router = express.Router();
const verifikasi = require("./verifikasi");
const controller = require("../controller");
const { upload } = require("./uploadfotomahasiswa");
const { uploadAdmin } = require("./uploadfotoadmin");
const { uploadDosen } = require("./uploadfotodosen");
const { uploadMakul } = require("./uploadfotomatakuliah");

router.post("/api/v1/register", auth.registrasi);
router.post("/api/v1/logindosen", auth.logindosen);
router.post("/api/v1/loginadmin", auth.loginadmin);
router.post("/api/v1/loginmahasiswa", auth.loginmahasiswa);
router.get("/api/v1/index", controller.index);

//halaman otorisasi
router.get(
  "/api/v1/mahasiswa",
  verifikasi([1]),
  controller.getalldatamahasiswa
);
router.get(
  "/api/v1/mahasiswabyid/:id",
  verifikasi([1, 3]),
  controller.getdatamahasiswabyid
);
router.post(
  "/api/v1/tambahmahasiswa",
  verifikasi([1]),
  upload.single("foto"),
  controller.tambahdatamahasiswa
);
router.put(
  "/api/v1/ubahdatamahasiswa/:id",
  verifikasi([1]),
  upload.single("foto"),
  controller.ubahdatamahasiswa
);
router.delete(
  "/api/v1/hapusdatamahasiswa/:id",
  verifikasi([1]),
  controller.hapusdatamahasiswa
);

// Admin
router.get("/api/v1/admin", verifikasi([1]), controller.getalldataadmin);
router.get("/api/v1/adminbyid/:id", verifikasi([1]), controller.getadminbyid);
router.post(
  "/api/v1/tambahdataadmin",
  verifikasi([1]),
  uploadAdmin.single("foto"),
  controller.tambahdataadmin
);
router.put(
  "/api/v1/ubahdataadmin/:id",
  verifikasi([1]),
  uploadAdmin.single("foto"),
  controller.ubahdataadmin
);
router.delete(
  "/api/v1/hapusdataadmin/:id",
  verifikasi([1]),
  controller.hapusdatamaadmin
);

// Dosen
router.get("/api/v1/dosen", verifikasi([1]), controller.getalldatadosen);
router.get(
  "/api/v1/dosenbyid/:id",
  verifikasi([1, 2]),
  controller.getdatadosenbyid
);
router.post(
  "/api/v1/tambahdatadosen",
  verifikasi([1]),
  uploadDosen.single("foto"),
  controller.tambahdatadosen
);
router.put(
  "/api/v1/ubahdatadosen/:id",
  verifikasi([1]),
  uploadDosen.single("foto"),
  controller.ubahdatadosen
);
router.delete(
  "/api/v1/hapusdatadosen/:id",
  verifikasi([1]),
  controller.hapusdatadosen
);

// Matakuliah
router.get(
  "/api/v1/matakuliah",
  verifikasi([1, 2, 3]),
  controller.getalldatamatakuliah
);
router.get(
  "/api/v1/matakuliahbyid/:id",
  verifikasi([1, 2, 3]),
  controller.getdatamatakuliahbyid
);
router.post(
  "/api/v1/tambahmatakuliah",
  verifikasi([1]),
  uploadMakul.single("foto"),
  controller.tambahdatamatakuliah
);
router.put(
  "/api/v1/ubahmatakuliah/:id",
  verifikasi([1]),
  uploadMakul.single("foto"),
  controller.ubahdatamatakuliah
);
router.delete(
  "/api/v1/hapusmatakuliah/:id",
  verifikasi([1]),
  controller.hapusdatamatakuliah
);
// Ruangan
router.get(
  "/api/v1/ruangan",
  verifikasi([1, 2, 3]),
  controller.getalldataruangan
);
router.get(
  "/api/v1/ruanganbyid/:id",
  verifikasi([1, 2, 3]),
  controller.getdataruanganbyid
);
router.post(
  "/api/v1/tambahruangan",
  verifikasi([1]),
  controller.tambahdataruangan
);
router.put(
  "/api/v1/ubahruangan/:id",
  verifikasi([1]),
  controller.ubahdataruangan
);
router.delete(
  "/api/v1/hapusruangan/:id",
  verifikasi([1]),
  controller.hapusruangan
);

// Kelas
router.get("/api/v1/kelas", verifikasi([1, 2, 3]), controller.getalldatakelas);
router.get(
  "/api/v1/kelasbyid/:id",
  verifikasi([1, 2, 3]),
  controller.getdatakelasbyid
);
router.post("/api/v1/tambahkelas", verifikasi([1]), controller.tambahdatakelas);
router.put("/api/v1/ubahkelas/:id", verifikasi([1]), controller.ubahdatakelas);
router.delete("/api/v1/hapuskelas/:id", verifikasi([1]), controller.hapuskelas);

// Jadwal
router.get(
  "/api/v1/jadwal",
  verifikasi([1, 2, 3]),
  controller.getalldatajadwal
);
router.get(
  "/api/v1/jadwalbyid/:id",
  verifikasi([1]),
  controller.getdatajadwalbyid
);
router.get(
  "/api/v1/jadwalmahasiswa",
  verifikasi([1]),
  controller.getalldatajadwalmahasiswa
);
router.get(
  "/api/v1/jadwalmahasiswabyidmahasiswa/:id",
  verifikasi([1, 3]),
  controller.getdatajadwalmahasiswabyidmahasiswa
);
router.post(
  "/api/v1/tambahjadwal",
  verifikasi([1]),
  controller.tambahdatajadwal
);
router.put(
  "/api/v1/ubahjadwal/:id",
  verifikasi([1]),
  controller.ubahdatajadwal
);
router.delete(
  "/api/v1/hapusjadwal/:id",
  verifikasi([1]),
  controller.hapusjadwal
);

// Presensi
router.get(
  "/api/v1/presensi",
  verifikasi([1, 2, 3]),
  controller.getalldatapresensi
);
router.get(
  "/api/v1/presensibyid/:id",
  verifikasi([1]),
  controller.getpresensibyid
);
router.get(
  "/api/v1/presensimahasiswa",
  verifikasi([1]),
  controller.getalldatapresensimahasiswa
);
router.get(
  "/api/v1/presensibyidmahasiwa/:id",
  verifikasi([1, 3]),
  controller.getdatapresensimahasiswabyidmahasiswa
);
router.get(
  "/api/v1/presensibyiddosen/:id",
  verifikasi([1, 3]),
  controller.getdatapresensimahasiswabyiddosen
);
router.post(
  "/api/v1/tambahpresensi",
  verifikasi([1]),
  controller.tambahdatapresensi
);
router.put(
  "/api/v1/ubahpresensi/:id",
  verifikasi([1]),
  controller.ubahdatapresensi
);
router.delete(
  "/api/v1/hapuspresensi/:id",
  verifikasi([1]),
  controller.hapuspresensi
);

module.exports = router;
