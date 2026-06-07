const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 50, unique: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, maxlength: 200, default: '' },
  color:       { type: String, default: '#3B82F6' }, // hex color for UI badge
  postCount:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
