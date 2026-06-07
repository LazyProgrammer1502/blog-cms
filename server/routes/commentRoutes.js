const express = require('express');
const r = express.Router();
const { submitComment, getComments, updateCommentStatus, deleteComment, getCommentCounts } = require('../controllers/commentController');
const { protect, adminOnly } = require('../middleware/auth');

// Public
r.post('/:postSlug',      submitComment);

// Admin
r.get('/',                protect, adminOnly, getComments);
r.get('/counts',          protect, adminOnly, getCommentCounts);
r.put('/:id/status',      protect, adminOnly, updateCommentStatus);
r.delete('/:id',          protect, adminOnly, deleteComment);

module.exports = r;
