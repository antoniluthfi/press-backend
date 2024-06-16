const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        gender ENUM('male', 'female') NOT NULL,
        role ENUM('student', 'lecturer') NOT NULL,
        identification_number VARCHAR(30) NOT NULL,
        address TEXT NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        profile_url TEXT,
        status ENUM('active', 'inactive') NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );  
    `
    )
    .then(() => {
      console.log('Table "users" created successfully');
    })
    .catch((error) => {
      console.log('Table "users" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS users
      `
    )
    .then(() => {
      console.log('Table "users" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "users" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
