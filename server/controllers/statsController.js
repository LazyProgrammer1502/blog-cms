const Post         = require('../models/Post');
const Category     = require('../models/Category');
const Comment      = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get admin dashboard stats
// @route GET /api/stats
const getStats = asyncHandler(async (req, res) => {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews,
    totalCategories,
    pendingComments,
    totalComments,
    recentPosts,
    topPosts,
  ] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: 'published' }),
    Post.countDocuments({ status: 'draft' }),
    Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    Category.countDocuments(),
    Comment.countDocuments({ status: 'pending' }),
    Comment.countDocuments(),
    Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug status views createdAt')
      .populate('category', 'name color'),
    Post.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views publishedAt')
      .populate('category', 'name color'),
  ]);

  res.json({
    success: true,
    stats: {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews[0]?.total || 0,
      totalCategories,
      pendingComments,
      totalComments,
    },
    recentPosts,
    topPosts,
  });
});

module.exports = { getStats };
