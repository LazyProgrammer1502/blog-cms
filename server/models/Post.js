const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String, required: true, trim: true, maxlength: 150,
  },
  slug: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  // Rich text content stored as HTML string from TipTap
  content: {
    type: String, required: true,
  },
  excerpt: {
    type: String, maxlength: 300, default: '',
  },
  coverImage: {
    url:          { type: String, default: '' },
    alt:          { type: String, default: '' },
    cloudinaryId: { type: String, default: '' },
  },
  status: {
    type: String, enum: ['draft', 'published', 'archived'], default: 'draft',
  },
  // Relations
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags:     [{ type: String, trim: true, lowercase: true }],

  // Auto-calculated
  readTime: { type: Number, default: 1 }, // in minutes

  // SEO
  seo: {
    metaTitle:       { type: String, maxlength: 60,  default: '' },
    metaDescription: { type: String, maxlength: 160, default: '' },
  },

  // Analytics
  views:        { type: Number, default: 0 },
  publishedAt:  { type: Date },
}, { timestamps: true });

// ── Text index for full-text search ──────────────────────
postSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });
postSchema.index({ slug: 1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1, status: 1 });

// ── Auto-calculate read time before saving ────────────────
postSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    // Strip HTML tags and count words — avg reading speed 200 wpm
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  // Set publishedAt when first published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
