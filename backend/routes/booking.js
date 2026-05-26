const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration from .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/bookings - receive booking data and email it
router.post('/', async (req, res) => {
  const { name, phone, service, date, time, type, files } = req.body;
  const emailTo = process.env.EMAIL_RECEIVER || process.env.EMAIL_USER;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailTo,
    subject: `New Appointment Booking: ${service}`,
    text: `Appointment Details:\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}\nType: ${type}\nAttachments: ${files} file(s)`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Appointment booked and email sent.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send appointment email.' });
  }
});

module.exports = router;
