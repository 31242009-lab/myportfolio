const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Serve frontend static files (adjust path if needed)
app.use(express.static('../frontend'));

// POST route to send email
app.post('/send-email', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const msg = {
    to: process.env.EMAIL_FROM,  // your inbox
    from: process.env.EMAIL_FROM, // verified sender
    subject: `${subject} (from ${name}, ${phone})`,
    text: message,
    replyTo: email
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent successfully!');
    res.json({ success: true, message: "✅ Message sent successfully!" });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, error: "❌ Error sending email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});





