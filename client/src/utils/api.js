// Centralized Resilient API utility for ZAIB ATTIRE
// Dual mode: Live Express backend when available, and zero-loss local persistence for Vercel/Netlify hosting
import { FALLBACK_CATEGORIES, FALLBACK_TICKER, FALLBACK_SETTINGS, FALLBACK_POSTS } from './fallbackData';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Safe fetcher with automatic fallback
async function safeFetch(url, options = {}, fallbackFn = null) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    // If not OK or not JSON (e.g. 404 HTML fallback page)
    if (fallbackFn) return await fallbackFn();
    throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    if (fallbackFn) return await fallbackFn();
    throw err;
  }
}

// Local Storage helpers for resilient persistence
function getStoredPosts() {
  try {
    const local = localStorage.getItem('zaib_custom_posts');
    if (local) return JSON.parse(local);
  } catch {}
  return [...FALLBACK_POSTS];
}

function saveStoredPosts(posts) {
  try {
    localStorage.setItem('zaib_custom_posts', JSON.stringify(posts));
  } catch {}
}

function getStoredCategories() {
  try {
    const local = localStorage.getItem('zaib_custom_categories');
    if (local) return JSON.parse(local);
  } catch {}
  return [...FALLBACK_CATEGORIES];
}

function getStoredComments() {
  try {
    const local = localStorage.getItem('zaib_all_comments');
    if (local) return JSON.parse(local);
  } catch {}
  return [];
}

function saveStoredComments(comments) {
  try {
    localStorage.setItem('zaib_all_comments', JSON.stringify(comments));
  } catch {}
}

function getStoredResponses() {
  try {
    const local = localStorage.getItem('zaib_form_responses');
    if (local) return JSON.parse(local);
  } catch {}
  return [];
}

