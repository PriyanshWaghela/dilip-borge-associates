// backend/config.js
const path = require('path');
module.exports = {
  DB_PATH: process.env.DB_PATH || path.join(__dirname, 'data', 'db.sqlite'),
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(__dirname, 'uploads'),
};
