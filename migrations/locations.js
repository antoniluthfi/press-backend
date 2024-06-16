const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
      CREATE TABLE locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        radius INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );  
    `
    )
    .then(() => {
      console.log('Table "locations" created successfully');
    })
    .catch((error) => {
      console.log('Table "locations" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS locations
      `
    )
    .then(() => {
      console.log('Table "locations" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "locations" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
