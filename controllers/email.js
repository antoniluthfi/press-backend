const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express(express);

const emailTemplateFolder = path.join(__dirname, "../email-templates");
app.use(express.static(emailTemplateFolder));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.PASSWORD_EMAIL_SENDER,
  },
});

exports.sendUserLoginCredentialEmail = ({ emailDestination, password }) => {
  try {
    const emailTemplatePath = path.join(
      emailTemplateFolder,
      "new-user/index.html"
    );
    const newUserTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: emailDestination,
      subject: "Welcome to SiPres",
      html: newUserTemplate
        .replace("{{email}}", emailDestination)
        .replace("{{password}}", password),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log("sendUserLoginCredentialEmail", error);
  }
};
