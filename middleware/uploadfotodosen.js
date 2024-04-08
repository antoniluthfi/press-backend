
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './foto_dosen');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadDosen = multer({ storage: storage });

module.exports = { uploadDosen };
