const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './foto_matakuliah');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});

const uploadMakul = multer({ storage: storage });

module.exports = { uploadMakul };
