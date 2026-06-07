const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  name:   { type: String, required: true, trim: true, maxlength: 60 },
  email:  { type: String, required: true, lowercase: true, trim: true },
  body:   { type: String, required: true, maxlength: 1000 },
  status: { type: String, enum: ['pending', 'approved', 'spam'], default: 'pending' },
  // Optional — reply to another comment
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: true });

commentSchema.index({ post: 1, status: 1 });

module.exports = mongoose.model('Comment', commentSchema);
