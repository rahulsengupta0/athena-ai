const User = require('../model/User');
const authMiddleware = require('./auth');

// Admin middleware - must be used after auth middleware
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    req.user.role = user.role; // Attach role to req.user for convenience
    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Combined middleware: auth + admin check
const requireAdmin = [authMiddleware, adminMiddleware];

module.exports = { adminMiddleware, requireAdmin };

