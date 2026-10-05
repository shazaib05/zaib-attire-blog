import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'fashion_editorial.db');
const db = new DatabaseSync(dbPath);

console.log('Synchronizing brand identity to ZAIB ATTIRE...');

db.prepare("UPDATE site_settings SET value = 'ZAIB ATTIRE' WHERE key = 'site_title'").run();
db.prepare("UPDATE site_settings SET value = 'The Haute Editorial of Contemporary Runway & Fashion Culture' WHERE key = 'site_tagline'").run();
db.prepare("UPDATE site_settings SET value = 'editorial@zaibattire.com' WHERE key = 'contact_email'").run();
db.prepare("UPDATE site_settings SET value = '@zaibattire_official' WHERE key = 'instagram_handle'").run();

// Update users
db.prepare("UPDATE users SET bio = replace(bio, 'MODA ÉTOILE', 'ZAIB ATTIRE'), email = replace(email, 'modaetoile.com', 'zaibattire.com'), website = 'https://zaibattire.com'").run();

// Update posts
db.prepare("UPDATE posts SET author_bio = replace(author_bio, 'MODA ÉTOILE', 'ZAIB ATTIRE'), author_email = replace(author_email, 'modaetoile.com', 'zaibattire.com'), author_website = replace(author_website, 'modaetoile.com', 'zaibattire.com')").run();
db.prepare("UPDATE posts SET subtitle = replace(subtitle, 'MODA ÉTOILE', 'ZAIB ATTIRE')").run();

// Update guest submissions
db.prepare("UPDATE guest_submissions SET author_bio = replace(author_bio, 'MODA ÉTOILE', 'ZAIB ATTIRE')").run();

console.log('✅ Updated settings:');
console.log(db.prepare("SELECT * FROM site_settings").all());

console.log('✅ Admin user:');
console.log(db.prepare("SELECT email, bio, website FROM users").all());
