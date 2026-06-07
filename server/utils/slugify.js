const slugify = require('slugify');
const Post     = require('../models/Post');

// Generate a unique slug from a title
const generateSlug = async (title, excludeId = null) => {
  let baseSlug = slugify(title, { lower: true, strict: true, trim: true });
  let slug     = baseSlug;
  let count    = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Post.findOne(query);
    if (!existing) break;
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

module.exports = { generateSlug };
