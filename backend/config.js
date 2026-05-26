// backend/config.js
const path = require('path');
module.exports = {
  DB_PATH: process.env.DB_PATH || path.join(__dirname, 'data', 'db.sqlite'),
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(__dirname, 'uploads'),
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  APPOINTMENT_RECIPIENT: process.env.APPOINTMENT_RECIPIENT || '',
};
