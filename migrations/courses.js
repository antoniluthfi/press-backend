const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
      CREATE TABLE courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(100) NOT NULL,
        course_code VARCHAR(50) NOT NULL,
        lecturer_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );  
    `
    )
    .then(() => {
      console.log('Table "courses" created successfully');
    })
    .catch((error) => {
      console.log('Table "courses" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS courses
      `
    )
    .then(() => {
      console.log('Table "courses" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "courses" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
