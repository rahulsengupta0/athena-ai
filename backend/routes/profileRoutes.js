const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../model/User');

// Get user profile
router.get('/', auth, async (req, res) => {
  console.log('GET /api/profile - User ID:', req.user.id);
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log('User found:', user);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  console.log('PUT /api/profile - User ID:', req.user.id);
  console.log('Request body:', req.body);
  try {
    const { firstName, lastName, bio, website, avatar, email } = req.body;
    
    // Create update object, only including fields that are provided
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (avatar !== undefined) updateData.avatar = avatar;
    // Don't update email
    
    console.log('Update data:', updateData);
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Updated user:', user);
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

