const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
      CREATE TABLE attendance_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT,
        session_date DATETIME NOT NULL,
        qr_code VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        radius INT NOT NULL,
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
