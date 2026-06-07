const express = require('express');
const r = express.Router();
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

r.get('/',       getCategories);
r.get('/:slug',  getCategory);
r.post('/',      protect, adminOnly, createCategory);
r.put('/:id',    protect, adminOnly, updateCategory);
r.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = r;
