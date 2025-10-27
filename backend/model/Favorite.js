const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  categories: [{ type: String }],
  tags: [{ type: String }],
  time: { type: String, default: () => new Date().toLocaleDateString() },
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  loved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);

