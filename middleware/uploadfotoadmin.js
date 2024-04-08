
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './foto_admin');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadAdmin = multer({ storage: storage });

module.exports = { uploadAdmin };
