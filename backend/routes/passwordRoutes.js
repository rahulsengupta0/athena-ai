const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const User = require('../model/User');

// Change password route
router.put('/', auth, async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  try {
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'New password and confirm password do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ msg: 'New password must be different from current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;

