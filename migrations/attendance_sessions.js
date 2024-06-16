const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
      CREATE TABLE attendance_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        qr_id INT NOT NULL,
        session_date DATETIME NOT NULL,
        location_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );  
    `
    )
    .then(() => {
      console.log('Table "attendance_sessions" created successfully');
    })
    .catch((error) => {
      console.log('Table "attendance_sessions" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS attendance_sessions
      `
    )
    .then(() => {
      console.log('Table "attendance_sessions" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "attendance_sessions" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
