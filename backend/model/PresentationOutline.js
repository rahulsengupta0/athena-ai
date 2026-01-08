const mongoose = require('mongoose');

const SlideOutlineSchema = new mongoose.Schema({
  slideNo: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  layout: {
    type: String,
    default: 'content'
  },
  contentType: {
    type: String,
    required: true,
    enum: ['paragraph', 'bullets', 'comparison'] // Validates strictly against your AI types
  },
  // We use Mixed because content can be a String, Array, or Object depending on contentType
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  imagePrompt: {
    type: String,
    default: ''
  }
});

const PresentationOutlineSchema = new mongoose.Schema({
  // Optional: Link to a user if you have authentication
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meta: {
    topic: { type: String, required: true },
    tone: { type: String },
    slideCount: { type: Number },
    stage: { type: String, default: 'outline' }
  },
  slides: [SlideOutlineSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PresentationOutline', PresentationOutlineSchema);