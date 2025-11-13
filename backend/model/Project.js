const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  statusColor: { type: String },
  hashtags: [{ type: String }],
  date: { type: String, default: () => new Date().toLocaleDateString() },
  size: { type: String },
  favorite: { type: Boolean, default: false },
  // Per-item collaborators (additional users with access)
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

