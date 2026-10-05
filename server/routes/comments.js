import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';

const router = express.Router();

// POST /api/comments - Add reader comment to post
router.post('/', (req, res) => {
  try {
    const { post_id, author_name, author_email, content } = req.body;
    if (!post_id || !author_name || !content) {
      return res.status(400).json({ error: 'Post ID, author name, and content are required' });
    }

    const id = `cmt_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    db.prepare(`
      INSERT INTO comments (id, post_id, author_name, author_email, content, status)
      VALUES (?, ?, ?, ?, ?, 'approved')
    `).run(id, post_id, author_name.trim(), author_email || '', content.trim());

    const created = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error posting comment:', err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

export default router;
