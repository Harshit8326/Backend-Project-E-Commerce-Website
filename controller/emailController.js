const nodemailer = require("nodemailer");
const db = require("../models");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: "ihspvt@gmail.com",
      pass: "keag dsci hppo vwto",
  },
});

let mailOptions = {
  from: "ihspvt@gmail.com",
  to: "jenish.digiwagon@gmail.com",
  subject: "Sending Email using Node.js",
  text: "Hello from Node.js!",
};

var sendEmail = async (req, res) => {
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.json({
      message: "Email sent successfully",
      info: info,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = {
  sendEmail,
};
