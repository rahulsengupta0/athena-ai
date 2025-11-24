const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAdmin } = require('../middlewares/admin');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

// Initialize S3 Client with AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload thumbnail to S3
router.post('/upload-thumbnail', requireAdmin, upload.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No thumbnail file provided' });
    }

    const timestamp = Date.now();
    const key = `templates/thumbnails/${timestamp}-${req.file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);
    
    // Construct public URL
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    res.json({ 
      url: url,
      key: key
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ msg: 'Failed to upload thumbnail', error: error.message });
  }
});

// Upload background image to S3
router.post('/upload-background', requireAdmin, upload.single('background'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No background image file provided' });
    }

    const timestamp = Date.now();
    const key = `templates/images/${timestamp}-${req.file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);
    
    // Construct public URL
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    res.json({ 
      url: url,
      key: key
    });
  } catch (error) {
    console.error('Background upload error:', error);
    res.status(500).json({ msg: 'Failed to upload background image', error: error.message });
  }
});

// Upload template JSON to S3
router.post('/upload-template-json', requireAdmin, async (req, res) => {
  try {
    const templateData = req.body;

    if (!templateData.id || !templateData.name) {
      return res.status(400).json({ msg: 'Template ID and name are required' });
    }

    const key = `templates/json/${templateData.id}.json`;
    const jsonString = JSON.stringify(templateData, null, 2);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json',
    });

    await s3Client.send(command);
    
    // Construct public URL
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    res.json({ 
      url: url,
      key: key,
      templateData: templateData
    });
  } catch (error) {
    console.error('Template JSON upload error:', error);
    res.status(500).json({ msg: 'Failed to upload template JSON', error: error.message });
  }
});

module.exports = router;

