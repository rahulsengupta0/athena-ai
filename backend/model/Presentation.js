const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for individual layer effects
const EffectSchema = new Schema({
  opacity: { type: Number, default: 1 },
  blur: { type: Number, default: 0 },
  brightness: { type: Number, default: 0 },
  contrast: { type: Number, default: 0 },
  grayscale: { type: Number, default: 0 },
  hueRotate: { type: Number, default: 0 },
  invert: { type: Number, default: 0 },
  saturate: { type: Number, default: 1 },
  sepia: { type: Number, default: 0 },
  dropShadow: {
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
    blur: { type: Number, default: 0 },
    color: { type: String, default: 'rgba(0,0,0,0.5)' },
  },
}, { _id: false });

// Schema for a single layer on a slide
const LayerSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'shape', 'image'] },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  effects: { type: EffectSchema, default: () => ({}) },

  properties: { type: Schema.Types.Mixed, default: {} }
}, { _id: false });

// Schema for a single slide in a presentation
const SlideSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  background: { type: String, default: '#ffffff' },
  layers: [LayerSchema],
  animationDuration: { type: Number, default: 5 },
}, { _id: false });

// Main schema for a presentation
const PresentationSchema = new Schema({
  name: { type: String, required: true, default: 'Untitled Presentation' },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  layout: {
    name: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    aspectLabel: { type: String },
  },
  slides: [SlideSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the 'updatedAt' field on save
PresentationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Presentation', PresentationSchema);