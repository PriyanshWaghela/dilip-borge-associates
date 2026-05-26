// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { JWT_SECRET } = require('../config');

// Simple email‑only login – creates or finds a user and returns a JWT
router.post('/login', async (req, res, next) => {
  try {
    const { email, role = 'admin' } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    let user = db.getUserByEmail(email);
    if (!user) {
      user = db.createUser(email, role);
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

// Verify token and return user info
router.get('/me', (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(payload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
