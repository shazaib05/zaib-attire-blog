// Centralized API utility for ZAIB ATTIRE
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const api = {
  // Public Posts
  getPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/posts?${query}`);
    return res.json();
  },

  getFeaturedPost: async () => {
    const res = await fetch(`${API_BASE}/posts/featured`);
    return res.json();
  },

  getTrendingPosts: async () => {
    const res = await fetch(`${API_BASE}/posts/trending`);
    return res.json();
  },

  getPostBySlug: async (slug) => {
    const res = await fetch(`${API_BASE}/posts/${slug}`);
    return res.json();
  },

  likePost: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}/like`, { method: 'POST' });
    return res.json();
  },

  getSeasons: async () => {
    const res = await fetch(`${API_BASE}/posts/meta/seasons`);
    return res.json();
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  createCategory: async (data) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Comments
  postComment: async (commentData) => {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    return res.json();
  },

  // Settings & Ticker
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  subscribeNewsletter: async (email) => {
    const res = await fetch(`${API_BASE}/settings/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  updateSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/settings/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Guest Submissions
  submitGuestPost: async (postData) => {
    const res = await fetch(`${API_BASE}/guest/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return res.json();
  },

  checkGuestStatus: async (id) => {
    const res = await fetch(`${API_BASE}/guest/status/${id}`);
    return res.json();
  },

  getGuestGuidelines: async () => {
    const res = await fetch(`${API_BASE}/guest/guidelines`);
    return res.json();
  },

  // Admin Dashboard API
  adminLogin: async (email, password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`);
    return res.json();
  },

  getAdminPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/posts?${query}`);
    return res.json();
  },

  createPost: async (postData) => {
    const res = await fetch(`${API_BASE}/admin/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return res.json();
  },

  updatePost: async (id, postData) => {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return res.json();
  },

  deletePost: async (id) => {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, { method: 'DELETE' });
    return res.json();
  },

  togglePostStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/admin/posts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  toggleFeatured: async (id) => {
    const res = await fetch(`${API_BASE}/admin/posts/${id}/featured`, { method: 'PATCH' });
    return res.json();
  },

  toggleTrending: async (id) => {
    const res = await fetch(`${API_BASE}/admin/posts/${id}/trending`, { method: 'PATCH' });
    return res.json();
  },

  getAdminGuestSubmissions: async (status = 'all') => {
    const res = await fetch(`${API_BASE}/admin/guest-submissions?status=${status}`);
    return res.json();
  },

  approveGuestSubmission: async (id, feedback = '', publishImmediately = true) => {
    const res = await fetch(`${API_BASE}/admin/guest-submissions/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, publishImmediately })
    });
    return res.json();
  },

  rejectGuestSubmission: async (id, feedback) => {
    const res = await fetch(`${API_BASE}/admin/guest-submissions/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback })
    });
    return res.json();
  },

  deleteGuestSubmission: async (id) => {
    const res = await fetch(`${API_BASE}/admin/guest-submissions/${id}`, { method: 'DELETE' });
    return res.json();
  },

  getAdminComments: async () => {
    const res = await fetch(`${API_BASE}/admin/comments`);
    return res.json();
  },

  updateCommentStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/admin/comments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  deleteComment: async (id) => {
    const res = await fetch(`${API_BASE}/admin/comments/${id}`, { method: 'DELETE' });
    return res.json();
  },

  getTickerItems: async () => {
    const res = await fetch(`${API_BASE}/admin/ticker`);
    return res.json();
  },

  addTickerItem: async (headline, tag) => {
    const res = await fetch(`${API_BASE}/admin/ticker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headline, tag })
    });
    return res.json();
  },

  deleteTickerItem: async (id) => {
    const res = await fetch(`${API_BASE}/admin/ticker/${id}`, { method: 'DELETE' });
    return res.json();
  },

  getSubscribers: async () => {
    const res = await fetch(`${API_BASE}/admin/subscribers`);
    return res.json();
  },

  // Form Submissions & Google Sheets Integration
  submitAdvertiseInquiry: async (data) => {
    const res = await fetch(`${API_BASE}/forms/advertise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  submitContactMessage: async (data) => {
    const res = await fetch(`${API_BASE}/forms/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getGoogleSheetsConfig: async () => {
    const res = await fetch(`${API_BASE}/forms/google-sheets/config`);
    return res.json();
  },

  saveGoogleSheetsConfig: async (webhook_url) => {
    const res = await fetch(`${API_BASE}/forms/google-sheets/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook_url })
    });
    return res.json();
  },

  testGoogleSheetsSync: async () => {
    const res = await fetch(`${API_BASE}/forms/google-sheets/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  subscribeNewsletter: async (email) => {
    const res = await fetch(`${API_BASE}/settings/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  verifyAdminPasscode: async (passcode) => {
    const res = await fetch(`${API_BASE}/admin/verify-passcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    return res.json();
  }
};
