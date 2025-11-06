const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Project = require('../model/Project');
const Favorite = require('../model/Favorite');
const BrandKit = require('../model/BrandKit');

// ============= PROJECT ROUTES =============

// Get user's projects
router.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create project
router.post('/projects', auth, async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user.id });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update project
router.put('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete project
router.delete('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ============= FAVORITE ROUTES =============

// Get user's favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create favorite
router.post('/favorites', auth, async (req, res) => {
  try {
    const favorite = new Favorite({ ...req.body, userId: req.user.id });
    await favorite.save();
    res.json(favorite);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete favorite
router.delete('/favorites/:id', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!favorite) return res.status(404).json({ msg: 'Favorite not found' });
    res.json({ msg: 'Favorite deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ============= BRAND KIT ROUTES =============

// Get user's brand kits
router.get('/brandkits', auth, async (req, res) => {
  try {
    const brandKits = await BrandKit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(brandKits);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create brand kit
router.post('/brandkits', auth, async (req, res) => {
  try {
    const { name, tagline, primaryColor, secondaryColor, logoUrl } = req.body;
    if (!name) return res.status(400).json({ msg: 'Name is required' });
    const brandKit = new BrandKit({
      userId: req.user.id,
      name,
      tagline: tagline || '',
      primaryColor: primaryColor || '',
      secondaryColor: secondaryColor || '',
      logoUrl: logoUrl || '',
    });
    await brandKit.save();
    res.json(brandKit);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update brand kit
router.put('/brandkits/:id', auth, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!brandKit) return res.status(404).json({ msg: 'Brand kit not found' });
    res.json(brandKit);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete brand kit
router.delete('/brandkits/:id', auth, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!brandKit) return res.status(404).json({ msg: 'Brand kit not found' });
    res.json({ msg: 'Brand kit deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

