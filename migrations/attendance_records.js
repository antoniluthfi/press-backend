const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
        CREATE TABLE attendance_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          session_id INT NOT NULL,
          student_id INT NOT NULL,
          attendance_time DATETIME NOT NULL,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `
    )
    .then(() => {
      console.log('Table "attendance_records" created successfully');
    })
    .catch((error) => {
      console.log('Table "attendance_records" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS attendance_records
      `
    )
    .then(() => {
      console.log('Table "attendance_records" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "attendance_records" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
