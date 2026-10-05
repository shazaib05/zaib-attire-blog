# 👑 ZAIB ATTIRE — Haute Couture, Runway Trends & Guest Editorial Platform

A luxury, high-fashion editorial blog platform with a **self-hosted embedded database backend (native `node:sqlite`)**, an **exclusive Guest Posting & Contributor review workflow**, and an **All-in-One Admin Atelier Dashboard** to manage all publishing, moderation, and runway trends.

---

## ✨ Highlights & Features

### 🌟 1. Premium Haute Couture Aesthetic
- **Editorial Typography & Palette**: Styled with *Cinzel*, *Playfair Display*, *Cormorant Garamond*, and *Plus Jakarta Sans*, accented with Champagne Gold (`#d4af37`), Onyx Black, and warm alabaster.
- **Breaking Runway Ticker**: Live marquee broadcasting real-time dispatches from Paris, Milan, London, and New York fashion weeks.
- **Hero Cover Story**: Large-format editorial magazine showcase with reading times, season badges, view counts, and applauds.
- **Editorial Ranking Strip**: Weekly top 4 most-read articles with monumental ranking typography (`01`, `02`, `03`, `04`).
- **Fashion Season & Category Filters**: Filter by *Haute Couture*, *Runway & Seasons*, *Street Style*, *Quiet Luxury*, *Sustainable Atelier*, *Accessories*, and seasons (*Spring/Summer 2026*, *Fall/Winter 2026*, *Resort 2026*).
- **Immersive Article Reader**: Markdown formatting, blockquotes, author showcase bio cards, social sharing with clipboard copy, applauds/likes, and reader critiques discussion dialogue.
- **VIP Atelier Newsletter**: Interactive subscription with database storage.

### ✍️ 2. Full Guest Posting & Contributor Workflow
- **"Write For Us" Dedicated Portal**:
  - Step-by-step submission form for guest stylists, fashion critics, and writers.
  - Title, Pitch summary, Category, Fashion Season, and Cover Image selection (with curated Unsplash runway presets or custom URL).
  - Rich manuscript body with Markdown support.
  - Complete author attribution credentials: Full Name, Editorial Email, Bio, Website/Portfolio (do-follow backlink), and Social Handles.
- **Submission Tracking Portal**:
  - Contributors receive a unique tracking reference (e.g. `gsub_01` or generated ID).
  - Authors can track their submission status (*Under Editorial Review*, *Accepted & Published*, or *Not Selected* with custom feedback notes from the editor).

### 🏛️ 3. All-in-One Admin Atelier Dashboard ("Do Everything From This")
- **Dashboard Overview & Analytics**: Live KPIs for total articles, published vs drafts, pending guest reviews, total readership views, applauds, comments, category distribution, and top-read articles.
- **Guest Submissions Review Desk**:
  - View all contributor pitches with status filters (`all`, `pending`, `approved`, `rejected`).
  - Read full submitted manuscript and author credentials.
  - **One-Click "Approve & Publish Live"**: Automatically creates and publishes the article to the live magazine with verified guest author badges.
  - **Reject with Custom Feedback Note**: Provide constructive feedback to the writer.
  - Delete submissions.
- **All Articles Management**:
  - Search, filter by category and status.
  - Quick toggle between `published` and `draft`.
  - Quick toggle for `★ Hero Cover Story` and `Trending`.
  - Delete or edit any story.
- **Rich Story Composer**:
  - Write new articles with custom slugs, categories, seasons, cover image presets, markdown body, author selection, and hero toggles.
- **Categories & Runway Ticker Manager**:
  - Add new fashion categories with descriptions.
  - Add/remove breaking ticker items running across the top of the magazine.
- **Reader Critique Moderation**:
  - Review and remove comments across all stories.
- **VIP Subscribers List**:
  - View and manage newsletter subscriber emails.

### 💾 4. Self-Hosted SQLite Database (`node:sqlite`)
- Uses Node.js native embedded SQLite (`DatabaseSync`) — **zero external database server needed, zero C++ compilation steps, zero version mismatch issues**.
- Fully persistent in `server/fashion_editorial.db` with WAL mode and foreign key support.
- Pre-seeded with authentic, realistic high-fashion articles, categories, sample guest submissions, and reader comments.

---

## 🚀 How to Run

### Quick Start (Full-Stack Unified App on port 5000):
```bash
# Inside C:\Users\shahz\.gemini\antigravity\scratch\moda-etoile-blog
npm start
```
Then open: **`http://localhost:5000`**

### Development Mode (with Vite HMR on port 3000):
In two terminal tabs:
```bash
# Terminal 1: Backend API
cd server
npm start

# Terminal 2: Frontend Vite
cd client
npm run dev
```
Open **`http://localhost:3000`** (Vite proxies all `/api` calls directly to port 5000).

---

## 🔑 Demo Admin Credentials

- **Email**: `admin@modaetoile.com`
- **Password**: `admin123`
*(Or simply click **"Admin Atelier"** in the top navigation bar or footer to enter directly!)*

---

## 📁 Project Architecture

```
moda-etoile-blog/
├── package.json               # Root scripts (start, build, dev)
├── README.md
├── server/
│   ├── package.json
│   ├── server.js              # Express server + static frontend serving
│   ├── db.js                  # Native node:sqlite schema & initial seed data
│   ├── fashion_editorial.db   # Embedded SQLite database file
│   └── routes/
│       ├── posts.js           # Public article feeds, filters, likes
│       ├── guest.js           # Guest submission portal & status tracking
│       ├── admin.js           # Full administrative dashboard API
│       ├── categories.js      # Fashion categories CRUD
│       ├── comments.js        # Article critiques & comments
│       ├── settings.js        # Site settings & newsletter
│       └── upload.js          # Image upload endpoint
└── client/
    ├── package.json
    ├── vite.config.js         # Proxy /api to :5000
    ├── tailwind.config.js     # Luxury editorial color theme & typography
    ├── index.html             # Google fonts (Playfair, Cinzel, Cormorant)
    └── src/
        ├── App.jsx            # Main controller
        ├── utils/api.js       # Centralized API client
        └── components/
            ├── Header.jsx           # Luxury masthead & nav
            ├── Ticker.jsx           # Breaking runway marquee ticker
            ├── HeroFeatured.jsx     # Cover story magazine showcase
            ├── TrendingStrip.jsx    # Weekly top 4 ranked articles
            ├── ArticleCard.jsx      # Luxury editorial card
            ├── ArticleModal.jsx     # Full reader modal with markdown & comments
            ├── GuestPostModal.jsx   # Guest submission & status tracking suite
            ├── SearchModal.jsx      # Instant archive search
            ├── AdminDashboard.jsx   # All-in-One admin command center
            ├── NewsletterSection.jsx# VIP Atelier newsletter
            └── Footer.jsx           # Editorial colophon & manifesto
```
