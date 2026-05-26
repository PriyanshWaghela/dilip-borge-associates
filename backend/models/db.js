// backend/models/db.js
const Database = require('better-sqlite3');
const { DB_PATH } = require('../config');
const path = require('path');
const fs = require('fs');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialise tables if they don't exist
const init = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      slot TEXT NOT NULL,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

init();

module.exports = {
  db,
  // Booking helpers
  createBooking: (data) => {
    const stmt = db.prepare(`INSERT INTO bookings (name, service, date, slot, type) VALUES (?, ?, ?, ?, ?)`);
    const info = stmt.run(data.name, data.service, data.date, data.slot, data.type);
    return { id: info.lastInsertRowid, ...data, created_at: new Date().toISOString() };
  },
  getBookings: () => {
    return db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  },
  // Inquiry helpers
  createInquiry: (data) => {
    const stmt = db.prepare(`INSERT INTO inquiries (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)`);
    const info = stmt.run(data.name, data.email, data.phone, data.service, data.message);
    return { id: info.lastInsertRowid, ...data, created_at: new Date().toISOString() };
  },
  // User helpers
  findOrCreateUser: (email) => {
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      const stmt = db.prepare('INSERT INTO users (email) VALUES (?)');
      const info = stmt.run(email);
      user = { id: info.lastInsertRowid, email, role: 'admin', created_at: new Date().toISOString() };
    }
    return user;
  },
};
