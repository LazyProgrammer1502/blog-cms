const Comment      = require('../models/Comment');
const Post         = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Submit a comment (public)
// @route POST /api/comments/:postSlug
const submitComment = asyncHandler(async (req, res) => {
  const { name, email, body, parentComment } = req.body;

  if (!name?.trim() || !email?.trim() || !body?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email, and comment are required.' });
  }

  const post = await Post.findOne({ slug: req.params.postSlug, status: 'published' });
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

  const comment = await Comment.create({
    post: post._id,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    body: body.trim(),
    parentComment: parentComment || null,
    status: 'pending', // always pending — admin approves
  });

  res.status(201).json({
    success: true,
    message: 'Comment submitted. It will appear after moderation.',
    comment: { _id: comment._id, name: comment.name, body: comment.body },
  });
});

// @desc  Get all comments for moderation (admin)
// @route GET /api/comments
const getComments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const pageNum  = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));

  const [comments, total] = await Promise.all([
    Comment.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('post', 'title slug'),
    Comment.countDocuments(query),
  ]);

  res.json({ success: true, comments, total, totalPages: Math.ceil(total / limitNum) });
});

// @desc  Update comment status (admin)
// @route PUT /api/comments/:id/status
const updateCommentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'spam'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }

  const comment = await Comment.findByIdAndUpdate(
    req.params.id, { status }, { new: true }
  ).populate('post', 'title slug');

  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });
  res.json({ success: true, comment });
});

// @desc  Delete comment (admin)
// @route DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });
  await comment.deleteOne();
  res.json({ success: true, message: 'Comment deleted.' });
});

// @desc  Get comment counts by status (admin dashboard)
// @route GET /api/comments/counts
const getCommentCounts = asyncHandler(async (req, res) => {
  const [pending, approved, spam] = await Promise.all([
    Comment.countDocuments({ status: 'pending' }),
    Comment.countDocuments({ status: 'approved' }),
    Comment.countDocuments({ status: 'spam' }),
  ]);
  res.json({ success: true, pending, approved, spam, total: pending + approved + spam });
});

module.exports = { submitComment, getComments, updateCommentStatus, deleteComment, getCommentCounts };
