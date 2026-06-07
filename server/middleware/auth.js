const jwt          = require('jsonwebtoken');
const User         = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Verify JWT — attach user to request
const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token.' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not found.' });
  }
  next();
});

// Only allow admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

// Allow admin or author (their own content)
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Access denied. Required: ${roles.join(' or ')}` });
  }
  next();
};

module.exports = { protect, adminOnly, authorize };
