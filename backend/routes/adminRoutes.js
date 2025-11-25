const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middlewares/admin');
const User = require('../model/User');

// Update user role (admin only)
router.put('/users/:userId/role', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role. Must be "user" or "admin"' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User role updated successfully', user });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Get all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;

