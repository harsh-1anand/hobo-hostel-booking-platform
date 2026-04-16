const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true, sparse: true },
  dob: { type: Date },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  phone: { type: String },
  bio: { type: String },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' }]
}, { timestamps: true });

userSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('User', userSchema);
