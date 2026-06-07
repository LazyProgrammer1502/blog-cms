const Category     = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const slugify      = require('slugify');

// @desc  Get all categories (public)
// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
});

// @desc  Get single category by slug (public)
// @route GET /api/categories/:slug
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
  res.json({ success: true, category });
});

// @desc  Create category (admin)
// @route POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, color } = req.body;
  if (!name?.trim()) return res.status(400).json({ success: false, message: 'Name required.' });

  const slug = slugify(name, { lower: true, strict: true });
  const category = await Category.create({ name: name.trim(), slug, description, color });
  res.status(201).json({ success: true, category });
});

// @desc  Update category (admin)
// @route PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, color } = req.body;
  const updates = {};
  if (name) { updates.name = name.trim(); updates.slug = slugify(name, { lower: true, strict: true }); }
  if (description !== undefined) updates.description = description;
  if (color) updates.color = color;

  const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
  res.json({ success: true, category });
});

// @desc  Delete category (admin)
// @route DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted.' });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
