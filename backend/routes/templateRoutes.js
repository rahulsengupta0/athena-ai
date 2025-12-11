const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAdmin } = require('../middlewares/admin');
const {
  S3Client,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const path = require('path');
const Template = require('../model/Template'); // Import your MongoDB Model

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

// ---------------------------------------------------------
// 1. Upload Helper Routes (Images)
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// 2. Main Template Logic (JSON + Database)
// ---------------------------------------------------------

// Upload template JSON to S3 AND Save Metadata to MongoDB
router.post('/upload-template-json', requireAdmin, async (req, res) => {
  try {
    const templateData = req.body;

    if (!templateData.id || !templateData.name) {
      return res.status(400).json({ msg: 'Template ID and name are required' });
    }

    // 1. Upload JSON to S3
    const key = `templates/json/${templateData.id}.json`;
    const jsonString = JSON.stringify(templateData, null, 2);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json',
    });

    await s3Client.send(command);

    const s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // 2. Save Metadata to MongoDB
    // We extract the relevant info from the JSON payload to store in our DB for quick querying
    const newTemplate = new Template({
      name: templateData.name,
      category: templateData.category || 'General',
      thumbnailUrl: templateData.thumbnail, // Assumes frontend sends 'thumbnail' in JSON
      jsonUrl: s3Url,
      canvasWidth: templateData.canvas?.width || 1080,
      canvasHeight: templateData.canvas?.height || 1080,
    });

    const savedTemplate = await newTemplate.save();

    res.json({
      msg: 'Template uploaded and saved successfully',
      url: s3Url,
      key: key,
      dbRecord: savedTemplate
    });

  } catch (error) {
    console.error('Template upload/save error:', error);
    res.status(500).json({ msg: 'Failed to upload template', error: error.message });
  }
});

// Public GET: List templates (Fetched from MongoDB, not S3 scan)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = {};
    if (category) {
      // Case-insensitive match for category
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Fetch from DB, sort by newest first
    const templates = await Template.find(query).sort({ createdAt: -1 });

    // Map DB objects to the format frontend expects (if needed)
    // or simply return the DB objects directly
    res.json(templates);

  } catch (error) {
    console.error('List templates error:', error);
    res.status(500).json({ msg: 'Failed to list templates', error: error.message });
  }
});

// Public GET: Get Single Template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ msg: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;