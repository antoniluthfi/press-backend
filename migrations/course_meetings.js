const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
      CREATE TABLE course_meetings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT,
        meeting_number INT,
        date DATE,
        start_time TIME,
        end_time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ); 
    `
    )
    .then(() => {
      console.log('Table "course_meetings" created successfully');
    })
    .catch((error) => {
      console.log('Table "course_meetings" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS course_meetings
      `
    )
    .then(() => {
      console.log('Table "course_meetings" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "course_meetings" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
