require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPG, GIF or PNG files are allowed'));
    }
  }
});

// Create avatars directory if it doesn't exist
if (!fs.existsSync('uploads/avatars')) {
  fs.mkdirSync('uploads/avatars', { recursive: true });
}

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },
  avatar: { type: String, default: '' },
  plan: { type: String, default: 'Pro Plan' }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/athena-ai', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    // For demo purposes, we'll return a default user
    // In production, you'd get the user ID from JWT token
    const user = await User.findOne({ email: 'alex@example.com' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      website: user.website,
      avatar: user.avatar,
      plan: user.plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
app.put('/api/profile', upload.single('avatar'), async (req, res) => {
  try {
    const { firstName, lastName, email, bio, website } = req.body;
    
    // For demo purposes, we'll update the default user
    const user = await User.findOne({ email: 'alex@example.com' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.website = website || user.website;

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar if exists
      if (user.avatar && fs.existsSync(user.avatar)) {
        fs.unlinkSync(user.avatar);
      }
      user.avatar = req.file.path;
    }

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        website: user.website,
        avatar: user.avatar,
        plan: user.plan
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
app.put('/api/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // For demo purposes, we'll use the default user
    const user = await User.findOne({ email: 'alex@example.com' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create default user if not exists
app.post('/api/init-user', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: 'alex@example.com' });
    if (existingUser) {
      return res.json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = new User({
      firstName: 'Alex',
      lastName: 'Thompson',
      email: 'alex@example.com',
      password: hashedPassword,
      bio: 'Creative designer passionate about AI-powered design tools.',
      website: 'https://alexthompson.design',
      plan: 'Pro Plan'
    });

    await user.save();
    res.json({ message: 'Default user created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Example route
app.get('/', (req, res) => res.send('API is working'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
