const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Project = require('../model/Project');
const Favorite = require('../model/Favorite');

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

module.exports = router;

