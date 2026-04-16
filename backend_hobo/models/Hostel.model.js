const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  amenities: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availableBeds: { type: Number, required: true },
  isApproved: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

hostelSchema.index({ name: 'text', location: 'text' });

module.exports = mongoose.model('Hostel', hostelSchema);