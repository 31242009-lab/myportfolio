const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('../frontend'));

// Nodemailer transporter using Gmail + App Password
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,           // STARTTLS
  secure: false,       // false for 587, true for 465
  auth: {
    user: process.env.EMAIL_USER,  // your Gmail
    pass: process.env.EMAIL_PASS   // Gmail App Password
  }
});

// Verify transporter
transporter.verify((err, success) => {
  if (err) console.error("Email transporter error:", err);
  else console.log("Email transporter is ready!");
});

// Route for sending emails
app.post('/send-email', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // must be Gmail
    replyTo: email,                                // replies go to the user
    to: process.env.EMAIL_USER,                    // your Gmail inbox
    subject: `${subject} (from ${name}, ${phone})`,
    text: message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.json({ success: true, message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "❌ Error sending email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




