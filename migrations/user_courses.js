const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
      CREATE TABLE user_courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        academic_year VARCHAR(10) NOT NULL,
        semester ENUM('odd', 'even') NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );  
    `
    )
    .then(() => {
      console.log('Table "user_courses" created successfully');
    })
    .catch((error) => {
      console.log('Table "user_courses" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS user_courses
      `
    )
    .then(() => {
      console.log('Table "user_courses" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "user_courses" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
