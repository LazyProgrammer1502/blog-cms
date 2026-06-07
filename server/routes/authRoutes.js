// authRoutes.js
const express = require('express');
const r = express.Router();
const { register, login, getMe, updateMe, uploadAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadAvatar: avatarUpload } = require('../config/cloudinary');

r.post('/register', register);
r.post('/login',    login);
r.get('/me',        protect, getMe);
r.put('/me',        protect, updateMe);
r.put('/avatar',    protect, avatarUpload.single('avatar'), uploadAvatar);

module.exports = r;
