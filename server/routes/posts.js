import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Helper to safe parse JSON
const safeParseJSON = (str, fallback = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// GET /api/posts - Get list of published posts with search & filters
router.get('/', (req, res) => {
  try {
    const { category, tag, season, search, type, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT p.*, 
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 'approved') as comment_count
      FROM posts p
      WHERE p.status = 'published'
    `;
    const params = [];

    if (category) {
      query += ` AND (p.category_name = ? OR p.category_id = ?)`;
      params.push(category, category);
    }

    if (season) {
      query += ` AND p.season = ?`;
      params.push(season);
    }

    if (type === 'guest') {
      query += ` AND p.is_guest_post = 1`;
    } else if (type === 'editorial') {
      query += ` AND p.is_guest_post = 0`;
    }

    if (search) {
      query += ` AND (p.title LIKE ? OR p.subtitle LIKE ? OR p.content LIKE ? OR p.author_name LIKE ? OR p.tags LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (tag) {
      query += ` AND p.tags LIKE ?`;
      params.push(`%${tag}%`);
    }

    query += ` ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const posts = db.prepare(query).all(...params);

    const formattedPosts = posts.map(p => ({
      ...p,
      tags: safeParseJSON(p.tags, []),
      is_guest_post: Boolean(p.is_guest_post),
      is_featured: Boolean(p.is_featured),
      is_trending: Boolean(p.is_trending),
    }));

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM posts WHERE status = 'published'`;
    const totalCount = db.prepare(countQuery).get().total;

    res.json({
      posts: formattedPosts,
      total: totalCount,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/featured - Main featured hero post
router.get('/featured', (req, res) => {
  try {
    let featured = db.prepare(`
      SELECT * FROM posts WHERE status = 'published' AND is_featured = 1 ORDER BY created_at DESC LIMIT 1
    `).get();

    if (!featured) {
      featured = db.prepare(`
        SELECT * FROM posts WHERE status = 'published' ORDER BY views DESC LIMIT 1
      `).get();
    }

    if (!featured) {
      return res.status(404).json({ error: 'No posts found' });
    }

    res.json({
      ...featured,
      tags: safeParseJSON(featured.tags, []),
      is_guest_post: Boolean(featured.is_guest_post),
      is_featured: Boolean(featured.is_featured),
      is_trending: Boolean(featured.is_trending),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured post' });
  }
});

// GET /api/posts/trending - Top trending articles for carousel / marquee
router.get('/trending', (req, res) => {
  try {
    const trending = db.prepare(`
      SELECT * FROM posts 
      WHERE status = 'published' AND (is_trending = 1 OR views > 1000)
      ORDER BY views DESC, likes DESC LIMIT 6
    `).all();

    res.json(trending.map(p => ({
      ...p,
      tags: safeParseJSON(p.tags, []),
      is_guest_post: Boolean(p.is_guest_post),
      is_featured: Boolean(p.is_featured),
      is_trending: Boolean(p.is_trending),
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
});

// GET /api/posts/:slug - Single post by slug
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const post = db.prepare(`
      SELECT * FROM posts WHERE slug = ?
    `).get(slug);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(post.id);

    // Fetch approved comments
    const comments = db.prepare(`
      SELECT * FROM comments WHERE post_id = ? AND status = 'approved' ORDER BY created_at DESC
    `).all(post.id);

    // Fetch related posts (same category, different id)
    const related = db.prepare(`
      SELECT id, title, slug, cover_image, category_name, read_time, season, author_name, is_guest_post, created_at
      FROM posts 
      WHERE category_name = ? AND id != ? AND status = 'published'
      ORDER BY created_at DESC LIMIT 3
    `).all(post.category_name, post.id);

    res.json({
      ...post,
      views: post.views + 1,
      tags: safeParseJSON(post.tags, []),
      is_guest_post: Boolean(post.is_guest_post),
      is_featured: Boolean(post.is_featured),
      is_trending: Boolean(post.is_trending),
      comments,
      related
    });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts/:id/like - Like a post
router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(id);
    const updated = db.prepare('SELECT likes FROM posts WHERE id = ?').get(id);
    res.json({ success: true, likes: updated?.likes || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// GET /api/seasons - Distinct fashion seasons
router.get('/meta/seasons', (req, res) => {
  try {
    const seasons = db.prepare(`
      SELECT season, COUNT(*) as count 
      FROM posts 
      WHERE status = 'published' AND season IS NOT NULL 
      GROUP BY season 
      ORDER BY count DESC
    `).all();
    res.json(seasons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seasons' });
  }
});

export default router;
