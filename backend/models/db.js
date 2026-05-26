// backend/models/db.js
// In-memory stub database to avoid native SQLite dependency.
// Provides minimal API used by the application.

const bookings = [];
const inquiries = [];
const users = [];

const db = {
  exec: () => {},
  prepare: (stmt) => {
    // Very simple parsing based on statement prefix
    if (stmt.startsWith('INSERT INTO bookings')) {
      return {
        run: (name, service, date, slot, type) => {
          const id = bookings.length + 1;
          const created_at = new Date().toISOString();
          bookings.push({ id, name, service, date, slot, type, created_at });
          return { lastInsertRowid: id };
        },
      };
    }
    if (stmt.startsWith('SELECT * FROM bookings')) {
      return {
        all: () => bookings.slice().reverse(),
      };
    }
    if (stmt.startsWith('INSERT INTO inquiries')) {
      return {
        run: (name, email, phone, service, message) => {
          const id = inquiries.length + 1;
          const created_at = new Date().toISOString();
          inquiries.push({ id, name, email, phone, service, message, created_at });
          return { lastInsertRowid: id };
        },
      };
    }
    if (stmt.startsWith('INSERT INTO users')) {
      return {
        run: (email) => {
          const id = users.length + 1;
          const created_at = new Date().toISOString();
          const user = { id, email, role: 'admin', created_at };
          users.push(user);
          return { lastInsertRowid: id };
        },
      };
    }
    if (stmt.startsWith('SELECT * FROM users')) {
      return {
        get: (email) => users.find((u) => u.email === email),
      };
    }
    // Default stub
    return {
      run: () => ({ lastInsertRowid: 1 }),
      get: () => null,
      all: () => [],
    };
  },
};

module.exports = {
  db,
  createBooking: (data) => {
    const stmt = db.prepare(`INSERT INTO bookings (name, service, date, slot, type) VALUES (?, ?, ?, ?, ?)`);
    const info = stmt.run(data.name, data.service, data.date, data.slot, data.type);
    return { id: info.lastInsertRowid, ...data, created_at: new Date().toISOString() };
  },
  getBookings: () => {
    return db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  },
  createInquiry: (data) => {
    const stmt = db.prepare(`INSERT INTO inquiries (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)`);
    const info = stmt.run(data.name, data.email, data.phone, data.service, data.message);
    return { id: info.lastInsertRowid, ...data, created_at: new Date().toISOString() };
  },
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
