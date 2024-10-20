require("dotenv").config();

exports.COOKIE_SETTINGS = {
  httpOnly: true,
  secure: process.env.MODE === "production",
  sameSite: "strict",
};
