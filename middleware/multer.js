const multer = require("multer");
const fs = require("fs");

const createStorage = (storageName) => {
  const destinationFolderPath = `documents/${storageName}`;

  if (!fs.existsSync(destinationFolderPath)) {
    fs.mkdirSync(destinationFolderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationFolderPath);
    },
    filename: function (req, file, cb) {
      const filenameSplit = file.originalname.split(".");
      const extension = filenameSplit[filenameSplit.length - 1];
      cb(null, `${Date.now()}-${storageName}.${extension}`);
    },
  });

  return storage;
};

const uploadUserProfileImage = multer({
  storage: createStorage("user-profiles"),
});

const uploadAttendanceRecordFile = multer({
  storage: createStorage("attendance-records"),
});

const uploadLocationImage = multer({
  storage: createStorage("locations"),
});

module.exports = {
  uploadUserProfileImage,
  uploadAttendanceRecordFile,
  uploadLocationImage,
};
