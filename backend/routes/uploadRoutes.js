/* eslint-disable */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const uploadMiddleware = require('../middlewares/upload');
const UserFile = require('../model/UserFile');
const s3 = require('../utils/s3');

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

// Delete a user's uploaded file
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const fileDoc = await UserFile.findOne({ _id: req.params.id, user: req.user.id });
    if (!fileDoc) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Try to resolve bucket from env, fallback to URL parsing
    let Bucket = process.env.AWS_S3_BUCKET;
    const Key = fileDoc.key;

    if (!Bucket && fileDoc.url) {
      try {
        const u = new URL(fileDoc.url);
        // Expect formats like: https://<bucket>.s3.<region>.amazonaws.com/<key>
        const host = u.hostname; // e.g., bucket.s3.us-east-1.amazonaws.com
        Bucket = host.split('.s3')[0];
      } catch (e) {
        // ignore parse errors, will attempt delete without bucket (will fail clearly)
      }
    }

    if (!Bucket || !Key) {
      return res.status(500).json({ message: 'S3 configuration missing' });
    }

    await s3.deleteObject({ Bucket, Key }).promise();
    await fileDoc.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete file error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
