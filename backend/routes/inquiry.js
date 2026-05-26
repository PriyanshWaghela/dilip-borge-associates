const express = require('express');
const router = express.Router();

// Simple placeholder route for inquiries
router.get('/', (req, res) => {
  res.json({ message: 'Inquiry endpoint is operational.' });
});

module.exports = router;
