const express = require('express');
const r = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect, adminOnly } = require('../middleware/auth');

r.get('/', protect, adminOnly, getStats);

module.exports = r;
