const User         = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendTokenResponse } = require('../utils/generateToken');

// @desc  Register (admin creates accounts — not public signup)
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields required.' });
  }
  if (await User.findOne({ email })) {
    return res.status(400).json({ success: false, message: 'Email already registered.' });
  }
  const user = await User.create({ name, email, password, role: role || 'author' });
  sendTokenResponse(user, 201, res);
});

// @desc  Login
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }
  sendTokenResponse(user, 200, res);
});

// @desc  Get current user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

// @desc  Update profile
// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const { name, bio } = req.body;
  const updates = {};
  if (name) updates.name = name.trim();
  if (bio !== undefined) updates.bio = bio.trim();
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
});

// @desc  Upload avatar
// @route PUT /api/auth/avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file.' });
  const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true });
  res.json({ success: true, avatar: user.avatar, user });
});

module.exports = { register, login, getMe, updateMe, uploadAvatar };
