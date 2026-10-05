import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'fashion_editorial.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      avatar TEXT,
      bio TEXT,
      website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      cover_image TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitle TEXT,
      content TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      category_id TEXT,
      category_name TEXT,
      season TEXT,
      read_time TEXT DEFAULT '4 min read',
      status TEXT DEFAULT 'published', -- 'published', 'draft', 'pending_review', 'rejected'
      is_guest_post INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      tags TEXT, -- JSON array of strings
      author_name TEXT NOT NULL,
      author_email TEXT,
      author_bio TEXT,
      author_avatar TEXT,
      author_website TEXT,
      author_social TEXT,
      guest_submission_id TEXT,
      editorial_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guest_submissions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      pitch_summary TEXT,
      category_name TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT,
      season TEXT,
      tags TEXT,
      author_name TEXT NOT NULL,
      author_email TEXT NOT NULL,
      author_bio TEXT,
      author_website TEXT,
      author_social TEXT,
      author_avatar TEXT,
      status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      editorial_feedback TEXT,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_email TEXT,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'approved', -- 'approved', 'pending'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ticker_items (
      id TEXT PRIMARY KEY,
      headline TEXT NOT NULL,
      tag TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ad_inquiries (
      id TEXT PRIMARY KEY,
      brand_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      website TEXT,
      campaign_type TEXT,
      budget_range TEXT,
      launch_date TEXT,
      brief TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDataIfEmpty();
}

function seedDataIfEmpty() {
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCheck.count > 0) return;

  console.log('✨ Seeding initial luxury fashion database...');

  // Default Admin User
  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, avatar, bio, website)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'usr_admin_01',
    'Camille de Valois',
    'admin@zaibattire.com',
    'admin123', // Demo admin password
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'Editor-in-Chief at ZAIB ATTIRE. Former Paris Fashion Week critic and luxury trend forecaster.',
    'https://zaibattire.com'
  );

  // Categories
  const categories = [
    {
      id: 'cat_haute_couture',
      name: 'Haute Couture',
      slug: 'haute-couture',
      description: 'Exclusive custom-fitted high fashion directly from Paris and Milan ateliers.',
      cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      sort_order: 1
    },
    {
      id: 'cat_runway',
      name: 'Runway & Seasons',
      slug: 'runway-seasons',
      description: 'Front-row analysis and seasonal breakdowns from the Big Four fashion weeks.',
      cover_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      sort_order: 2
    },
    {
      id: 'cat_street_style',
      name: 'Street Style',
      slug: 'street-style',
      description: 'Metropolitan street aesthetics, oversized tailored chic, and urban avant-garde.',
      cover_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      sort_order: 3
    },
    {
      id: 'cat_quiet_luxury',
      name: 'Quiet Luxury',
      slug: 'quiet-luxury',
      description: 'Understated elegance, artisanal cashmere, neutral tones, and timeless tailoring.',
      cover_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
      sort_order: 4
    },
    {
      id: 'cat_sustainable',
      name: 'Sustainable Atelier',
      slug: 'sustainable-atelier',
      description: 'Circular couture, organic deadstock silks, and ethical luxury innovations.',
      cover_image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      sort_order: 5
    },
    {
      id: 'cat_accessories',
      name: 'Accessories & Jewels',
      slug: 'accessories-jewels',
      description: 'Sculptural bags, archival vintage jewelry, and runway statement footwear.',
      cover_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      sort_order: 6
    }
  ];

  const catStmt = db.prepare('INSERT INTO categories (id, name, slug, description, cover_image, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
  for (const cat of categories) {
    catStmt.run(cat.id, cat.name, cat.slug, cat.description, cat.cover_image, cat.sort_order);
  }

  // Ticker items
  const tickerItems = [
    { id: 'tck_1', headline: 'PARIS HAUTE COUTURE WEEK: DRAMATIC SCULPTURAL SILHOUETTES CAPTIVATE FRONT ROW', tag: 'BREAKING', sort_order: 1 },
    { id: 'tck_2', headline: 'SPRING/SUMMER 2026 FORECAST: THE ASCENT OF TRANSPARENT SILK ORGANZA & BUTTER YELLOW', tag: 'TREND REPORT', sort_order: 2 },
    { id: 'tck_3', headline: 'GUEST VOICES: HOW INDEPENDENT ATELIERS ARE DISRUPTING HERITAGE LUXURY HOUSES', tag: 'EXCLUSIVE', sort_order: 3 },
    { id: 'tck_4', headline: 'MILAN DIARIES: REFINED LEATHER CRAFTSMANSHIP MEETS FLUID GENDERLESS TAILORING', tag: 'RUNWAY', sort_order: 4 },
  ];
  const tickerStmt = db.prepare('INSERT INTO ticker_items (id, headline, tag, sort_order) VALUES (?, ?, ?, ?)');
  for (const t of tickerItems) {
    tickerStmt.run(t.id, t.headline, t.tag, t.sort_order);
  }

  // Site Settings
  const settings = [
    { key: 'site_title', value: 'ZAIB ATTIRE' },
    { key: 'site_tagline', value: 'The Haute Editorial of Contemporary Runway & Fashion Culture' },
    { key: 'editor_in_chief', value: 'Camille de Valois' },
    { key: 'editorial_quote', value: 'Fashion is not merely what we drape upon the body; it is the visual cadence of modern thought, ambition, and artistic rebellion.' },
    { key: 'guest_posting_enabled', value: 'true' },
    { key: 'contact_email', value: 'editorial@zaibattire.com' },
    { key: 'instagram_handle', value: '@zaibattire_official' }
  ];
  const settStmt = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
  for (const s of settings) {
    settStmt.run(s.key, s.value);
  }

  // Posts
  const posts = [
    {
      id: 'post_01',
      title: 'Architectural Drapery: How Sculptural Haute Couture is Redefining 2026 Runways',
      slug: 'architectural-drapery-haute-couture-2026',
      subtitle: 'From Daniel Roseberry at Schiaparelli to Parisian independent ateliers, garments are becoming wearable monuments.',
      category_id: 'cat_haute_couture',
      category_name: 'Haute Couture',
      season: 'Spring / Summer 2026',
      read_time: '6 min read',
      status: 'published',
      is_guest_post: 0,
      is_featured: 1, // Main Hero Showcase
      is_trending: 1,
      views: 3840,
      likes: 245,
      tags: JSON.stringify(['Schiaparelli', 'Haute Couture', 'Sculptural Fashion', 'Paris Fashion Week', 'Atelier']),
      cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
      author_name: 'Camille de Valois',
      author_email: 'admin@modaetoile.com',
      author_bio: 'Editor-in-Chief at MODA ÉTOILE. Paris Fashion Week correspondent and luxury trend forecaster.',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      author_website: 'https://modaetoile.com',
      author_social: '@camille_valois',
      content: `## The Renaissance of Structural Form

In an era dominated by rapid algorithm-driven aesthetics, haute couture has retreated into its purest sanctuary: unapologetic, sculptural gravity. This season's runways in Paris proved that the silhouette is no longer obedient to the contours of anatomy—rather, fabric is treated like Carrara marble, engineered to hold impossible arches and cascading folds.

### The Return of Heavy Silk Radzimir & Molded Corsetry

At Schiaparelli and Iris van Herpen, we witnessed garments that defy wind and gravity. Tailors are resurrecting archival techniques pioneered by Cristóbal Balenciaga in the late 1950s, using bonded silks, horsehair interlinings, and carbon-reinforced stays.

> "A dress must not merely fit the woman; it must construct a sovereign territory around her presence." — *Atelier Archive Notes, Place Vendôme*

### Why the Trend is Sweeping Prêt-à-Porter

While these structural masterpieces begin on the private runways of Avenue Montaigne, their architectural DNA is rapidly filtering into ready-to-wear:
- **Exaggerated Shoulder Architecture**: Sharp, pagoda-style lines replacing traditional padded blazers.
- **Cocoon Peplums**: Dramatic volume around the hips rendered in stiffened moiré.
- **Curved Hemlines**: Asymmetrical knife-edge cuts that move with deliberate kinetic tempo.

Whether worn at gala occasions or translated into dramatic evening tailoring, architectural drapery is a defiant statement of artistic permanence in an ephemeral digital age.`
    },
    {
      id: 'post_02',
      title: 'The Evolution of Quiet Luxury: Why Muted Tactility Beats Loud Logos Every Time',
      slug: 'evolution-of-quiet-luxury-muted-tactility',
      subtitle: 'The second wave of quiet luxury is not boring beige—it is raw cashmere, untreated linen, and sensory opulence.',
      category_id: 'cat_quiet_luxury',
      category_name: 'Quiet Luxury',
      season: 'Fall / Winter 2026',
      read_time: '5 min read',
      status: 'published',
      is_guest_post: 0,
      is_featured: 0,
      is_trending: 1,
      views: 2910,
      likes: 184,
      tags: JSON.stringify(['Minimalism', 'The Row', 'Loro Piana', 'Cashmere', 'Quiet Luxury']),
      cover_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
      author_name: 'Camille de Valois',
      author_email: 'admin@modaetoile.com',
      author_bio: 'Editor-in-Chief at MODA ÉTOILE. Paris Fashion Week correspondent.',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      author_website: 'https://modaetoile.com',
      author_social: '@camille_valois',
      content: `## Beyond the Sea of Beige

When the "Quiet Luxury" wave first conquered editorial pages, critics predicted it would quickly devolve into sterile minimalism. They were mistaken. What we are seeing in late 2026 is an enriched iteration: **Sensory Maximalism hidden within Minimalist Shapes**.

### The Anatomy of Silent Elegance

True connoisseurs don't look for monogram prints; they look for the tension of hand-stitched pick seams and double-faced vicuña wool.

- **Weightless Warmth**: Unlined double-cashmere coats that drape like dressing gowns.
- **Subtle Earthy Palettes**: Slate gray, raw umber, bitter chocolate, and salted cream.
- **The Whisper of Craft**: Polished horn buttons, unseen silk-bound armholes, and artisanal millings from Biella, Italy.

When your wardrobe relies on pure fabric integrity, confidence shifts from looking expensive to feeling utterly serene.`
    },
    {
      id: 'post_03',
      title: 'Street Style Matrix: Tokyo to Milan — The Oversized Tailoring Phenomenon',
      slug: 'street-style-matrix-tokyo-milan-oversized-tailoring',
      subtitle: 'Guest Contributor Julian Vance breaks down how street fashion tastemakers are dismantling rigid formalwear.',
      category_id: 'cat_street_style',
      category_name: 'Street Style',
      season: 'Resort 2026',
      read_time: '7 min read',
      status: 'published',
      is_guest_post: 1, // GUEST POST DEMO
      is_featured: 0,
      is_trending: 1,
      views: 1850,
      likes: 129,
      tags: JSON.stringify(['Streetwear', 'Tokyo Fashion', 'Harajuku', 'Tailoring', 'Guest Article']),
      cover_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      author_name: 'Julian Vance',
      author_email: 'julian.vance@fashionpress.co',
      author_bio: 'Guest Contributor & Street Culture Photographer based between Tokyo and Berlin.',
      author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      author_website: 'https://julianvance.photo',
      author_social: '@julianvance_lens',
      content: `## The Sidewalk as the Ultimate Runway

*(Guest Contribution)*

Nowhere is the dialogue between runway fantasy and real-world expression more vibrant than on the pavement outside fashion week venues. Over the past three seasons, the defining garment of urban elegance has shifted decisively from sneakers to **subversive power suits**.

### The Harajuku-Milan Nexus

In Tokyo's Shibuya crossing and Milan's Via Montenapoleone, the formula is clear:
1. **Four-button double-breasted jackets** bought two sizes too large.
2. **Puddle trousers** pooling nonchalantly over pointed-toe loafers or platform boots.
3. **Contrast Layering**: Wearing an ultra-fine ribbed silk tank under an imposing worsted wool coat.

The oversized silhouette provides an armor against city chaos while whispering effortless nonchalance. It is tailoring liberated from the corporate boardroom.`
    },
    {
      id: 'post_04',
      title: 'Sustainable Silks & Biotech Leather: Inside the Ethical Couture Revolution',
      slug: 'sustainable-silks-biotech-leather-ethical-couture',
      subtitle: 'How lab-grown mycelium and cruelty-free peace silk are changing luxury houses from the roots up.',
      category_id: 'cat_sustainable',
      category_name: 'Sustainable Atelier',
      season: 'Spring / Summer 2026',
      read_time: '4 min read',
      status: 'published',
      is_guest_post: 0,
      is_featured: 0,
      is_trending: 0,
      views: 1220,
      likes: 98,
      tags: JSON.stringify(['Sustainability', 'Biotech', 'Mycelium', 'Cruelty Free', 'Innovation']),
      cover_image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
      author_name: 'Elena Rostova',
      author_email: 'elena@modaetoile.com',
      author_bio: 'Senior Materials Editor and Sustainable Textile Researcher.',
      author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      author_website: 'https://modaetoile.com',
      author_social: '@elena_textiles',
      content: `## The Future of Luxury is Bio-Fabricated

For decades, the luxury sector claimed that synthetic alternatives could never match the hand-feel and patina of calfskin or mulberry silk. That barrier has now dissolved.

Leading ateliers are collaborating with bio-engineers to produce mycelium mushroom hides that age with equal nobility to Tuscan bridle leather. Meanwhile, cellular silk farms in Switzerland yield gossamer filaments with tensile strength greater than steel, without harming a single silkworm.

Luxury in 2026 is no longer defined by rarity through exploitation—it is defined by genius, stewardship, and ecological reverence.`
    },
    {
      id: 'post_05',
      title: 'Sculptural Footwear & The Return of Architectural Heels',
      slug: 'sculptural-footwear-architectural-heels',
      subtitle: 'Loewe, Alaïa, and Jacquemus prove that shoes are this year’s most collectible modern art.',
      category_id: 'cat_accessories',
      category_name: 'Accessories & Jewels',
      season: 'Fall / Winter 2026',
      read_time: '5 min read',
      status: 'published',
      is_guest_post: 0,
      is_featured: 0,
      is_trending: 0,
      views: 1420,
      likes: 112,
      tags: JSON.stringify(['Shoes', 'Alaïa', 'Footwear', 'Accessories', 'Runway']),
      cover_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      author_name: 'Camille de Valois',
      author_email: 'admin@modaetoile.com',
      author_bio: 'Editor-in-Chief at MODA ÉTOILE.',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      author_website: 'https://modaetoile.com',
      author_social: '@camille_valois',
      content: `## Footwear as Kinetic Sculpture

Step away from conventional stilettos. The accessories conversation is currently dominated by heels sculpted into brass globes, cantilevered arches, and molten metallic drips.

Alaïa's mesh ballet flats and Loewe's surrealist heels have transformed shoes into conversation starters that anchor minimalist monochrome ensembles. When your footwear carries museum-worthy lines, the rest of your outfit can speak in an elegant murmur.`
    }
  ];

  const postStmt = db.prepare(`
    INSERT INTO posts (
      id, title, slug, subtitle, content, cover_image, category_id, category_name,
      season, read_time, status, is_guest_post, is_featured, is_trending, views, likes,
      tags, author_name, author_email, author_bio, author_avatar, author_website, author_social
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of posts) {
    postStmt.run(
      p.id, p.title, p.slug, p.subtitle, p.content, p.cover_image, p.category_id, p.category_name,
      p.season, p.read_time, p.status, p.is_guest_post, p.is_featured, p.is_trending, p.views, p.likes,
      p.tags, p.author_name, p.author_email, p.author_bio, p.author_avatar, p.author_website, p.author_social
    );
  }

  // Seed sample guest submissions (One Pending, One Approved, One Rejected)
  // This allows the user to immediately experience the Guest Post Moderation Workflow!
  const guestSubmissions = [
    {
      id: 'gsub_01',
      title: 'Metallic Renaissance: Why Liquid Silver & Chrome are Dominating Gala Evenings',
      pitch_summary: 'An exploration of how space-age silver lame and chrome chainmail are replacing traditional gold on red carpets.',
      category_name: 'Haute Couture',
      season: 'Spring / Summer 2026',
      tags: JSON.stringify(['Silver', 'Met Gala', 'Eveningwear', 'Liquid Fabric']),
      cover_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      author_name: 'Sabrina Fontaine',
      author_email: 'sabrina.fontaine@voguereview.fr',
      author_bio: 'Fashion historian and freelance Parisian stylist with a passion for 1970s Paco Rabanne.',
      author_website: 'https://sabrinafontaine.com',
      author_social: '@sabrina_couture',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'pending', // READY FOR ADMIN TO REVIEW & APPROVE!
      editorial_feedback: null,
      content: `## The Gleam of Modern Alchemy

Gold has had its century. Today's most arresting evening silhouettes are drenched in liquid mercury, polished palladium, and shimmering silver lurex.

From Beyoncé's metallic stadium tour armor to Florence Pugh's backless chrome chainmail, reflective textiles offer something gold cannot: a cool, futuristic aura of invulnerability.

### Fabric Innovation in High Polish

Traditional metallic brocades were notoriously stiff and scratchy. In 2026, Japanese mills have perfected micron-thin aluminum vaporization onto silk georgette, resulting in fabrics that flow like water while reflecting every photographer's flashbulb.

For the modern woman stepping into the spotlight, silver is not second place—it is sovereign.`
    },
    {
      id: 'gsub_02',
      title: 'The Neo-Romantic Corset: Historical Deconstruction in London Youth Culture',
      pitch_summary: 'Deconstructed corsetry paired with distressed denim and combat boots in East London.',
      category_name: 'Street Style',
      season: 'Fall / Winter 2026',
      tags: JSON.stringify(['Corsetry', 'East London', 'Punk', 'Deconstruction']),
      cover_image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      author_name: 'Liam Sterling',
      author_email: 'liam.sterling@culturebeat.co.uk',
      author_bio: 'London-based subculture writer and Central Saint Martins alumnus.',
      author_website: 'https://liamsterling.co.uk',
      author_social: '@sterling_london',
      author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      status: 'pending', // ANOTHER PENDING ONE TO TEST!
      editorial_feedback: null,
      content: `## Rebellion Boned in Steel

East London streets are witnessing an audacious collision: historical Regency corsetry stripped of its constrictive past and worn as an external symbol of defiance.

Young designers are upcycling antique stays with raw canvas edges, visible metal grommets, and pairing them with vintage military cargos.`
    }
  ];

  const gsubStmt = db.prepare(`
    INSERT INTO guest_submissions (
      id, title, pitch_summary, category_name, content, cover_image, season, tags,
      author_name, author_email, author_bio, author_website, author_social, author_avatar, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const gs of guestSubmissions) {
    gsubStmt.run(
      gs.id, gs.title, gs.pitch_summary, gs.category_name, gs.content, gs.cover_image, gs.season, gs.tags,
      gs.author_name, gs.author_email, gs.author_bio, gs.author_website, gs.author_social, gs.author_avatar, gs.status
    );
  }

  // Comments
  const comments = [
    {
      id: 'cmt_01',
      post_id: 'post_01',
      author_name: 'Margot Laurent',
      author_email: 'margot@parisfashion.fr',
      content: 'This analysis of Schiaparelli’s architectural structure is breathtaking. You truly captured the sculptural renaissance happening in Paris this season.',
      status: 'approved'
    },
    {
      id: 'cmt_02',
      post_id: 'post_02',
      author_name: 'David Sterling',
      author_email: 'david@atelierdesign.com',
      content: 'Finally an article that distinguishes sensory quality from superficial minimalism. The touch of raw vicuña is truly unmatched.',
      status: 'approved'
    }
  ];
  const cmtStmt = db.prepare('INSERT INTO comments (id, post_id, author_name, author_email, content, status) VALUES (?, ?, ?, ?, ?, ?)');
  for (const c of comments) {
    cmtStmt.run(c.id, c.post_id, c.author_name, c.author_email, c.content, c.status);
  }

  // Newsletter subscribers
  db.prepare('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)').run('sub_01', 'claire.vogue@fashionista.com');
  db.prepare('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)').run('sub_02', 'editorial@harperspreview.org');

  console.log('✅ Database successfully initialized and seeded with luxury editorial content!');
}

export { db };
