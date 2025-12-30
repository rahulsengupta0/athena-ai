const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
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
    console.log('Token verification failed: No token provided');
    return res.status(400).json({ msg: 'No token provided' });
  }

  try {
    console.log('Starting token verification...');
    
    // Verify the token using the same JWT_SECRET as LMS
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Token decoded successfully');
    console.log(' Decoded token structure:', JSON.stringify(decoded, null, 2));
    
    let user = null;
    let userCreated = false;
    let verificationMethod = '';
    
    // Extract user ID from various possible token structures
    const userId = decoded.userId || decoded.user?.id || decoded.id;
    const email = decoded.email || decoded.user?.email;
    
    console.log('🔍 Extracted data from token:');
    console.log('   - userId:', userId);
    console.log('   - email:', email);
    
    // Method 1: Try to find user by MongoDB ObjectId if userId is valid
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      console.log('🔎 Verification method: MongoDB ObjectId');
      verificationMethod = 'ObjectId';
      
      user = await User.findById(userId).select('-password');
      
      if (user) {
        console.log('User found by ObjectId:', user.email);
      } else {
        console.log('User not found by ObjectId, will try email or create new user');
      }
    }
    
    // Method 2: If user not found by ID, try to find by email
    if (!user && email) {
      console.log('🔎 Verification method: Email lookup');
      verificationMethod = verificationMethod ? `${verificationMethod} → Email` : 'Email';
      
      user = await User.findOne({ email }).select('-password');
      
      if (user) {
        console.log(' User found by email:', email);
      } else {
        console.log('User not found by email, will create new user');
      }
    }
    
    // Method 3: If user doesn't exist, create one automatically (with atomic operation)
    if (!user) {
      console.log('🆕 Creating new user from token data...');
      
      // Extract user data from token (handle both camelCase and snake_case)
      const firstName = decoded.firstName || decoded.first_name || decoded.name?.split(' ')[0] || decoded.user?.firstName || decoded.user?.first_name || '';
      const lastName = decoded.lastName || decoded.last_name || decoded.name?.split(' ').slice(1).join(' ') || decoded.user?.lastName || decoded.user?.last_name || '';
      const userEmail = email || decoded.user?.email;
      
      console.log('📝 Extracted user data:');
      console.log('   - firstName:', firstName);
      console.log('   - lastName:', lastName);
      console.log('   - userEmail:', userEmail);
      
      if (!userEmail) {
        console.error('❌ Cannot create user: No email found in token');
        return res.status(400).json({ 
          msg: 'Cannot create user: Email is required but not found in token' 
        });
      }
      
      // Generate a random password for the new user (they can reset it later)
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      // Use findOneAndUpdate with upsert to avoid race conditions
      const existingUser = await User.findOne({ email: userEmail });
      
      if (existingUser) {
        // User already exists (from concurrent request)
        user = existingUser;
        userCreated = false;
        console.log('⚠️  User already exists (concurrent creation detected)');
      } else {
        // Create new user
        user = new User({
          email: userEmail,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          role: decoded.role || 'user'
        });
        
        try {
          await user.save();
          userCreated = true;
        } catch (saveErr) {
          // Handle duplicate key error from concurrent requests
          if (saveErr.code === 11000) {
            console.log('⚠️  Concurrent creation detected, fetching existing user...');
            user = await User.findOne({ email: userEmail }).select('-password');
            userCreated = false;
          } else {
            throw saveErr;
          }
        }
      }
      
      console.log(' User operation completed:');
      console.log('   - Email:', user.email);
      console.log('   - Name:', `${user.firstName} ${user.lastName}`);
      console.log('   - ID:', user._id);
      console.log('   - Created new:', userCreated);
    }
    
    // Remove password from user object before sending
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
    
    // Generate a new Athena AI token with MongoDB ObjectId for future API calls
    const athenaPayload = { user: { id: user._id } };
    
    // Generate token using Promise-based approach
    const athenaToken = await new Promise((resolve, reject) => {
      jwt.sign(athenaPayload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, newToken) => {
        if (err) {
          console.error('Error generating Athena AI token:', err);
          reject(err);
        } else {
          resolve(newToken);
        }
      });
    });
    
    console.log(' Token verification completed successfully');
    console.log('   - Verification method:', verificationMethod);
    console.log('   - User created:', userCreated);
    console.log('   - User email:', user.email);
    console.log('   - User MongoDB ID:', user._id);
    console.log('   - New Athena AI token generated');
    
    // Return success response with new Athena AI token, user info, and creation status
    res.json({ 
      success: true,
      token: athenaToken, // Return new Athena AI token instead of LMS token
      user: userResponse,
      created: userCreated
    });
    
  } catch (err) {
    console.error(' Token verification error occurred');
    console.error('   Error name:', err.name);
    console.error('   Error message:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      console.error('   Reason: Token has expired');
      return res.status(401).json({ 
        success: false,
        msg: 'Token has expired' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      console.error('   Reason: Invalid token signature or format');
      return res.status(401).json({ 
        success: false,
        msg: 'Invalid token' 
      });
    }
    
    if (err.code === 11000) {
      // MongoDB duplicate key error (email already exists)
      console.error('   Reason: Email already exists in database');
      return res.status(409).json({ 
        success: false,
        msg: 'User with this email already exists' 
      });
    }
    
    // Log full error stack in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('   Full error stack:', err.stack);
    }
    
    // Return error response
    const errorMsg = process.env.NODE_ENV === 'production' 
      ? 'Server error during token verification'
      : `Server error: ${err.message}`;
    
    res.status(500).json({ 
      success: false,
      msg: errorMsg 
    });
  }
});

module.exports = router;
