const { Category } = require('../../models')
const path = require('path');
const fs = require('fs');
const { generateSlug } = require('../../helpers/generateSlug')

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await Category.create({ name, slug });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to create the category' });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to fetch categories' });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to fetch the category' });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, slug } = req.body;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    category.name = name;
    category.slug = slug;
    await category.save();

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to update the category' });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Unable to delete the category' });
  }
};

module.exports = { createCategory, updateCategory, getAllCategories, deleteCategory, getCategoryById}