const express = require('express');
const r = express.Router();
const {
  getPosts, getPost, searchPosts,
  getAdminPosts, createPost, updatePost, deletePost,
  toggleStatus, uploadCover, uploadContentImage,
} = require('../controllers/postController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadCover: coverUpload, uploadContentImage: contentImgUpload } = require('../config/cloudinary');

// Public
r.get('/',               getPosts);
r.get('/search',         searchPosts);
r.get('/admin',          protect, adminOnly, getAdminPosts);
r.get('/:slug',          getPost);

// Admin
r.post('/',              protect, adminOnly, coverUpload.single('coverImage'), createPost);
r.put('/:id',            protect, adminOnly, coverUpload.single('coverImage'), updatePost);
r.delete('/:id',         protect, adminOnly, deletePost);
r.put('/:id/status',     protect, adminOnly, toggleStatus);
r.post('/upload-cover',  protect, adminOnly, coverUpload.single('file'),         uploadCover);
r.post('/upload-image',  protect, adminOnly, contentImgUpload.single('file'),    uploadContentImage);

module.exports = r;
