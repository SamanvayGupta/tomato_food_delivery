const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors()); // Allow requests from your React app
app.use(express.json()); // Allow the server to parse JSON body

// Setup the email transporter using your credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// The API endpoint that your React app will call
app.post('/send-email', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for using Tomato over Zomato!',
    html: `
      <h3>Hi ${name},</h3>
      <p>Thank you for trying out the TOMATO assistant.</p>
      <p>We're glad to have you here instead of at Zomato! 😉</p>
      <br/>
      <p>Best,</p>
      <p>The TOMATO Team 🍅</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Something went wrong.');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});