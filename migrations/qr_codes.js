const db = require("../config/db");

const up = () => {
  db.promise()
    .query(
      `
        CREATE TABLE qr_codes (
          qr_id INT AUTO_INCREMENT PRIMARY KEY,
          qr_code VARCHAR(255) NOT NULL,
          session_id INT NOT NULL,
          creation_time DATETIME NOT NULL,
          expiration_time DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );    
      `
    )
    .then(() => {
      console.log('Table "qr_codes" created successfully');
    })
    .catch((error) => {
      console.log('Table "qr_codes" failed to create');
      console.error(error);
    });
};

const down = () => {
  db.promise()
    .query(
      `
        DROP TABLE IF EXISTS qr_codes
      `
    )
    .then(() => {
      console.log('Table "qr_codes" dropped successfully');
    })
    .catch((error) => {
      console.log('Table "qr_codes" failed to dropped');
      console.error(error);
    });
};

module.exports = {
  up,
  down,
};
