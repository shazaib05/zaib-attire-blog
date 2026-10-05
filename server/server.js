import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initDatabase } from './db.js';

import postsRoutes from './routes/posts.js';
import guestRoutes from './routes/guest.js';
import adminRoutes from './routes/admin.js';
import categoriesRoutes from './routes/categories.js';
import commentsRoutes from './routes/comments.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import formsRoutes from './routes/forms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Seed
initDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
const uploadDir = path.join(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/posts', postsRoutes);
app.use('/api/guest', guestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/forms', formsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    edition: 'ZAIB ATTIRE Haute Editorial Engine',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if it exists
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n👑 ZAIB ATTIRE Server is running in style on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints active at http://localhost:${PORT}/api/posts`);
  console.log(`🏛️ Admin API active at http://localhost:${PORT}/api/admin\n`);
});
