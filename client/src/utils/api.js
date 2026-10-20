// Centralized Resilient API utility for ZAIB ATTIRE
import { FALLBACK_CATEGORIES, FALLBACK_TICKER, FALLBACK_SETTINGS, FALLBACK_POSTS } from './fallbackData';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const COMMUNITY_POSTS_URL = '/community_posts.json';

// In-memory cache for live community posts
let communityPostsCache = null;

// Fetch live community posts saved in public/community_posts.json
async function fetchCommunityPosts() {
  if (communityPostsCache) return communityPostsCache;
  try {
    const res = await fetch(`${COMMUNITY_POSTS_URL}?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        communityPostsCache = data;
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch community_posts.json:', err);
  }
  return [];
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

export const api = {
  // Public Posts
  getPosts: async (params = {}) => {
    let posts = getStoredPosts();
    const commPosts = await fetchCommunityPosts();

    // Merge community posts (unique by slug or id)
    const allPosts = [...commPosts];
    for (const p of posts) {
      if (!allPosts.some(x => x.slug === p.slug || x.id === p.id)) {
        allPosts.push(p);
      }
    }

    let filtered = allPosts;
    if (params.category && params.category !== 'All' && params.category !== 'all') {
      const cat = params.category.toLowerCase();
      filtered = filtered.filter(p =>
        (p.category_name && p.category_name.toLowerCase() === cat) ||
        (p.category_slug && p.category_slug.toLowerCase() === cat)
      );
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q))
      );
    }
    const limit = params.limit ? parseInt(params.limit, 10) : filtered.length;
    return {
      posts: filtered.slice(0, limit),
      total: filtered.length
    };
  },

  getPostBySlug: async (slug) => {
    // 1. Check local storage
    const localPosts = getStoredPosts();
    let found = localPosts.find(p => p.slug === slug);

    // 2. If not found in local, check community posts file (for incognito / other devices)
    if (!found) {
      const commPosts = await fetchCommunityPosts();
      found = commPosts.find(p => p.slug === slug);
    }

    // 3. Fallback to matching with hyphens or prefix
    if (!found) {
      const allMerged = [...(await fetchCommunityPosts()), ...localPosts];
      found = allMerged.find(p => p.slug && p.slug.toLowerCase().includes(slug.toLowerCase()));
    }

    if (!found) throw new Error('Post not found');

    return {
      ...found,
      views: (found.views || 0) + 1,
      comments: [],
      related: localPosts.filter(p => p.id !== found.id).slice(0, 3)
    };
  },

  getFeaturedPost: async () => {
    const commPosts = await fetchCommunityPosts();
    if (commPosts.length > 0) return commPosts[0];
    const posts = getStoredPosts();
    return posts.find(p => p.featured) || posts[0];
  },

  getTrendingPosts: async () => {
    const commPosts = await fetchCommunityPosts();
    const posts = getStoredPosts();
    return [...commPosts, ...posts].slice(0, 4);
  },

  likePost: async (id) => {
    const posts = getStoredPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx].likes = (posts[idx].likes || 0) + 1;
      saveStoredPosts(posts);
      return { success: true, likes: posts[idx].likes };
    }
    return { success: true, likes: 1 };
  },

  // Save new post locally and sync with community
  createPost: async (postData) => {
    const posts = getStoredPosts();
    const newPost = {
      ...postData,
      id: postData.id || `post_${Date.now()}`,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      views: 1,
      likes: 0,
      created_at: new Date().toISOString()
    };
    posts.unshift(newPost);
    saveStoredPosts(posts);

    // Also update communityPostsCache
    if (!communityPostsCache) communityPostsCache = [];
    communityPostsCache.unshift(newPost);

    return { success: true, post: newPost };
  },

  // Categories & Settings
  getCategories: async () => {
    return getStoredCategories();
  },

  getSettings: async () => {
    return FALLBACK_SETTINGS;
  }
};
