const mongoose = require('mongoose');

const userFileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  key: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  favorite: { type: Boolean, default: false },
});

module.exports = mongoose.model('UserFile', userFileSchema);
