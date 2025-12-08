const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { auth } = require("./phoneSupport");


// Registration route
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email already exists' });

    user = new User({ firstName, lastName, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user._id } }; // Use ._id for consistency
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id } }; // Use ._id here too
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Verify token from LMS
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ msg: 'No token provided' });
  }

  try {
    // Verify the token using the same JWT_SECRET as LMS
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Extract user ID from the decoded token
    const userId = decoded.user?.id || decoded.id || decoded.userId;
    
    if (!userId) {
      return res.status(400).json({ msg: 'Invalid token format' });
    }

    // Find the user in the database
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return the user info and the token
    res.json({ 
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Token verification error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    res.status(500).json({ msg: 'Server error during token verification' });
  }
});

module.exports = router;
