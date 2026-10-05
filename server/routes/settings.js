import express from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { syncToGoogleSheet } from '../services/googleSheets.js';

const router = express.Router();

// GET /api/settings - Public site info & active ticker
router.get('/', (req, res) => {
  try {
    const rawSettings = db.prepare('SELECT key, value FROM site_settings').all();
    const settings = {};
    for (const s of rawSettings) {
      settings[s.key] = s.value;
    }

    const tickerItems = db.prepare('SELECT * FROM ticker_items WHERE is_active = 1 ORDER BY sort_order ASC').all();

    res.json({
      settings,
      tickerItems
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST /api/settings/newsletter - Subscribe reader to VIP Atelier newsletter
router.post('/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed to the Atelier Circle!' });
    }

    const id = `sub_${Date.now()}`;
    db.prepare('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)').run(id, cleanEmail);

    // Synchronize newsletter subscriber to Google Sheet
    syncToGoogleSheet({
      form_type: 'Newsletter Subscriber',
      name: 'VIP Atelier Member',
      email: cleanEmail,
      category_or_type: 'Atelier Circle',
      title_or_subject: 'Newsletter Subscription',
      details: 'Subscribed to weekly runway chronicles and couture updates',
      reference_id: id
    }).catch(e => console.error('Google sheet sync background error:', e));

    res.status(201).json({ success: true, message: 'Welcome to the Atelier Circle. You will receive private runway dispatches.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// PUT /api/settings/update - Admin update site settings
router.put('/update', (req, res) => {
  try {
    const updates = req.body; // e.g. { site_title: "...", site_tagline: "..." }
    const stmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
    for (const [key, val] of Object.entries(updates)) {
      stmt.run(key, String(val));
    }
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
