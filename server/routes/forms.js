import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db } from '../db.js';
import {
  getGoogleSheetsWebhookUrl,
  setGoogleSheetsWebhookUrl,
  syncToGoogleSheet,
  sendTestRowToGoogleSheet,
  getRecentFormResponses
} from '../services/googleSheets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvFilePath = path.join(__dirname, '..', 'public', 'exports', 'all_form_responses.csv');

const router = express.Router();

// Ready-to-copy Google Apps Script code snippet
const GOOGLE_APPS_SCRIPT_TEMPLATE = `
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Form Type",
        "Name / Author / Brand",
        "Email",
        "Title / Subject",
        "Category / Department / Budget",
        "Details / Message / Brief",
        "Reference ID / Tracking Code"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#d4af37").setFontColor("#000000");
    }

    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.form_type || "Form Submission",
      data.name || "",
      data.email || "",
      data.title_or_subject || "",
      data.category_or_type || "",
      data.details || "",
      data.reference_id || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Row added to Google Sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`.trim();

// POST /api/forms/advertise - Submit Brand Advertising / Media Kit inquiry
router.post('/advertise', async (req, res) => {
  try {
    const {
      brand_name,
      contact_name,
      email,
      website,
      campaign_type,
      budget_range,
      launch_date,
      brief
    } = req.body;

    if (!brand_name || !contact_name || !email) {
      return res.status(400).json({ error: 'Brand name, contact person name, and email are required.' });
    }

    const id = `AD-${Date.now().toString().slice(-4)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // 1. Save to SQLite database
    const stmt = db.prepare(`
      INSERT INTO ad_inquiries (
        id, brand_name, contact_name, email, website, campaign_type,
        budget_range, launch_date, brief, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    stmt.run(
      id,
      brand_name.trim(),
      contact_name.trim(),
      email.trim().toLowerCase(),
      website || '',
      campaign_type || 'Leaderboard Billboard',
      budget_range || 'Standard',
      launch_date || '',
      brief || ''
    );

    // 2. Synchronize to Google Sheet in real time
    const sheetSync = await syncToGoogleSheet({
      form_type: 'Advertising Inquiry',
      name: `${contact_name.trim()} (${brand_name.trim()})`,
      email: email.trim().toLowerCase(),
      category_or_type: budget_range || 'Ad Package',
      title_or_subject: campaign_type || 'Advertising Placement',
      details: brief || 'Requested Media Kit & Campaign reservation',
      reference_id: id,
      extra_info: { website, launch_date }
    });

    res.status(201).json({
      success: true,
      message: 'Your advertising partnership inquiry has been received and recorded.',
      inquiry_id: id,
      synced_to_sheet: sheetSync.synced
    });
  } catch (err) {
    console.error('Advertising inquiry submission error:', err);
    res.status(500).json({ error: 'Failed to process inquiry. Please try again.' });
  }
});

// POST /api/forms/contact - Submit Editorial Contact / Dispatch
router.post('/contact', async (req, res) => {
  try {
    const { name, email, department, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const id = `MSG-${Date.now().toString().slice(-4)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // 1. Save to SQLite database
    const stmt = db.prepare(`
      INSERT INTO contact_messages (
        id, name, email, department, subject, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'unread')
    `);

    stmt.run(
      id,
      name.trim(),
      email.trim().toLowerCase(),
      department || 'Editorial Desk',
      subject || 'General Inquiry',
      message.trim()
    );

    // 2. Synchronize to Google Sheet in real time
    const sheetSync = await syncToGoogleSheet({
      form_type: 'Contact Dispatch',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category_or_type: department || 'Editorial Desk',
      title_or_subject: subject || 'Direct Message',
      details: message.trim(),
      reference_id: id
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received by the editorial bureau.',
      dispatch_id: id,
      synced_to_sheet: sheetSync.synced
    });
  } catch (err) {
    console.error('Contact form submission error:', err);
    res.status(500).json({ error: 'Failed to transmit message. Please try again.' });
  }
});

// GET /api/forms/google-sheets/config - Get Google Sheets integration settings
router.get('/google-sheets/config', (req, res) => {
  const webhookUrl = getGoogleSheetsWebhookUrl();
  const responses = getRecentFormResponses();

  res.json({
    webhook_url: webhookUrl,
    is_connected: Boolean(webhookUrl && webhookUrl.startsWith('https://script.google.com')),
    apps_script_template: GOOGLE_APPS_SCRIPT_TEMPLATE,
    recent_responses_count: responses.length,
    recent_responses: responses.slice(0, 15)
  });
});

// POST /api/forms/google-sheets/config - Save Google Sheets Webhook URL
router.post('/google-sheets/config', (req, res) => {
  try {
    const { webhook_url } = req.body;
    const cleanUrl = (webhook_url || '').trim();

    setGoogleSheetsWebhookUrl(cleanUrl);

    res.json({
      success: true,
      webhook_url: cleanUrl,
      is_connected: Boolean(cleanUrl && cleanUrl.startsWith('https://script.google.com')),
      message: cleanUrl ? 'Google Sheets Webhook URL configured successfully!' : 'Webhook URL cleared.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update Google Sheets configuration' });
  }
});

// POST /api/forms/google-sheets/test - Send verification test row to Google Sheet
router.post('/google-sheets/test', async (req, res) => {
  try {
    const result = await sendTestRowToGoogleSheet();
    res.json({
      success: true,
      message: 'Test row successfully sent to your Google Sheet! Check your Google Sheet to verify the new row.',
      result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to ping Google Sheet.'
    });
  }
});

// GET /api/forms/export/csv - Download cumulative responses CSV
router.get('/export/csv', (req, res) => {
  try {
    if (fs.existsSync(csvFilePath)) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="ZAIB_ATTIRE_Form_Responses.csv"');
      fs.createReadStream(csvFilePath).pipe(res);
    } else {
      res.status(404).json({ error: 'No export data available yet.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

export default router;
