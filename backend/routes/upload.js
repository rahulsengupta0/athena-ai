const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload');

// Upload endpoint
router.post('/api/upload', uploadMiddleware.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Send back the file URL
  res.json({ fileUrl: req.file.location });
});

module.exports = router;
