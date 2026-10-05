import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { syncToGoogleSheet } from '../services/googleSheets.js';

const router = express.Router();

// Helper to calculate reading time
const estimateReadTime = (content) => {
  const words = (content || '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// GET /api/guest/guidelines
router.get('/guidelines', (req, res) => {
  res.json({
    title: 'ZAIB ATTIRE Contributor & Guest Posting Codex',
    guidelines: [
      'Articles must be 100% original, authoritative, and focused on fashion, runway, craftsmanship, or style culture.',
      'We welcome fresh perspectives from independent stylists, fashion historians, subculture observers, and designers.',
      'High-resolution imagery or moodboard citations with proper photographer attribution are required.',
      'Promotional backlinking should be natural and contextual within the author bio or relevant citations.',
      'Editorial turnaround is typically 48-72 hours. Accepted submissions are formatted and published with a verified Guest Contributor badge.'
    ],
    categories: ['Haute Couture', 'Runway & Seasons', 'Street Style', 'Quiet Luxury', 'Sustainable Atelier', 'Accessories & Jewels'],
    wordCountRequirement: '800 - 2,500 words'
  });
});

// POST /api/guest/submit - Contributor submits a guest post
router.post('/submit', (req, res) => {
  try {
    const {
      title,
      pitch_summary,
      category_name,
      content,
      cover_image,
      season,
      tags,
      author_name,
      author_email,
      author_bio,
      author_website,
      author_social,
      author_avatar
    } = req.body;

    if (!title || !content || !author_name || !author_email || !category_name) {
      return res.status(400).json({ error: 'Title, content, category, author name, and author email are required.' });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `ZAIB-GUEST-${randomNum}`;
    const defaultCover = cover_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80';
    const defaultAvatar = author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author_name)}&backgroundColor=0f0f11&textColor=d4af37`;

    let formattedTags = '[]';
    if (Array.isArray(tags)) {
      formattedTags = JSON.stringify(tags);
    } else if (typeof tags === 'string') {
      formattedTags = JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean));
    }

    const stmt = db.prepare(`
      INSERT INTO guest_submissions (
        id, title, pitch_summary, category_name, content, cover_image, season,
        tags, author_name, author_email, author_bio, author_website, author_social, author_avatar, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    stmt.run(
      id,
      title.trim(),
      pitch_summary || '',
      category_name,
      content.trim(),
      defaultCover,
      season || 'Spring / Summer 2026',
      formattedTags,
      author_name.trim(),
      author_email.trim().toLowerCase(),
      author_bio || `Guest Fashion Contributor at ZAIB ATTIRE`,
      author_website || '',
      author_social || '',
      defaultAvatar
    );

    // Synchronize guest submission to Google Sheet
    syncToGoogleSheet({
      form_type: 'Guest Post Pitch',
      name: author_name.trim(),
      email: author_email.trim().toLowerCase(),
      category_or_type: category_name,
      title_or_subject: title.trim(),
      details: pitch_summary || content.trim().substring(0, 300),
      reference_id: id,
      extra_info: { website: author_website, season, tags: formattedTags }
    }).catch(e => console.error('Google sheet sync background error:', e));

    res.status(201).json({
      success: true,
      message: 'Your article has been submitted to the ZAIB ATTIRE Editorial Desk for review.',
      submissionId: id,
      tracking_id: id,
      status: 'pending'
    });
  } catch (err) {
    console.error('Guest post submission error:', err);
    res.status(500).json({ error: 'Failed to submit article. Please try again.' });
  }
});

// GET /api/guest/status/:id - Check submission review status
router.get('/status/:id', (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = (id || '').trim();
    const submission = db.prepare(`
      SELECT id, title, category_name, author_name, status, editorial_feedback, reviewed_at, created_at
      FROM guest_submissions WHERE id = ? OR UPPER(id) = UPPER(?)
    `).get(cleanId, cleanId);

    if (!submission) {
      return res.status(404).json({ error: 'Submission reference not found.' });
    }

    res.json({
      ...submission,
      tracking_id: submission.id,
      reviewer_notes: submission.editorial_feedback
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve submission status.' });
  }
});

export default router;
