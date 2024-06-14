var db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const secretKey = "YoYo";
// Function to generate a PDF using Puppeteer
const generatePDF = async (user) => {
  // Launch Puppeteer with a custom temporary directory
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: path.join(__dirname, 'tmp')  // Custom path for temporary files
  });
  
  const page = await browser.newPage();
  const content = `<html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background: #4CAF50;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
          }
          .footer {
            background: #f9f9f9;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Platform!</h1>
          </div>
          <div class="content">
            <p>Hello ${user.firstName} ${user.lastName},</p>
            <p>Thank you for registering on our platform. We are excited to have you on board!</p>
            <p>Your registered email is: ${user.email}</p>
            <p>If you have any questions, feel free to contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>`;

  await page.setContent(content);
  const pdfPath = path.join(__dirname, `./pdfs/${user.firstName}.pdf`);
  await page.pdf({ path: pdfPath, format: "A4" });
  await browser.close();  // Ensure the browser instance is closed properly

  return pdfPath;
};

// Set up Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',  // Changed 'host' to 'service' for Gmail
  auth: {
    user: 'ihspvt@gmail.com',
    pass: 'keag dsci hppo vwto',
  },
});

// Register user function
var registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    var data = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      phoneNumber: phoneNumber,
    });

    const pdfPath = await generatePDF(data);  // Generate PDF for the new user

    let mailOptions = {
      from: 'ihspvt@gmail.com',
      to: email,
      subject: 'Welcome to our Ecom website',
      html: `
        <html>
          <head>
            <style>
              /* Internal CSS styles */
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f2f2f2;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 10px;
                text-align: center;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
              .content {
                padding: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #888888;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Our Platform</h1>
              </div>
              <div class="content">
                <p>Hello ${firstName} ${lastName},</p>
                <p>Welcome to our platform! You have successfully registered :)</p>
              </div>
              <div class="footer">
                <p>If you have any questions, please contact us at dontcontactus@lol.com.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: 'welcome.pdf',
          path: pdfPath,
        },
      ],
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    res.status(201).send({
      message: "User created",
      data: data,
      info: info,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

var loginUser = async (req, res) => {
  try {
    var { login_email, login_password } = req.body;
    var data = await User.findOne({
      where: {
        email: login_email,
      },
    });
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(login_password, data.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    jwt.sign({ data }, secretKey, { expiresIn: "600s" }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Error generating token" });
      }
      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
