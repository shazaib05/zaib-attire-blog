import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exportDir = path.join(__dirname, '..', 'public', 'exports');
const csvFilePath = path.join(exportDir, 'all_form_responses.csv');

// Ensure exports directory exists
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Initialize CSV with header row if not present
if (!fs.existsSync(csvFilePath)) {
  const header = 'Timestamp,Form Type,Name / Author,Email,Title / Subject,Category / Department,Details / Content Preview,Reference ID / Tracking,Extra Metadata\n';
  fs.writeFileSync(csvFilePath, header, 'utf-8');
}

/**
 * Get current Google Sheets Webhook URL from site settings
 */
export function getGoogleSheetsWebhookUrl() {
  try {
    const row = db.prepare('SELECT value FROM site_settings WHERE key = ?').get('google_sheets_webhook_url');
    return row ? row.value.trim() : '';
  } catch (err) {
    return '';
  }
}

/**
 * Update Google Sheets Webhook URL in site settings
 */
export function setGoogleSheetsWebhookUrl(url) {
  try {
    db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)').run('google_sheets_webhook_url', (url || '').trim());
    return true;
  } catch (err) {
    console.error('Error saving Google Sheets webhook URL:', err);
    return false;
  }
}

/**
 * Escape string for CSV output
 */
function escapeCsv(val) {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
  return `"${str}"`;
}

/**
 * Append row to local Google Sheet backup CSV
 */
function appendToLocalCsv(entry) {
  try {
    const row = [
      escapeCsv(entry.timestamp || new Date().toISOString()),
      escapeCsv(entry.form_type || 'General'),
      escapeCsv(entry.name || entry.author_name || entry.contact_name || ''),
      escapeCsv(entry.email || entry.author_email || ''),
      escapeCsv(entry.title_or_subject || entry.title || entry.subject || ''),
      escapeCsv(entry.category_or_type || entry.category_name || entry.department || entry.campaign_type || ''),
      escapeCsv(entry.details || entry.pitch_summary || entry.message || entry.brief || ''),
      escapeCsv(entry.reference_id || entry.tracking_id || entry.id || ''),
      escapeCsv(entry.extra_info ? JSON.stringify(entry.extra_info) : '')
    ].join(',') + '\n';

    fs.appendFileSync(csvFilePath, row, 'utf-8');
  } catch (err) {
    console.error('Failed to append to local CSV:', err);
  }
}

/**
 * Synchronize form response to Google Sheet via Webhook (Google Apps Script)
 * Also writes to local backup CSV so zero responses are ever lost.
 */
export async function syncToGoogleSheet(formData) {
  const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
  const normalizedData = {
    timestamp,
    form_type: formData.form_type || 'Website Submission',
    name: formData.name || formData.author_name || formData.contact_name || formData.brand_name || 'Anonymous',
    email: formData.email || formData.author_email || 'N/A',
    category_or_type: formData.category_or_type || formData.category_name || formData.department || formData.campaign_type || 'General',
    title_or_subject: formData.title_or_subject || formData.title || formData.subject || 'N/A',
    details: formData.details || formData.pitch_summary || formData.message || formData.brief || formData.content?.substring(0, 300) || '',
    reference_id: formData.reference_id || formData.tracking_id || formData.id || '',
    extra_info: formData.extra_info || {}
  };

  // 1. Always append to local CSV export
  appendToLocalCsv(normalizedData);

  // 2. Transmit to Google Sheet Webhook if configured
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (!webhookUrl) {
    console.log(`[GoogleSheetsSync] Form "${normalizedData.form_type}" saved locally. (No Google Sheets Webhook URL configured yet)`);
    return { synced: false, reason: 'No webhook configured', data: normalizedData };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedData),
      redirect: 'follow'
    });

    const isSuccess = res.ok;
    console.log(`[GoogleSheetsSync] Successfully transmitted "${normalizedData.form_type}" to Google Sheet (Status: ${res.status})`);
    return { synced: isSuccess, status: res.status, data: normalizedData };
  } catch (err) {
    console.warn(`[GoogleSheetsSync] Failed to reach Google Sheet webhook: ${err.message}. Data preserved in local CSV.`);
    return { synced: false, error: err.message, data: normalizedData };
  }
}

/**
 * Send a verification test row to Google Sheet
 */
export async function sendTestRowToGoogleSheet() {
  const webhookUrl = getGoogleSheetsWebhookUrl();
  if (!webhookUrl) {
    throw new Error('Please enter a Google Sheets Webhook URL first.');
  }

  const testPayload = {
    form_type: 'VERIFICATION TEST',
    name: 'ZAIB ATTIRE System Test',
    email: 'admin@zaibattire.com',
    category_or_type: 'System Diagnostics',
    title_or_subject: 'Connection Test to Google Sheet',
    details: 'This test verification confirms that your Google Sheet is actively receiving live form submissions from ZAIB ATTIRE.',
    reference_id: `TEST-${Date.now().toString().slice(-4)}`,
    extra_info: { ping: 'pong', verified_at: new Date().toISOString() }
  };

  return await syncToGoogleSheet(testPayload);
}

/**
 * Get all recent responses for the admin dashboard
 */
export function getRecentFormResponses() {
  const responses = [];

  try {
    // 1. Recent guest submissions
    const guests = db.prepare('SELECT id, title, category_name, author_name, author_email, pitch_summary, status, created_at FROM guest_submissions ORDER BY created_at DESC LIMIT 10').all();
    for (const g of guests) {
      responses.push({
        id: g.id,
        type: 'Guest Post Pitch',
        name: g.author_name,
        email: g.author_email,
        title: g.title,
        category: g.category_name,
        details: g.pitch_summary || 'Guest submission article',
        reference_id: g.id,
        created_at: g.created_at
      });
    }

    // 2. Recent ad inquiries
    const ads = db.prepare('SELECT * FROM ad_inquiries ORDER BY created_at DESC LIMIT 10').all();
    for (const a of ads) {
      responses.push({
        id: a.id,
        type: 'Advertising Inquiry',
        name: `${a.contact_name} (${a.brand_name})`,
        email: a.email,
        title: a.campaign_type,
        category: a.budget_range,
        details: a.brief || 'Media kit inquiry',
        reference_id: a.id,
        created_at: a.created_at
      });
    }

    // 3. Recent contact messages
    const contacts = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 10').all();
    for (const c of contacts) {
      responses.push({
        id: c.id,
        type: 'Contact Dispatch',
        name: c.name,
        email: c.email,
        title: c.subject,
        category: c.department,
        details: c.message,
        reference_id: c.id,
        created_at: c.created_at
      });
    }

    // 4. Recent newsletter subscribers
    const subs = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 10').all();
    for (const s of subs) {
      responses.push({
        id: s.id,
        type: 'Newsletter Subscriber',
        name: 'VIP Reader',
        email: s.email,
        title: 'Atelier Circle Subscription',
        category: 'Fashion Insider',
        details: 'Weekly runway digest subscriber',
        reference_id: s.id,
        created_at: s.created_at
      });
    }

    // Sort by created_at DESC
    responses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (err) {
    console.error('Error compiling recent form responses:', err);
  }

  return responses;
}
