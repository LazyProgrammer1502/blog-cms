const Post         = require('../models/Post');
const Category     = require('../models/Category');
const Comment      = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');
const { generateSlug } = require('../utils/slugify');

// ── Public ────────────────────────────────────────────────

// @desc  Get published posts (paginated, filterable)
// @route GET /api/posts
const getPosts = asyncHandler(async (req, res) => {
  const { category, tag, search, page = 1, limit = 10, sort = 'newest' } = req.query;

  const query = { status: 'published' };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
  }
  if (tag)    query.tags = tag.toLowerCase();
  if (search) query.$text = { $search: search };

  const sortMap = {
    newest:    { publishedAt: -1 },
    oldest:    { publishedAt:  1 },
    popular:   { views: -1 },
    title:     { title:  1 },
  };

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
  const skip     = (pageNum - 1) * limitNum;

  const [posts, total] = await Promise.all([
    Post.find(query)
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(limitNum)
      .select('-content') // exclude heavy content from list view
      .populate('author',   'name avatar')
      .populate('category', 'name slug color'),
    Post.countDocuments(query),
  ]);

  res.json({
    success: true,
    posts,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    hasMore: pageNum < Math.ceil(total / limitNum),
  });
});

// @desc  Get single post by slug + increment view count
// @route GET /api/posts/:slug
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
    .populate('author',   'name avatar bio')
    .populate('category', 'name slug color');

  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

  // Increment view count (fire and forget)
  Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();

  // Get approved comments for this post
  const comments = await Comment.find({ post: post._id, status: 'approved', parentComment: null })
    .sort({ createdAt: -1 })
    .select('name body createdAt');

  // Get related posts (same category, exclude current)
  const related = await Post.find({
    status: 'published',
    category: post.category?._id,
    _id: { $ne: post._id },
  })
    .limit(3)
    .select('title slug excerpt coverImage readTime publishedAt')
    .populate('category', 'name slug color');

  res.json({ success: true, post, comments, related });
});

// @desc  Search posts
// @route GET /api/posts/search?q=
const searchPosts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Query must be 2+ chars.' });
  }

  const posts = await Post.find({
    status: 'published',
    $text: { $search: q.trim() },
  }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)
    .select('title slug excerpt coverImage readTime publishedAt')
    .populate('category', 'name slug color');

  res.json({ success: true, posts, count: posts.length });
});

// ── Admin ─────────────────────────────────────────────────

// @desc  Get ALL posts (admin — includes drafts)
// @route GET /api/posts/admin
const getAdminPosts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));

  const [posts, total] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('title slug status views readTime publishedAt createdAt')
      .populate('author',   'name')
      .populate('category', 'name color'),
    Post.countDocuments(query),
  ]);

  res.json({ success: true, posts, total, totalPages: Math.ceil(total / limitNum), currentPage: pageNum });
});

// @desc  Create post
// @route POST /api/posts
const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, status, category, tags, seo } = req.body;

  if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title required.' });
  if (!content?.trim()) return res.status(400).json({ success: false, message: 'Content required.' });

  const slug = await generateSlug(title);

  const post = await Post.create({
    title:    title.trim(),
    slug,
    content:  content.trim(),
    excerpt:  excerpt?.trim() || '',
    status:   status || 'draft',
    author:   req.user._id,
    category: category || null,
    tags:     tags || [],
    seo:      seo || {},
    coverImage: req.file ? { url: req.file.path, cloudinaryId: req.file.filename } : {},
  });

  // Update category post count
  if (post.category) {
    await Category.findByIdAndUpdate(post.category, { $inc: { postCount: 1 } });
  }

  await post.populate('author', 'name avatar');
  await post.populate('category', 'name slug color');

  res.status(201).json({ success: true, post });
});

// @desc  Update post
// @route PUT /api/posts/:id
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

  const oldCategory = post.category?.toString();
  const { title, content, excerpt, status, category, tags, seo } = req.body;

  const updates = {};
  if (title)    { updates.title = title.trim(); updates.slug = await generateSlug(title, post._id); }
  if (content)  updates.content  = content.trim();
  if (excerpt !== undefined) updates.excerpt = excerpt.trim();
  if (status)   updates.status   = status;
  if (category !== undefined) updates.category = category || null;
  if (tags)     updates.tags     = tags;
  if (seo)      updates.seo      = seo;
  if (req.file) updates.coverImage = { url: req.file.path, cloudinaryId: req.file.filename };

  const updated = await Post.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    .populate('author', 'name avatar')
    .populate('category', 'name slug color');

  // Update category post counts if category changed
  const newCategory = updated.category?._id?.toString();
  if (oldCategory !== newCategory) {
    if (oldCategory) await Category.findByIdAndUpdate(oldCategory, { $inc: { postCount: -1 } });
    if (newCategory) await Category.findByIdAndUpdate(newCategory, { $inc: { postCount:  1 } });
  }

  res.json({ success: true, post: updated });
});

// @desc  Delete post
// @route DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

  if (post.category) await Category.findByIdAndUpdate(post.category, { $inc: { postCount: -1 } });
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({ success: true, message: 'Post deleted.' });
});

// @desc  Toggle post status (draft ↔ published)
// @route PUT /api/posts/:id/status
const toggleStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['draft', 'published', 'archived'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { status, ...(status === 'published' ? { publishedAt: new Date() } : {}) },
    { new: true }
  ).select('title status publishedAt');

  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  res.json({ success: true, post });
});

// @desc  Upload cover image
// @route POST /api/posts/upload-cover
const uploadCover = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
  res.json({ success: true, url: req.file.path, cloudinaryId: req.file.filename });
});

// @desc  Upload content image (for TipTap editor)
// @route POST /api/posts/upload-image
const uploadContentImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
  // TipTap expects { url: '...' }
  res.json({ success: true, url: req.file.path });
});

module.exports = {
  getPosts, getPost, searchPosts,
  getAdminPosts, createPost, updatePost, deletePost,
  toggleStatus, uploadCover, uploadContentImage,
};
