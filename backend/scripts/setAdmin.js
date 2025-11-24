/**
 * Utility script to set a user as admin
 * 
 * Usage (from project root):
 *   node backend/scripts/setAdmin.js <user-email>
 * 
 * Example:
 *   node backend/scripts/setAdmin.js admin@example.com
 */

const path = require('path');
const fs = require('fs');

// Try to find .env file - check project root first, then backend directory
const projectRoot = path.resolve(__dirname, '../..');
const backendDir = path.resolve(__dirname, '..');
const envPath = fs.existsSync(path.join(projectRoot, '.env')) 
  ? path.join(projectRoot, '.env')
  : path.join(backendDir, '.env');

require('dotenv').config({ path: envPath });

const mongoose = require('mongoose');
const User = require(path.resolve(__dirname, '../model/User'));

const email = process.argv[2];

if (!email) {
  console.error('Error: Email is required');
  console.log('Usage: node backend/scripts/setAdmin.js <user-email>');
  process.exit(1);
}

async function setAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`Error: User with email "${email}" not found`);
      process.exit(1);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully set user "${email}" as admin`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Role: ${user.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setAdmin();

