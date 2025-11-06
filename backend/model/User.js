const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  bio: { type: String, default: '' },
  website: { type: String, default: '' },
  avatar: { type: String, default: '' }
});
module.exports = mongoose.model('User', UserSchema);
