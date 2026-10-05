import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

// GET /api/categories - List all categories with live post count
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM posts WHERE (category_name = c.name OR category_id = c.id) AND status = 'published') as post_count
      FROM categories c
      ORDER BY c.sort_order ASC, c.name ASC
    `).all();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Add category (admin)
router.post('/', (req, res) => {
  try {
    const { name, description, cover_image } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const slug = slugify(name);
    const id = `cat_${slug.replace(/-/g, '_')}`;

    db.prepare(`
      INSERT INTO categories (id, name, slug, description, cover_image)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      slug,
      description || '',
      cover_image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    );

    res.status(201).json({ id, name, slug, description });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category or category already exists' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