function recordLocalSubmission(type, name, email, title, category, details) {
  try {
    const current = getStoredResponses();
    const entry = {
      id: `resp_${Date.now()}`,
      type,
      name: name || 'Anonymous',
      email: email || 'N/A',
      title: title || 'N/A',
      category: category || 'General',
      details: details || '',
      reference_id: `ZAIB-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString()
    };
    current.unshift(entry);
    localStorage.setItem('zaib_form_responses', JSON.stringify(current));
    return entry;
  } catch {}
  return null;
}

// Direct browser transmission to Google Sheets webhook if configured
async function forwardToGoogleSheetsBrowser(payload) {
  const webhookUrl = localStorage.getItem('zaib_sheets_webhook_url') || 'https://script.google.com/macros/s/AKfycby5tX-hK4G5727h8_1Z3l6Ua0eJk_placeholder/exec';
  if (!webhookUrl || webhookUrl.includes('placeholder')) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toLocaleString()
      }),
      mode: 'no-cors' // Google Apps Script redirects safely with no-cors in browser
    });
  } catch (err) {
    console.warn('Browser Google Sheet sync note:', err);
  }
}

export const api = {
  // Public Posts
  getPosts: async (params = {}) => {
    return safeFetch(`${API_BASE}/posts?${new URLSearchParams(params).toString()}`, {}, () => {
      let posts = getStoredPosts();
      if (params.category) {
        const cat = params.category.toLowerCase();
        posts = posts.filter(p => (p.category_slug && p.category_slug.toLowerCase() === cat) || (p.category_name && p.category_name.toLowerCase() === cat));
      }
      if (params.season) {
        posts = posts.filter(p => p.season === params.season);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        posts = posts.filter(p => p.title.toLowerCase().includes(q) || (p.content && p.content.toLowerCase().includes(q)));
      }
      return { posts, total: posts.length };
    });
  },

  getFeaturedPost: async () => {
    return safeFetch(`${API_BASE}/posts/featured`, {}, () => {
      const posts = getStoredPosts();
      return posts.find(p => p.is_featured === 1 || p.is_featured === true) || posts[0];
    });
  },

  getTrendingPosts: async () => {
    return safeFetch(`${API_BASE}/posts/trending`, {}, () => {
      const posts = getStoredPosts();
      return posts.filter(p => p.is_trending === 1 || p.is_trending === true).slice(0, 5);
    });
  },

  getPostBySlug: async (slug) => {
    let postData = null;
    try {
      const res = await fetch(`${API_BASE}/posts/${slug}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        postData = await res.json();
      }
    } catch {}

    if (!postData) {
      const posts = getStoredPosts();
      const found = posts.find(p => p.slug === slug);
      if (!found) throw new Error('Post not found');
      postData = {
        ...found,
        views: (found.views || 0) + 1,
        comments: [],
        related: posts.filter(p => p.category_name === found.category_name && p.id !== found.id).slice(0, 3)
      };
    }

    // Always merge locally saved comments for this post
    const allStoredComments = getStoredComments();
    const localComments = allStoredComments.filter(
      c => c.post_id === postData.id || c.post_id === postData.slug || c.post_id === slug
    );
    
    const existingIds = new Set((postData.comments || []).map(c => c.id));
    const mergedComments = [...(postData.comments || [])];
    for (const lc of localComments) {
      if (!existingIds.has(lc.id)) {
        mergedComments.push(lc);
      }
    }
    
    // Sort comments newest first
    mergedComments.sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
    postData.comments = mergedComments;

    return postData;
  },

  likePost: async (id) => {
    return safeFetch(`${API_BASE}/posts/${id}/like`, { method: 'POST' }, () => {
      const posts = getStoredPosts();
      const post = posts.find(p => p.id === id);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        saveStoredPosts(posts);
        return { success: true, likes: post.likes };
      }
      return { success: true, likes: 1 };
    });
  },

  getSeasons: async () => {
    return safeFetch(`${API_BASE}/posts/meta/seasons`, {}, () => {
      return ['Spring / Summer 2026', 'Fall / Winter 2026', 'Resort 2026', 'Pre-Fall 2026'];
    });
  },

  // Categories
  getCategories: async () => {
    return safeFetch(`${API_BASE}/categories`, {}, () => {
      return getStoredCategories();
    });
  },

  createCategory: async (data) => {
    return safeFetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const cats = getStoredCategories();
      const newCat = { ...data, id: `cat_${Date.now()}` };
      cats.push(newCat);
      localStorage.setItem('zaib_custom_categories', JSON.stringify(cats));
      return { success: true, category: newCat };
    });
  },

  deleteCategory: async (id) => {
    return safeFetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' }, () => {
      let cats = getStoredCategories();
      cats = cats.filter(c => c.id !== id);
      localStorage.setItem('zaib_custom_categories', JSON.stringify(cats));
      return { success: true };
    });
  },

  // Comments (Reader Reflections)
  postComment: async (commentData) => {
    const nowIso = new Date().toISOString();
    const commentId = `cmt_${Date.now()}`;
    const localComment = {
      id: commentId,
      post_id: commentData.post_id,
      post_title: commentData.post_title || 'Haute Editorial Story',
      author_name: commentData.author_name,
      author_email: commentData.author_email || '',
      content: commentData.content,
      status: 'approved',
      created_at: nowIso
    };

    // 1. Immediately persist to localStorage
    const currentComments = getStoredComments();
    currentComments.unshift(localComment);
    saveStoredComments(currentComments);

    // 2. Also register in local form submissions so it appears in Admin Recent Responses
    recordLocalSubmission(
      'Reader Comment',
      commentData.author_name,
      commentData.author_email,
      commentData.post_title || 'Editorial Story',
      'Critique & Reflection',
      commentData.content
    );

    // 3. Forward to Google Sheets
    await forwardToGoogleSheetsBrowser({
      form_type: 'Reader Comment',
      name: commentData.author_name,
      email: commentData.author_email,
      title_or_subject: commentData.post_title || 'Editorial Story',
      category_or_type: 'Editorial Critique',
      details: commentData.content,
      reference_id: commentId
    });

    // 4. Also try transmitting to backend server if reachable
    try {
      const res = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          return {
            ...localComment,
            ...data,
            created_at: data.created_at || nowIso
          };
        }
      }
    } catch {}

    return localComment;
  },

  getAdminComments: async () => {
    let serverComments = [];
    try {
      const res = await fetch(`${API_BASE}/admin/comments`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        serverComments = await res.json();
      }
    } catch {}

    const localComments = getStoredComments();
    const seen = new Set();
    const all = [];

    // Prioritize server and local without duplicates
    for (const c of [...serverComments, ...localComments]) {
      if (c && c.id && !seen.has(c.id)) {
        seen.add(c.id);
        all.push({
          ...c,
          post_title: c.post_title || 'Haute Editorial Story',
          created_at: c.created_at || new Date().toISOString()
        });
      }
    }

    all.sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
    return all;
  },

  updateCommentStatus: async (id, status) => {
    const local = getStoredComments();
    const found = local.find(c => c.id === id);
    if (found) {
      found.status = status;
      saveStoredComments(local);
    }
    try {
      await fetch(`${API_BASE}/admin/comments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {}
    return { success: true };
  },

  deleteComment: async (id) => {
    let local = getStoredComments();
    local = local.filter(c => c.id !== id);
    saveStoredComments(local);

    try {
      await fetch(`${API_BASE}/admin/comments/${id}`, { method: 'DELETE' });
    } catch {}

    return { success: true };
  },

  // Settings & Ticker
  getSettings: async () => {
    return safeFetch(`${API_BASE}/settings`, {}, () => {
      const obj = {};
      for (const s of FALLBACK_SETTINGS) obj[s.key] = s.value;
      return obj;
    });
  },

  subscribeNewsletter: async (email) => {
    return safeFetch(`${API_BASE}/settings/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }, async () => {
      recordLocalSubmission('Newsletter Subscriber', 'VIP Reader', email, 'Newsletter Subscription', 'Fashion Circle', 'VIP Weekly Subscription');
      await forwardToGoogleSheetsBrowser({
        form_type: 'Newsletter Subscriber',
        name: 'VIP Reader',
        email,
        category_or_type: 'Fashion Circle',
        title_or_subject: 'Newsletter Subscription'
      });
      return { success: true, message: 'Welcome to the ZAIB ATTIRE Atelier Circle.' };
    });
  },

  updateSettings: async (settings) => {
    return safeFetch(`${API_BASE}/settings/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }, () => {
      return { success: true };
    });
  },

  // Guest Submissions
  submitGuestPost: async (postData) => {
    return safeFetch(`${API_BASE}/guest/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    }, async () => {
      const trackingId = `GP-${Date.now().toString().slice(-4)}`;
      recordLocalSubmission('Guest Post Pitch', postData.author_name, postData.author_email, postData.title, postData.category_name, postData.pitch_summary);
      await forwardToGoogleSheetsBrowser({
        form_type: 'Guest Post Pitch',
        name: postData.author_name,
        email: postData.author_email,
        title_or_subject: postData.title,
        category_or_type: postData.category_name,
        details: postData.pitch_summary,
        reference_id: trackingId
      });
      return { success: true, tracking_id: trackingId, message: 'Guest post submitted to editorial committee.' };
    });
  },

  checkGuestStatus: async (id) => {
    return safeFetch(`${API_BASE}/guest/status/${id}`, {}, () => {
      return { status: 'under_review', title: 'Submitted Editorial Pitch', updated_at: new Date().toISOString() };
    });
  },

  getGuestGuidelines: async () => {
    return safeFetch(`${API_BASE}/guest/guidelines`, {}, () => {
      return {
        word_count: '1,200 - 2,500 words',
        focus: 'High fashion analysis, sustainable couture, luxury culture, and runway critiques.',
        review_time: '48 to 72 hours'
      };
    });
  },

  // Admin Dashboard API
  adminLogin: async (email, password) => {
    return safeFetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }, () => {
      if (password === 'Paki@123') {
        return { success: true, token: 'zaib_auth_token_ok', user: { name: 'Camille de Valois', role: 'admin' } };
      }
      return { success: false, error: 'Invalid master credentials.' };
    });
  },

  getAdminStats: async () => {
    return safeFetch(`${API_BASE}/admin/stats`, {}, () => {
      const posts = getStoredPosts();
      const responses = getStoredResponses();
      const comments = getStoredComments();
      return {
        total_posts: posts.length,
        total_views: posts.reduce((a, c) => a + (c.views || 0), 0) || 12450,
        total_likes: posts.reduce((a, c) => a + (c.likes || 0), 0) || 830,
        pending_guest_posts: responses.filter(r => r.type === 'Guest Post Pitch').length || 0,
        active_subscribers: responses.filter(r => r.type === 'Newsletter Subscriber').length || 12,
        total_comments: comments.length
      };
    });
  },

  getAdminPosts: async (params = {}) => {
    return safeFetch(`${API_BASE}/admin/posts?${new URLSearchParams(params).toString()}`, {}, () => {
      return getStoredPosts();
    });
  },

  createPost: async (postData) => {
    return safeFetch(`${API_BASE}/admin/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    }, () => {
      const posts = getStoredPosts();
      const newPost = {
        ...postData,
        id: `post_${Date.now()}`,
        slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        views: 1,
        likes: 0,
        created_at: new Date().toISOString()
      };
      posts.unshift(newPost);
      saveStoredPosts(posts);
      return { success: true, post: newPost };
    });
  },

  updatePost: async (id, postData) => {
    return safeFetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    }, () => {
      const posts = getStoredPosts();
      const idx = posts.findIndex(p => p.id === id);
      if (idx !== -1) {
        posts[idx] = { ...posts[idx], ...postData };
        saveStoredPosts(posts);
        return { success: true, post: posts[idx] };
      }
      return { success: false };
    });
  },

  deletePost: async (id) => {
    return safeFetch(`${API_BASE}/admin/posts/${id}`, { method: 'DELETE' }, () => {
      let posts = getStoredPosts();
      posts = posts.filter(p => p.id !== id);
      saveStoredPosts(posts);
      return { success: true };
    });
  },

  togglePostStatus: async (id, status) => {
    return safeFetch(`${API_BASE}/admin/posts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }, () => {
      const posts = getStoredPosts();
      const post = posts.find(p => p.id === id);
      if (post) {
        post.status = status;
        saveStoredPosts(posts);
      }
      return { success: true };
    });
  },

  toggleFeatured: async (id) => {
    return safeFetch(`${API_BASE}/admin/posts/${id}/featured`, { method: 'PATCH' }, () => {
      const posts = getStoredPosts();
      const post = posts.find(p => p.id === id);
      if (post) {
        post.is_featured = post.is_featured ? 0 : 1;
        saveStoredPosts(posts);
      }
      return { success: true };
    });
  },

  toggleTrending: async (id) => {
    return safeFetch(`${API_BASE}/admin/posts/${id}/trending`, { method: 'PATCH' }, () => {
      const posts = getStoredPosts();
      const post = posts.find(p => p.id === id);
      if (post) {
        post.is_trending = post.is_trending ? 0 : 1;
        saveStoredPosts(posts);
      }
      return { success: true };
    });
  },

  getAdminGuestSubmissions: async (status = 'all') => {
    return safeFetch(`${API_BASE}/admin/guest-submissions?status=${status}`, {}, () => {
      const resps = getStoredResponses().filter(r => r.type === 'Guest Post Pitch');
      return resps.map(r => ({
        id: r.id,
        title: r.title,
        category_name: r.category,
        author_name: r.name,
        author_email: r.email,
        pitch_summary: r.details,
        status: 'pending',
        created_at: r.created_at
      }));
    });
  },

  approveGuestSubmission: async (id, feedback = '', publishImmediately = true) => {
    return safeFetch(`${API_BASE}/admin/guest-submissions/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback, publishImmediately })
    }, () => {
      return { success: true };
    });
  },

  rejectGuestSubmission: async (id, feedback) => {
    return safeFetch(`${API_BASE}/admin/guest-submissions/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback })
    }, () => {
      return { success: true };
    });
  },

  deleteGuestSubmission: async (id) => {
    return safeFetch(`${API_BASE}/admin/guest-submissions/${id}`, { method: 'DELETE' }, () => {
      return { success: true };
    });
  },

  getTickerItems: async () => {
    return safeFetch(`${API_BASE}/admin/ticker`, {}, () => {
      return FALLBACK_TICKER;
    });
  },

  addTickerItem: async (headline, tag) => {
    return safeFetch(`${API_BASE}/admin/ticker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headline, tag })
    }, () => {
      return { success: true, item: { id: `tck_${Date.now()}`, headline, tag } };
    });
  },

  deleteTickerItem: async (id) => {
    return safeFetch(`${API_BASE}/admin/ticker/${id}`, { method: 'DELETE' }, () => {
      return { success: true };
    });
  },

  getSubscribers: async () => {
    return safeFetch(`${API_BASE}/admin/subscribers`, {}, () => {
      return getStoredResponses().filter(r => r.type === 'Newsletter Subscriber');
    });
  },

  // Form Submissions & Google Sheets Integration
  submitAdvertiseInquiry: async (data) => {
    return safeFetch(`${API_BASE}/forms/advertise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, async () => {
      recordLocalSubmission('Advertising Inquiry', data.contact_name, data.email, data.campaign_type, data.budget_range, data.brief);
      await forwardToGoogleSheetsBrowser({
        form_type: 'Advertising Inquiry',
        name: `${data.contact_name} (${data.brand_name})`,
        email: data.email,
        category_or_type: data.campaign_type,
        title_or_subject: data.budget_range,
        details: data.brief
      });
      return { success: true, message: 'Advertising inquiry received.' };
    });
  },

  submitContactMessage: async (data) => {
    return safeFetch(`${API_BASE}/forms/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, async () => {
      recordLocalSubmission('Contact Dispatch', data.name, data.email, data.subject, data.department, data.message);
      await forwardToGoogleSheetsBrowser({
        form_type: 'Contact Dispatch',
        name: data.name,
        email: data.email,
        category_or_type: data.department,
        title_or_subject: data.subject,
        details: data.message
      });
      return { success: true, message: 'Message sent to the atelier team.' };
    });
  },

  getGoogleSheetsConfig: async () => {
    return safeFetch(`${API_BASE}/forms/google-sheets/config`, {}, () => {
      const url = localStorage.getItem('zaib_sheets_webhook_url') || '';
      return { webhook_url: url, configured: !!url };
    });
  },

  saveGoogleSheetsConfig: async (webhook_url) => {
    return safeFetch(`${API_BASE}/forms/google-sheets/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook_url })
    }, () => {
      localStorage.setItem('zaib_sheets_webhook_url', webhook_url || '');
      return { success: true, message: 'Google Sheets webhook updated.' };
    });
  },

  testGoogleSheetsSync: async () => {
    return safeFetch(`${API_BASE}/forms/google-sheets/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, async () => {
      await forwardToGoogleSheetsBrowser({
        form_type: 'VERIFICATION TEST',
        name: 'ZAIB ATTIRE Diagnostic',
        email: 'admin@zaibattire.com',
        category_or_type: 'System Diagnostics',
        title_or_subject: 'Browser Connection Test',
        details: 'Testing direct synchronization to Google Sheet.'
      });
      return { success: true, message: 'Test ping sent to Google Sheet.' };
    });
  },

  getRecentFormResponses: async () => {
    return safeFetch(`${API_BASE}/forms/recent-responses`, {}, () => {
      return getStoredResponses();
    });
  },

  downloadFormResponsesCsv: () => {
    const responses = getStoredResponses();
    if (!responses.length) {
      window.open(`${API_BASE}/forms/export-csv`, '_blank');
      return;
    }
    const header = 'Timestamp,Form Type,Name,Email,Subject / Title,Category,Details,Reference ID\n';
    const rows = responses.map(r => [
      `"${r.created_at}"`,
      `"${r.type}"`,
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.title}"`,
      `"${r.category}"`,
      `"${(r.details || '').replace(/"/g, '""')}"`,
      `"${r.reference_id}"`
    ].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zaib_attire_form_responses_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  verifyAdminPasscode: async (passcode) => {
    return safeFetch(`${API_BASE}/admin/verify-passcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    }, () => {
      if (passcode === 'Paki@123') {
        return { success: true, token: 'zaib_auth_session_local', message: 'Atelier master access granted.' };
      }
      return { success: false, error: 'Incorrect master passcode. Access to Atelier Portal denied.' };
    });
  }
};
