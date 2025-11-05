/* eslint-disable */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const uploadMiddleware = require('../middlewares/upload');
const UserFile = require('../model/UserFile');

// List current user's uploaded files
router.get('/', authMiddleware, async (req, res) => {
  try {
    const files = await UserFile.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', authMiddleware, uploadMiddleware.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Save metadata in MongoDB
  const fileDoc = new UserFile({
    user: req.user.id,
    url: req.file.location,
    key: req.file.key
  });
  await fileDoc.save();

  res.json({ fileUrl: req.file.location, fileId: fileDoc._id });
});

module.exports = router;
