const mongoose = require('mongoose');

const BrandKitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '', trim: true },
    primaryColor: { type: String, default: '' },
    secondaryColor: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BrandKit', BrandKitSchema);


