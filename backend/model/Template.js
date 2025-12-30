const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  thumbnailUrl: { type: String, required: true },
  jsonUrl: { type: String, required: true },
  canvasWidth: { type: Number, default: 1080 },
  canvasHeight: { type: Number, default: 1080 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);