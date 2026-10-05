import express from 'express';
import crypto from 'node:crypto';
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

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const estimateReadTime = (content) => {
  const words = (content || '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// POST /api/admin/verify-passcode - Master admin passcode verification
router.post('/verify-passcode', (req, res) => {
  const { passcode } = req.body;
  const MASTER_PASSCODE = 'Paki@123';

  if (passcode === MASTER_PASSCODE) {
    return res.json({
      success: true,
      token: `zaib_auth_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      message: 'Atelier master access granted.'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Incorrect master passcode. Access to Atelier Portal denied.'
  });
});

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  const MASTER_PASSCODE = 'Paki@123';
  if (password === MASTER_PASSCODE) {
    return res.json({
      success: true,
      user: {
        id: 'usr_admin_01',
        name: 'Camille de Valois',
        email: email || 'admin@zaibattire.com',
        role: 'admin'
      },
      token: `token_admin_${Date.now()}`
    });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get((email || '').toLowerCase().trim());
  if (!user || user.password_hash !== password) {
    return res.status(401).json({ error: 'Invalid credentials. Access restricted.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
    },
    token: `token_${user.id}_${Date.now()}`
  });
});

// GET /api/admin/stats - Comprehensive Dashboard Metrics
router.get('/stats', (req, res) => {
  try {
    const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
    const publishedPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'published'").get().count;
    const draftPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'draft'").get().count;
    const guestPublished = db.prepare("SELECT COUNT(*) as count FROM posts WHERE is_guest_post = 1").get().count;
    const pendingGuest = db.prepare("SELECT COUNT(*) as count FROM guest_submissions WHERE status = 'pending'").get().count;
    const totalViews = db.prepare("SELECT SUM(views) as count FROM posts").get().count || 0;
    const totalLikes = db.prepare("SELECT SUM(likes) as count FROM posts").get().count || 0;
    const totalComments = db.prepare("SELECT COUNT(*) as count FROM comments").get().count;
    const totalSubscribers = db.prepare("SELECT COUNT(*) as count FROM newsletter_subscribers").get().count;

    // Categories breakdown
    const categoryStats = db.prepare(`
      SELECT category_name, COUNT(*) as post_count, SUM(views) as total_views
      FROM posts
      GROUP BY category_name
      ORDER BY post_count DESC
    `).all();

    // Top viewed articles
    const topPosts = db.prepare(`
      SELECT id, title, slug, views, likes, category_name, cover_image, is_guest_post, status
      FROM posts
      ORDER BY views DESC LIMIT 5
    `).all();

    // Recent submissions
    const recentSubmissions = db.prepare(`
      SELECT id, title, author_name, category_name, status, created_at
      FROM guest_submissions
      ORDER BY created_at DESC LIMIT 5
    `).all();

    res.json({
      counts: {
        totalPosts,
        publishedPosts,
        draftPosts,
        guestPublished,
        pendingGuest,
        totalViews,
        totalLikes,
        totalComments,
        totalSubscribers
      },
      categoryStats,
      topPosts,
      recentSubmissions
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

// GET /api/admin/posts - List all posts for admin table
router.get('/posts', (req, res) => {
  try {
    const { status, category, search, is_guest } = req.query;
    let query = 'SELECT * FROM posts WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (category && category !== 'all') {
      query += ' AND category_name = ?';
      params.push(category);
    }
    if (is_guest === 'true') {
      query += ' AND is_guest_post = 1';
    } else if (is_guest === 'false') {
      query += ' AND is_guest_post = 0';
    }
    if (search) {
      query += ' AND (title LIKE ? OR author_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    const posts = db.prepare(query).all(...params);

    res.json(posts.map(p => ({
      ...p,
      tags: safeParseJSON(p.tags, []),
      is_guest_post: Boolean(p.is_guest_post),
      is_featured: Boolean(p.is_featured),
      is_trending: Boolean(p.is_trending),
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin posts' });
  }
});

// POST /api/admin/posts - Create new post
router.post('/posts', (req, res) => {
  try {
    const {
      title,
      slug,
      subtitle,
      content,
      cover_image,
      category_name,
      season,
      status = 'published',
      is_featured = 0,
      is_trending = 0,
      is_guest_post = 0,
      tags,
      author_name,
      author_email,
      author_bio,
      author_avatar,
      author_website,
      author_social
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const id = `post_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`;
    let finalSlug = slug ? slugify(slug) : slugify(title);

    // Ensure slug uniqueness
    const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(finalSlug);
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const read_time = estimateReadTime(content);

    let formattedTags = '[]';
    if (Array.isArray(tags)) {
      formattedTags = JSON.stringify(tags);
    } else if (typeof tags === 'string') {
      formattedTags = JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean));
    }

    const defaultCover = cover_image || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80';
    const author = author_name || 'Camille de Valois';
    const avatar = author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

    // If featured is true, optionally un-feature others
    if (is_featured) {
      db.prepare('UPDATE posts SET is_featured = 0').run();
    }

    db.prepare(`
      INSERT INTO posts (
        id, title, slug, subtitle, content, cover_image, category_name,
        season, read_time, status, is_guest_post, is_featured, is_trending,
        tags, author_name, author_email, author_bio, author_avatar, author_website, author_social
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      finalSlug,
      subtitle || '',
      content.trim(),
      defaultCover,
      category_name || 'Haute Couture',
      season || 'Spring / Summer 2026',
      read_time,
      status,
      is_guest_post ? 1 : 0,
      is_featured ? 1 : 0,
      is_trending ? 1 : 0,
      formattedTags,
      author,
      author_email || 'admin@zaibattire.com',
      author_bio || 'Fashion Contributor',
      avatar,
      author_website || '',
      author_social || ''
    );

    const created = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/admin/posts/:id - Edit post
router.put('/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      subtitle,
      content,
      cover_image,
      category_name,
      season,
      status,
      is_featured,
      is_trending,
      is_guest_post,
      tags,
      author_name,
      author_email,
      author_bio,
      author_avatar,
      author_website,
      author_social
    } = req.body;

    const current = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!current) {
      return res.status(404).json({ error: 'Post not found' });
    }

    let finalSlug = slug ? slugify(slug) : current.slug;
    const read_time = content ? estimateReadTime(content) : current.read_time;

    let formattedTags = current.tags;
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        formattedTags = JSON.stringify(tags);
      } else if (typeof tags === 'string') {
        formattedTags = JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean));
      }
    }

    if (is_featured && !current.is_featured) {
      db.prepare('UPDATE posts SET is_featured = 0 WHERE id != ?').run(id);
    }

    db.prepare(`
      UPDATE posts SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        subtitle = COALESCE(?, subtitle),
        content = COALESCE(?, content),
        cover_image = COALESCE(?, cover_image),
        category_name = COALESCE(?, category_name),
        season = COALESCE(?, season),
        read_time = ?,
        status = COALESCE(?, status),
        is_guest_post = COALESCE(?, is_guest_post),
        is_featured = COALESCE(?, is_featured),
        is_trending = COALESCE(?, is_trending),
        tags = ?,
        author_name = COALESCE(?, author_name),
        author_email = COALESCE(?, author_email),
        author_bio = COALESCE(?, author_bio),
        author_avatar = COALESCE(?, author_avatar),
        author_website = COALESCE(?, author_website),
        author_social = COALESCE(?, author_social),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title,
      finalSlug,
      subtitle,
      content,
      cover_image,
      category_name,
      season,
      read_time,
      status,
      is_guest_post !== undefined ? (is_guest_post ? 1 : 0) : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_trending !== undefined ? (is_trending ? 1 : 0) : null,
      formattedTags,
      author_name,
      author_email,
      author_bio,
      author_avatar,
      author_website,
      author_social,
      id
    );

    const updated = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/admin/posts/:id
router.delete('/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// PATCH /api/admin/posts/:id/status - Quick toggle status
router.patch('/posts/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE posts SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// PATCH /api/admin/posts/:id/featured - Toggle featured
router.patch('/posts/:id/featured', (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT is_featured FROM posts WHERE id = ?').get(id);
    const newStatus = post.is_featured ? 0 : 1;
    if (newStatus === 1) {
      db.prepare('UPDATE posts SET is_featured = 0').run();
    }
    db.prepare('UPDATE posts SET is_featured = ? WHERE id = ?').run(newStatus, id);
    res.json({ success: true, is_featured: Boolean(newStatus) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update featured' });
  }
});

// PATCH /api/admin/posts/:id/trending - Toggle trending
router.patch('/posts/:id/trending', (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT is_trending FROM posts WHERE id = ?').get(id);
    const newStatus = post.is_trending ? 0 : 1;
    db.prepare('UPDATE posts SET is_trending = ? WHERE id = ?').run(newStatus, id);
    res.json({ success: true, is_trending: Boolean(newStatus) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update trending' });
  }
});

// -------------------------------------------------------------
// GUEST SUBMISSIONS EDITORIAL HUB
// -------------------------------------------------------------

// GET /api/admin/guest-submissions
router.get('/guest-submissions', (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM guest_submissions';
    const params = [];
    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    const submissions = db.prepare(query).all(...params);
    res.json(submissions.map(s => ({
      ...s,
      tags: safeParseJSON(s.tags, [])
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guest submissions' });
  }
});

// GET /api/admin/guest-submissions/:id
router.get('/guest-submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const sub = db.prepare('SELECT * FROM guest_submissions WHERE id = ?').get(id);
    if (!sub) return res.status(404).json({ error: 'Submission not found' });
    res.json({
      ...sub,
      tags: safeParseJSON(sub.tags, [])
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// POST /api/admin/guest-submissions/:id/approve
// Approves the guest post and automatically turns it into a live published article!
router.post('/guest-submissions/:id/approve', (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, publishImmediately = true } = req.body;

    const sub = db.prepare('SELECT * FROM guest_submissions WHERE id = ?').get(id);
    if (!sub) return res.status(404).json({ error: 'Submission not found' });

    // Update submission status
    db.prepare(`
      UPDATE guest_submissions 
      SET status = 'approved', editorial_feedback = ?, reviewed_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(feedback || 'Article accepted for publication on ZAIB ATTIRE.', id);

    // Create a new post from the guest submission
    const postId = `post_guest_${Date.now()}`;
    const slug = `${slugify(sub.title)}-${Date.now().toString().slice(-4)}`;
    const read_time = estimateReadTime(sub.content);

    db.prepare(`
      INSERT INTO posts (
        id, title, slug, subtitle, content, cover_image, category_name,
        season, read_time, status, is_guest_post, is_featured, is_trending,
        tags, author_name, author_email, author_bio, author_avatar, author_website, author_social,
        guest_submission_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 1, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      postId,
      sub.title,
      slug,
      sub.pitch_summary || 'Guest editorial piece on ZAIB ATTIRE.',
      sub.content,
      sub.cover_image,
      sub.category_name,
      sub.season || 'Spring / Summer 2026',
      read_time,
      publishImmediately ? 'published' : 'draft',
      sub.tags,
      sub.author_name,
      sub.author_email,
      sub.author_bio,
      sub.author_avatar,
      sub.author_website,
      sub.author_social,
      id
    );

    res.json({
      success: true,
      message: 'Guest submission approved and live post created successfully!',
      postId,
      slug
    });
  } catch (err) {
    console.error('Approve guest submission error:', err);
    res.status(500).json({ error: 'Failed to approve submission' });
  }
});

// POST /api/admin/guest-submissions/:id/reject
router.post('/guest-submissions/:id/reject', (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    db.prepare(`
      UPDATE guest_submissions 
      SET status = 'rejected', editorial_feedback = ?, reviewed_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(feedback || 'Thank you for your pitch, but this does not fit our current editorial focus.', id);

    res.json({ success: true, message: 'Submission rejected with feedback.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject submission' });
  }
});

// DELETE /api/admin/guest-submissions/:id
router.delete('/guest-submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM guest_submissions WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// -------------------------------------------------------------
// COMMENTS MODERATION
// -------------------------------------------------------------

router.get('/comments', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT c.*, p.title as post_title, p.slug as post_slug 
      FROM comments c
      LEFT JOIN posts p ON c.post_id = p.id
      ORDER BY c.created_at DESC
    `).all();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.patch('/comments/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE comments SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

router.delete('/comments/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// -------------------------------------------------------------
// TICKER & SUBSCRIBERS
// -------------------------------------------------------------

router.get('/ticker', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM ticker_items ORDER BY sort_order ASC').all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticker items' });
  }
});

router.post('/ticker', (req, res) => {
  try {
    const { headline, tag } = req.body;
    const id = `tck_${Date.now()}`;
    db.prepare('INSERT INTO ticker_items (id, headline, tag) VALUES (?, ?, ?)').run(id, headline, tag || 'BREAKING');
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add ticker item' });
  }
});

router.delete('/ticker/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM ticker_items WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticker item' });
  }
});

router.get('/subscribers', (req, res) => {
  try {
    const subs = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

export default router;
