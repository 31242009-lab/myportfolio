// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// API route for sending email
app.post("/contact"", async (req, res) => {
  const { name, phone, email, subject, message } = req.body;

  const msg = {
    to: process.env.RECEIVER_EMAIL, // 👈 Your email (where you want to receive messages)
    from: process.env.SENDER_EMAIL, // 👈 Verified sender in SendGrid
    subject: `Portfolio Contact: ${subject || "No Subject"}`,
    text: `
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      Message: ${message}
    `,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error("SendGrid Error:", error.response ? error.response.body : error);
    res.status(500).json({ success: false, error: "Email failed to send." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});






