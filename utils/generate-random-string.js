const crypto = require("crypto");

exports.generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex");
};
