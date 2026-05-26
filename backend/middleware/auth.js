// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // { id, email, role }
    next();
  });
}

module.exports = { verifyToken };
