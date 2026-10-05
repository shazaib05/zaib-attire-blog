import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Feather, PlusCircle, Tag, MessageSquare,
  Users, Settings, Eye, Heart, Clock, CheckCircle2, XCircle, Trash2,
  Edit3, ExternalLink, ArrowRight, Sparkles, RefreshCw, AlertCircle,
  TrendingUp, Search, Image as ImageIcon, Check, Sliders, FileSpreadsheet, Copy, Download, Lock
} from 'lucide-react';
import { api } from '../utils/api';

const FASHION_IMAGE_PRESETS = [
  { label: 'Paris Atelier High Fashion', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Runway Model Silhouette', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Urban Street Style Minimalist', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quiet Luxury Wool & Cashmere', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sustainable Eco Silk & Botanics', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sculptural Footwear & Jewelry', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80' },
];

export default function AdminDashboard({ onClose, onSelectPost, onLogout }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'posts' | 'guest' | 'create' | 'categories' | 'comments' | 'settings'

  // Data states
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [guestSubmissions, setGuestSubmissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Post Editor State (Create / Edit)
  const [editingPostId, setEditingPostId] = useState(null);
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    content: '',
    cover_image: FASHION_IMAGE_PRESETS[0].url,
    category_name: 'Haute Couture',
    season: 'Spring / Summer 2026',
    status: 'published',
    is_featured: false,
    is_trending: false,
    is_guest_post: false,
    tags: '',
    author_name: 'Camille de Valois',
    author_email: 'admin@zaibattire.com',
    author_bio: 'Editor-in-Chief at ZAIB ATTIRE.',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    author_website: 'https://zaibattire.com',
    author_social: '@camille_valois'
  });

  // Guest Review Modal State
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Category & Ticker Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newTickerHeadline, setNewTickerHeadline] = useState('');
  const [newTickerTag, setNewTickerTag] = useState('BREAKING');

  // Google Sheets Integration State
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState('');
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [sheetsTemplate, setSheetsTemplate] = useState('');
  const [sheetsResponses, setSheetsResponses] = useState([]);
  const [sheetsTesting, setSheetsTesting] = useState(false);
  const [sheetsTestMsg, setSheetsTestMsg] = useState('');
  const [sheetsSaving, setSheetsSaving] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Filter states
  const [postFilter, setPostFilter] = useState({ status: 'all', search: '', category: 'all' });
  const [guestFilter, setGuestFilter] = useState('all');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadSheetsConfig = async () => {
    try {
      const res = await api.getGoogleSheetsConfig();
      if (res) {
        setSheetsWebhookUrl(res.webhook_url || '');
        setSheetsConnected(res.is_connected || false);
        setSheetsTemplate(res.apps_script_template || '');
        setSheetsResponses(res.recent_responses || []);
      }
    } catch (err) {
      console.error('Failed to load sheets config:', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsData, postsData, guestData, catData, cmtData, tickData, subData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminPosts(),
        api.getAdminGuestSubmissions(),
        api.getCategories(),
        api.getAdminComments(),
        api.getTickerItems(),
        api.getSubscribers()
      ]);

      setStats(statsData);
      setPosts(postsData);
      setGuestSubmissions(guestData);
      setCategories(catData);
      setComments(cmtData);
      setTickerItems(tickData);
      setSubscribers(subData);
      loadSheetsConfig();
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSaveSheetsConfig = async (e) => {
    e.preventDefault();
    setSheetsSaving(true);
    try {
      const res = await api.saveGoogleSheetsConfig(sheetsWebhookUrl);
      setSheetsConnected(res.is_connected);
      showToast(res.message || 'Google Sheets configuration saved.');
      loadSheetsConfig();
    } catch {
      showToast('Failed to save Google Sheets URL.');
    } finally {
      setSheetsSaving(false);
    }
  };

  const handleTestSheetsSync = async () => {
    setSheetsTesting(true);
    setSheetsTestMsg('');
    try {
      const res = await api.testGoogleSheetsSync();
      if (res.success) {
        setSheetsTestMsg('✓ ' + res.message);
        showToast('Test row transmitted to Google Sheet!');
        loadSheetsConfig();
      } else {
        setSheetsTestMsg('✗ ' + (res.error || 'Failed to ping Google Sheet.'));
      }
    } catch (err) {
      setSheetsTestMsg('✗ Connection failed. Please ensure your Google Apps Script is deployed as Web App (Anyone).');
    } finally {
      setSheetsTesting(false);
    }
  };

  const handleCopyScript = () => {
    if (!sheetsTemplate) return;
    navigator.clipboard.writeText(sheetsTemplate);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // ---------------------------------------------
  // POST ACTIONS
  // ---------------------------------------------
  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) {
      showToast('Title and content are required.');
      return;
    }

    try {
      if (editingPostId) {
        await api.updatePost(editingPostId, postForm);
        showToast('Article updated successfully.');
      } else {
        await api.createPost(postForm);
        showToast('New editorial piece published successfully.');
      }

      setEditingPostId(null);
      resetPostForm();
      setActiveTab('posts');
      loadAllData();
    } catch (err) {
      showToast('Error saving article.');
    }
  };

  const resetPostForm = () => {
    setEditingPostId(null);
    setPostForm({
      title: '',
      slug: '',
      subtitle: '',
      content: '',
      cover_image: FASHION_IMAGE_PRESETS[0].url,
      category_name: categories[0]?.name || 'Haute Couture',
      season: 'Spring / Summer 2026',
      status: 'published',
      is_featured: false,
      is_trending: false,
      is_guest_post: false,
      tags: '',
      author_name: 'Camille de Valois',
      author_email: 'admin@modaetoile.com',
      author_bio: 'Editor-in-Chief at MODA ÉTOILE.',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      author_website: 'https://modaetoile.com',
      author_social: '@camille_valois'
    });
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || '',
      content: post.content,
      cover_image: post.cover_image,
      category_name: post.category_name,
      season: post.season || 'Spring / Summer 2026',
      status: post.status,
      is_featured: post.is_featured,
      is_trending: post.is_trending,
      is_guest_post: post.is_guest_post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      author_name: post.author_name,
      author_email: post.author_email || '',
      author_bio: post.author_bio || '',
      author_avatar: post.author_avatar || '',
      author_website: post.author_website || '',
      author_social: post.author_social || ''
    });
    setActiveTab('create');
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this editorial article?')) return;
    try {
      await api.deletePost(id);
      showToast('Article deleted.');
      loadAllData();
    } catch {
      showToast('Failed to delete post.');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await api.togglePostStatus(id, nextStatus);
      showToast(`Status shifted to ${nextStatus}.`);
      loadAllData();
    } catch {
      showToast('Failed to update status.');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await api.toggleFeatured(id);
      showToast('Featured cover status updated.');
      loadAllData();
    } catch {
      showToast('Failed to update.');
    }
  };

  const handleToggleTrending = async (id) => {
    try {
      await api.toggleTrending(id);
      showToast('Trending status updated.');
      loadAllData();
    } catch {
      showToast('Failed to update.');
    }
  };

  // ---------------------------------------------
  // GUEST MODERATION ACTIONS
  // ---------------------------------------------
  const handleApproveGuest = async (id) => {
    try {
      const res = await api.approveGuestSubmission(id, reviewFeedback, true);
      showToast('✓ Guest piece approved and published live!');
      setSelectedSubmission(null);
      setReviewFeedback('');
      loadAllData();
    } catch {
      showToast('Failed to approve submission.');
    }
  };

  const handleRejectGuest = async (id) => {
    try {
      await api.rejectGuestSubmission(id, reviewFeedback || 'Article did not meet current editorial criteria.');
      showToast('Submission marked as rejected.');
      setSelectedSubmission(null);
      setReviewFeedback('');
      loadAllData();
    } catch {
      showToast('Failed to reject submission.');
    }
  };

  const handleDeleteGuest = async (id) => {
    if (!confirm('Delete this submission permanently?')) return;
    try {
      await api.deleteGuestSubmission(id);
      showToast('Submission removed.');
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      loadAllData();
    } catch {
      showToast('Failed to delete.');
    }
  };

  // ---------------------------------------------
  // CATEGORIES & TICKER
  // ---------------------------------------------
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.createCategory({ name: newCatName.trim(), description: newCatDesc.trim() });
      showToast('Category created.');
      setNewCatName('');
      setNewCatDesc('');
      loadAllData();
    } catch {
      showToast('Failed to add category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.deleteCategory(id);
      showToast('Category removed.');
      loadAllData();
    } catch {
      showToast('Failed to delete.');
    }
  };

  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTickerHeadline.trim()) return;
    try {
      await api.addTickerItem(newTickerHeadline.trim(), newTickerTag);
      showToast('Headline added to runway ticker.');
      setNewTickerHeadline('');
      loadAllData();
    } catch {
      showToast('Failed to add ticker headline.');
    }
  };

  const handleDeleteTicker = async (id) => {
    try {
      await api.deleteTickerItem(id);
      showToast('Ticker item removed.');
      loadAllData();
    } catch {
      showToast('Failed to delete ticker item.');
    }
  };

  // ---------------------------------------------
  // COMMENTS
  // ---------------------------------------------
  const handleDeleteComment = async (id) => {
    try {
      await api.deleteComment(id);
      showToast('Critique removed.');
      loadAllData();
    } catch {
      showToast('Failed to delete critique.');
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (postFilter.status !== 'all' && p.status !== postFilter.status) return false;
    if (postFilter.category !== 'all' && p.category_name !== postFilter.category) return false;
    if (postFilter.search) {
      const q = postFilter.search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.author_name.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingSubmissionsCount = guestSubmissions.filter(s => s.status === 'pending').length;

  return (
    <div className="bg-[#f4f4f0] min-h-screen text-luxury-950 flex flex-col">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-luxury-950 text-gold-400 px-5 py-3 shadow-2xl border border-gold-500/40 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="text-gold-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="bg-luxury-950 text-white border-b border-luxury-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse"></span>
            <span className="font-editorial text-xl font-bold tracking-wider">
              ZAIB <span className="font-cormorant italic text-gold-400">Attire Atelier</span>
            </span>
          </div>
          <span className="text-luxury-500 text-xs hidden sm:inline">|</span>
          <span className="text-[10px] tracking-luxury uppercase text-luxury-400 hidden sm:inline">
            EDITORIAL COMMAND & GUEST WORKFLOW
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={loadAllData}
            className="p-2 text-luxury-400 hover:text-white rounded-full hover:bg-luxury-900 transition"
            title="Refresh database records"
          >
            <RefreshCw size={15} />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 text-xs uppercase font-bold tracking-luxury transition"
          >
            View Live Magazine
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-luxury-900 hover:bg-red-950/80 text-luxury-300 hover:text-red-300 border border-luxury-700 hover:border-red-600/70 text-xs uppercase font-bold tracking-luxury transition flex items-center gap-1.5"
              title="Lock Admin Portal & Require Passcode"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">Lock Vault</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border border-luxury-200 p-4 shrink-0 shadow-sm self-start">
          <div className="text-[10px] tracking-luxury uppercase font-bold text-luxury-500 mb-3 px-3">
            MANAGEMENT SUITE
          </div>

          <nav className="space-y-1 text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'overview'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard size={15} />
                <span>Dashboard Overview</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('guest')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'guest'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Feather size={15} />
                <span>Guest Submissions</span>
              </span>
              {pendingSubmissionsCount > 0 && (
                <span className="bg-gold-500 text-luxury-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingSubmissionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'posts'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText size={15} />
                <span>All Articles</span>
              </span>
              <span className="text-[10px] text-luxury-400 font-mono">
                {posts.length}
              </span>
            </button>

            <button
              onClick={() => { resetPostForm(); setActiveTab('create'); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'create'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <PlusCircle size={15} />
                <span>{editingPostId ? 'Edit Article' : 'Write New Article'}</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'categories'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Tag size={15} />
                <span>Categories & Ticker</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'comments'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare size={15} />
                <span>Comments & Critiques</span>
              </span>
              <span className="text-[10px] text-luxury-400 font-mono">
                {comments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'subscribers'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users size={15} />
                <span>VIP Subscribers</span>
              </span>
              <span className="text-[10px] text-luxury-400 font-mono">
                {subscribers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition rounded-none ${
                activeTab === 'sheets'
                  ? 'bg-luxury-950 text-gold-400'
                  : 'text-luxury-700 hover:bg-luxury-100 hover:text-luxury-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileSpreadsheet size={15} />
                <span>Google Sheets Sync</span>
              </span>
              <span className={`w-2 h-2 rounded-full ${sheetsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            </button>
          </nav>

          {/* Quick Contributor Stats badge */}
          <div className="mt-8 p-3.5 bg-champagne-50 border border-gold-300 text-xs">
            <span className="text-[10px] tracking-widest uppercase font-bold text-gold-800 block mb-1">
              GUEST EDITORIAL FLOW
            </span>
            <p className="text-luxury-700 text-[11px] leading-tight">
              {pendingSubmissionsCount > 0
                ? `${pendingSubmissionsCount} guest writer pitches awaiting your review.`
                : 'All guest submissions reviewed!'}
            </p>
          </div>
        </aside>

        {/* Dynamic Admin Content Area */}
        <main className="flex-1 bg-white border border-luxury-200 p-6 sm:p-8 shadow-sm">
          
          {/* ---------------------------------------------------- */}
          {/* TAB 1: OVERVIEW & ANALYTICS                          */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950">
                  Editorial Command Dashboard
                </h3>
                <p className="text-xs tracking-wider uppercase text-luxury-500 mt-1">
                  ATELIER PERFORMANCE, ENGAGEMENT METRICS & GUEST CONTRIBUTIONS
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#fafaf8] border border-luxury-200">
                  <div className="text-[10px] tracking-luxury uppercase font-semibold text-luxury-500 mb-1">
                    TOTAL PUBLISHED
                  </div>
                  <div className="font-editorial text-3xl font-bold text-luxury-950">
                    {stats?.counts?.publishedPosts || 0}
                  </div>
                  <div className="text-[11px] text-luxury-600 mt-1 flex items-center gap-1">
                    <span>{stats?.counts?.guestPublished || 0} guest articles</span>
                  </div>
                </div>

                <div className="p-5 bg-champagne-50 border border-gold-300">
                  <div className="text-[10px] tracking-luxury uppercase font-bold text-gold-800 mb-1">
                    PENDING GUEST PITCHES
                  </div>
                  <div className="font-editorial text-3xl font-bold text-gold-900">
                    {stats?.counts?.pendingGuest || 0}
                  </div>
                  <button
                    onClick={() => setActiveTab('guest')}
                    className="text-[11px] text-gold-700 hover:underline font-semibold mt-1 flex items-center gap-1"
                  >
                    <span>Review in Inbox</span>
                    <ArrowRight size={10} />
                  </button>
                </div>

                <div className="p-5 bg-[#fafaf8] border border-luxury-200">
                  <div className="text-[10px] tracking-luxury uppercase font-semibold text-luxury-500 mb-1">
                    TOTAL READERSHIP
                  </div>
                  <div className="font-editorial text-3xl font-bold text-luxury-950">
                    {stats?.counts?.totalViews?.toLocaleString() || 0}
                  </div>
                  <div className="text-[11px] text-luxury-600 mt-1">
                    <span>{stats?.counts?.totalLikes || 0} applauds</span>
                  </div>
                </div>

                <div className="p-5 bg-[#fafaf8] border border-luxury-200">
                  <div className="text-[10px] tracking-luxury uppercase font-semibold text-luxury-500 mb-1">
                    ATELIER SUBSCRIBERS
                  </div>
                  <div className="font-editorial text-3xl font-bold text-luxury-950">
                    {stats?.counts?.totalSubscribers || 0}
                  </div>
                  <div className="text-[11px] text-luxury-600 mt-1">
                    <span>VIP newsletter list</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown & Top Stories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* Category volume */}
                <div className="border border-luxury-200 p-5 bg-[#fafaf8]">
                  <h4 className="font-editorial text-lg font-bold text-luxury-950 mb-4 pb-2 border-b border-luxury-200">
                    Category Distribution
                  </h4>
                  <div className="space-y-3">
                    {stats?.categoryStats?.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-luxury-800 uppercase tracking-wider">
                          {c.category_name}
                        </span>
                        <div className="flex items-center gap-4 text-luxury-600">
                          <span>{c.post_count} articles</span>
                          <span className="font-mono text-luxury-400">({c.total_views} views)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Read Stories */}
                <div className="border border-luxury-200 p-5 bg-[#fafaf8]">
                  <h4 className="font-editorial text-lg font-bold text-luxury-950 mb-4 pb-2 border-b border-luxury-200">
                    Most Read Editorial Stories
                  </h4>
                  <div className="space-y-3">
                    {stats?.topPosts?.map((tp) => (
                      <div
                        key={tp.id}
                        onClick={() => onSelectPost(tp.slug)}
                        className="flex items-center justify-between text-xs hover:text-gold-700 cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-2">
                          <img src={tp.cover_image} alt="" className="w-8 h-8 object-cover rounded-none shrink-0" />
                          <span className="font-editorial font-bold text-luxury-900 group-hover:text-gold-700 truncate">
                            {tp.title}
                          </span>
                        </div>
                        <span className="font-mono text-luxury-500 shrink-0">
                          {tp.views} views
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="pt-4 border-t border-luxury-200 flex flex-wrap gap-3">
                <button
                  onClick={() => { resetPostForm(); setActiveTab('create'); }}
                  className="px-5 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition flex items-center gap-2"
                >
                  <PlusCircle size={14} />
                  <span>Write New Story</span>
                </button>
                <button
                  onClick={() => setActiveTab('guest')}
                  className="px-5 py-2.5 border border-gold-500 text-luxury-950 font-bold text-xs uppercase tracking-luxury hover:bg-gold-50 transition flex items-center gap-2"
                >
                  <Feather size={14} className="text-gold-600" />
                  <span>Review Guest Pitches ({pendingSubmissionsCount})</span>
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: GUEST SUBMISSIONS EDITORIAL HUB              */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'guest' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                    Guest Contributor Review Desk
                  </h3>
                  <p className="text-xs tracking-wider uppercase text-luxury-500">
                    REVIEW PITCHES, READ FULL MANUSCRIPTS & APPROVE LIVE PUBLISHING
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center space-x-2">
                  {['all', 'pending', 'approved', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setGuestFilter(st)}
                      className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold border transition ${
                        guestFilter === st
                          ? 'bg-luxury-950 text-gold-400 border-luxury-950'
                          : 'bg-white text-luxury-600 border-luxury-300 hover:bg-luxury-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-4">
                {guestSubmissions
                  .filter(s => guestFilter === 'all' || s.status === guestFilter)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-luxury-200 bg-white p-5 hover:border-gold-500/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            sub.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : sub.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          }`}>
                            {sub.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] tracking-wider uppercase font-semibold text-luxury-600">
                            {sub.category_name}
                          </span>
                          <span className="text-[10px] text-luxury-400">
                            • Submitted {new Date(sub.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="font-editorial text-lg font-bold text-luxury-950 leading-snug">
                          {sub.title}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-luxury-600 mt-2">
                          <span className="font-semibold text-luxury-900 uppercase">
                            By {sub.author_name} ({sub.author_email})
                          </span>
                          {sub.author_website && (
                            <a href={sub.author_website} target="_blank" rel="noreferrer" className="text-gold-700 hover:underline flex items-center gap-0.5">
                              <span>Portfolio</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>

                        {sub.pitch_summary && (
                          <p className="text-xs text-luxury-600 font-light italic mt-1 line-clamp-1">
                            "{sub.pitch_summary}"
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => { setSelectedSubmission(sub); setReviewFeedback(sub.editorial_feedback || ''); }}
                          className="px-4 py-2 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 font-bold text-xs uppercase tracking-luxury transition"
                        >
                          Read & Decide
                        </button>

                        <button
                          onClick={() => handleDeleteGuest(sub.id)}
                          className="p-2 text-luxury-400 hover:text-rose-600 transition"
                          title="Delete submission"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                {guestSubmissions.length === 0 && (
                  <p className="text-xs text-luxury-500 py-6 text-center italic">
                    No guest submissions currently in the queue.
                  </p>
                )}
              </div>

              {/* Guest Submission Review Modal */}
              {selectedSubmission && (
                <div className="fixed inset-0 z-50 bg-luxury-950/80 backdrop-blur-sm flex justify-center p-4 overflow-y-auto animate-fadeIn">
                  <div className="bg-[#fafaf8] max-w-2xl w-full my-auto border border-gold-500/50 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-start border-b border-luxury-200 pb-4">
                      <div>
                        <span className="text-[10px] tracking-luxury uppercase font-bold text-gold-600">
                          CONTRIBUTOR MANUSCRIPT REVIEW
                        </span>
                        <h3 className="font-editorial text-2xl font-bold text-luxury-950 mt-1">
                          {selectedSubmission.title}
                        </h3>
                        <p className="text-xs text-luxury-600 mt-1">
                          By <span className="font-bold text-luxury-900">{selectedSubmission.author_name}</span> ({selectedSubmission.author_email})
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="text-luxury-400 hover:text-luxury-950 p-1"
                      >
                        <XCircle size={22} />
                      </button>
                    </div>

                    {/* Author Details Card */}
                    <div className="bg-champagne-50 p-4 border border-gold-300 text-xs space-y-1">
                      <div className="font-bold text-luxury-950 uppercase tracking-wider text-[10px]">
                        Author Credentials & Attribution:
                      </div>
                      <p className="text-luxury-800">Bio: {selectedSubmission.author_bio || 'None provided'}</p>
                      <p className="text-luxury-800">Website: {selectedSubmission.author_website || 'None'}</p>
                      <p className="text-luxury-800">Social: {selectedSubmission.author_social || 'None'}</p>
                    </div>

                    {/* Full Article Content */}
                    <div className="border border-luxury-200 p-4 bg-white max-h-64 overflow-y-auto text-xs leading-relaxed text-luxury-800 font-mono whitespace-pre-wrap">
                      {selectedSubmission.content}
                    </div>

                    {/* Editorial Decision Box */}
                    <div className="space-y-3 pt-2 border-t border-luxury-200">
                      <label className="block text-xs font-bold uppercase tracking-wider text-luxury-800">
                        Editorial Feedback Note to Author:
                      </label>
                      <input
                        type="text"
                        value={reviewFeedback}
                        onChange={(e) => setReviewFeedback(e.target.value)}
                        placeholder="e.g. Magnificent analysis. Accepted for immediate publication."
                        className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                      />

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => handleRejectGuest(selectedSubmission.id)}
                          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs uppercase font-bold tracking-wider"
                        >
                          Reject Pitch
                        </button>

                        <button
                          onClick={() => handleApproveGuest(selectedSubmission.id)}
                          className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-luxury-950 text-xs uppercase font-bold tracking-luxury shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={16} />
                          <span>Approve & Publish Live Story</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: ALL ARTICLES TABLE                            */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                    Editorial Archive & Publishing
                  </h3>
                  <p className="text-xs tracking-wider uppercase text-luxury-500">
                    MANAGE LIVE ARTICLES, DRAFTS, COVER HEROES & TRENDING STATUS
                  </p>
                </div>

                <button
                  onClick={() => { resetPostForm(); setActiveTab('create'); }}
                  className="px-4 py-2 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition flex items-center gap-2 self-start"
                >
                  <PlusCircle size={14} />
                  <span>Create Story</span>
                </button>
              </div>

              {/* Filters Strip */}
              <div className="flex flex-wrap items-center gap-3 bg-[#fafaf8] p-3 border border-luxury-200">
                <input
                  type="text"
                  placeholder="Filter by title or author..."
                  value={postFilter.search}
                  onChange={(e) => setPostFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="p-2 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500 flex-1 min-w-[200px]"
                />

                <select
                  value={postFilter.category}
                  onChange={(e) => setPostFilter(prev => ({ ...prev, category: e.target.value }))}
                  className="p-2 border border-luxury-300 text-xs uppercase tracking-wider bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>

                <select
                  value={postFilter.status}
                  onChange={(e) => setPostFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="p-2 border border-luxury-300 text-xs uppercase tracking-wider bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-luxury-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-luxury-950 text-luxury-200 uppercase tracking-wider text-[10px] font-semibold border-b border-luxury-800">
                    <tr>
                      <th className="p-3">Cover & Article</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Author</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Featured / Trend</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-200">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-luxury-50 transition">
                        {/* Title & Cover */}
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <img src={post.cover_image} alt="" className="w-10 h-10 object-cover shrink-0" />
                            <div className="min-w-0 max-w-xs">
                              <span
                                onClick={() => onSelectPost(post.slug)}
                                className="font-editorial font-bold text-luxury-950 hover:text-gold-700 cursor-pointer line-clamp-1 text-sm"
                              >
                                {post.title}
                              </span>
                              <div className="text-[10px] text-luxury-500 flex items-center gap-2 mt-0.5">
                                <span>{post.views} views</span>
                                <span>•</span>
                                <span>{post.likes} likes</span>
                                {post.is_guest_post && (
                                  <span className="text-gold-700 font-bold uppercase text-[9px]">• Guest Post</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3 uppercase tracking-wider text-[10px] font-semibold text-luxury-700">
                          {post.category_name}
                        </td>

                        {/* Author */}
                        <td className="p-3 uppercase tracking-wider text-[10px] text-luxury-800 font-medium truncate max-w-[120px]">
                          {post.author_name}
                        </td>

                        {/* Status Toggle */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(post.id, post.status)}
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                              post.status === 'published'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {post.status}
                          </button>
                        </td>

                        {/* Featured & Trending toggles */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-2 text-[10px]">
                            <button
                              onClick={() => handleToggleFeatured(post.id)}
                              className={`px-1.5 py-0.5 uppercase tracking-wider font-semibold border ${
                                post.is_featured ? 'bg-gold-500 text-luxury-950 border-gold-600' : 'text-luxury-400 border-luxury-200'
                              }`}
                              title="Toggle Hero Cover Story"
                            >
                              ★ Hero
                            </button>
                            <button
                              onClick={() => handleToggleTrending(post.id)}
                              className={`px-1.5 py-0.5 uppercase tracking-wider font-semibold border ${
                                post.is_trending ? 'bg-luxury-900 text-gold-400 border-luxury-950' : 'text-luxury-400 border-luxury-200'
                              }`}
                              title="Toggle Trending Carousel"
                            >
                              Trending
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-1 text-luxury-600 hover:text-luxury-950"
                              title="Edit Article"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1 text-luxury-400 hover:text-rose-600"
                              title="Delete Article"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 4: WRITE / EDIT ARTICLE COMPONENT               */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-luxury-200 pb-4">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                    {editingPostId ? 'Edit Editorial Story' : 'Compose New Story'}
                  </h3>
                  <p className="text-xs tracking-wider uppercase text-luxury-500">
                    AUTHORITATIVE FASHION ESSAYS, RUNWAY COVERAGE & GUEST ATELIERS
                  </p>
                </div>
                {editingPostId && (
                  <button
                    onClick={resetPostForm}
                    className="text-xs uppercase text-gold-700 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePost} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={postForm.title}
                      onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Sculptural Drapery: How Haute Couture is Redefining 2026 Runways"
                      className="w-full p-3 border border-luxury-300 text-sm font-editorial focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={postForm.slug}
                      onChange={(e) => setPostForm(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="auto-generated-from-title"
                      className="w-full p-2.5 border border-luxury-300 text-xs font-mono focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={postForm.category_name}
                      onChange={(e) => setPostForm(prev => ({ ...prev, category_name: e.target.value }))}
                      className="w-full p-2.5 border border-luxury-300 text-xs uppercase tracking-wider bg-white focus:outline-none focus:border-gold-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Fashion Season Tag
                    </label>
                    <select
                      value={postForm.season}
                      onChange={(e) => setPostForm(prev => ({ ...prev, season: e.target.value }))}
                      className="w-full p-2.5 border border-luxury-300 text-xs uppercase tracking-wider bg-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="Spring / Summer 2026">Spring / Summer 2026</option>
                      <option value="Fall / Winter 2026">Fall / Winter 2026</option>
                      <option value="Resort 2026">Resort 2026</option>
                      <option value="Pre-Fall 2026">Pre-Fall 2026</option>
                      <option value="Archival Review">Archival Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Publishing Status
                    </label>
                    <select
                      value={postForm.status}
                      onChange={(e) => setPostForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2.5 border border-luxury-300 text-xs uppercase tracking-wider bg-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="published">Published Live</option>
                      <option value="draft">Draft (Private)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Subtitle / Editorial Excerpt
                    </label>
                    <input
                      type="text"
                      value={postForm.subtitle}
                      onChange={(e) => setPostForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Brief evocative sentence setting the tone of the critique."
                      className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500 font-cormorant text-base italic"
                    />
                  </div>

                  {/* Cover Photography */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={postForm.cover_image}
                      onChange={(e) => setPostForm(prev => ({ ...prev, cover_image: e.target.value }))}
                      className="w-full p-2.5 border border-luxury-300 text-xs font-mono focus:outline-none focus:border-gold-500"
                    />
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-[10px] text-luxury-500 uppercase font-semibold">Quick Presets:</span>
                      {FASHION_IMAGE_PRESETS.map((p, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setPostForm(prev => ({ ...prev, cover_image: p.url }))}
                          className="text-[10px] px-2 py-0.5 border border-luxury-200 hover:border-gold-500 bg-white"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700">
                        Article Manuscript (Markdown supported) *
                      </label>
                      <span className="text-[10px] text-luxury-500">
                        Use ## for headers, &gt; for blockquotes, - for lists
                      </span>
                    </div>
                    <textarea
                      required
                      rows={10}
                      value={postForm.content}
                      onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your fashion piece..."
                      className="w-full p-3 border border-luxury-300 text-xs leading-relaxed font-sans focus:outline-none focus:border-gold-500"
                    ></textarea>
                  </div>

                  {/* Author Attribution */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={postForm.author_name}
                      onChange={(e) => setPostForm(prev => ({ ...prev, author_name: e.target.value }))}
                      className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                      Thematic Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={postForm.tags}
                      onChange={(e) => setPostForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Couture, Paris, Satin, Fashion Week"
                      className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postForm.is_featured}
                        onChange={(e) => setPostForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="rounded-none text-gold-500"
                      />
                      <span>Make Top Hero Cover Story</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postForm.is_trending}
                        onChange={(e) => setPostForm(prev => ({ ...prev, is_trending: e.target.checked }))}
                        className="rounded-none text-gold-500"
                      />
                      <span>Include in Trending Strip</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postForm.is_guest_post}
                        onChange={(e) => setPostForm(prev => ({ ...prev, is_guest_post: e.target.checked }))}
                        className="rounded-none text-gold-500"
                      />
                      <span>Guest Contributor Post</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-luxury-200 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 font-bold text-xs uppercase tracking-luxury transition"
                  >
                    {editingPostId ? 'Update Article' : 'Publish Story'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 5: CATEGORIES & BREAKING TICKER                 */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              {/* Category manager */}
              <div>
                <h3 className="font-editorial text-2xl font-bold text-luxury-950 mb-1">
                  Fashion Categories
                </h3>
                <p className="text-xs uppercase tracking-wider text-luxury-500 mb-4">
                  MANAGE HIGH FASHION TAXONOMIES & ATELIER SECTIONS
                </p>

                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2 mb-6">
                  <input
                    type="text"
                    required
                    placeholder="New category name (e.g. Resort & Cruise)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                  />
                  <input
                    type="text"
                    placeholder="Brief description"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="flex-1 p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-wider hover:bg-gold-500 hover:text-luxury-950 transition"
                  >
                    Add Category
                  </button>
                </form>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((c) => (
                    <div key={c.id} className="p-3 border border-luxury-200 bg-[#fafaf8] flex items-center justify-between">
                      <div>
                        <span className="font-bold uppercase tracking-wider text-xs text-luxury-900 block">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-luxury-500">
                          {c.post_count || 0} articles published
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="text-luxury-400 hover:text-rose-600 p-1"
                        title="Delete category"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticker manager */}
              <div className="border-t border-luxury-200 pt-6">
                <h3 className="font-editorial text-2xl font-bold text-luxury-950 mb-1">
                  Breaking Runway Ticker Bar
                </h3>
                <p className="text-xs uppercase tracking-wider text-luxury-500 mb-4">
                  CONTROL THE MARQUEE HEADLINES TICKING ACROSS THE TOP OF THE MAGAZINE
                </p>

                <form onSubmit={handleAddTicker} className="flex flex-col sm:flex-row gap-2 mb-6">
                  <input
                    type="text"
                    required
                    placeholder="Headline text (e.g. BALENCIAGA INTRODUCES SCULPTURAL MESH COUTURE)"
                    value={newTickerHeadline}
                    onChange={(e) => setNewTickerHeadline(e.target.value)}
                    className="flex-1 p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                  />
                  <select
                    value={newTickerTag}
                    onChange={(e) => setNewTickerTag(e.target.value)}
                    className="p-2.5 border border-luxury-300 text-xs uppercase tracking-wider bg-white"
                  >
                    <option value="BREAKING">BREAKING</option>
                    <option value="RUNWAY">RUNWAY</option>
                    <option value="EXCLUSIVE">EXCLUSIVE</option>
                    <option value="TREND REPORT">TREND REPORT</option>
                  </select>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-wider hover:bg-gold-500 hover:text-luxury-950 transition"
                  >
                    Add Headline
                  </button>
                </form>

                <div className="space-y-2">
                  {tickerItems.map((item) => (
                    <div key={item.id} className="p-3 border border-luxury-200 bg-white flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="px-1.5 py-0.5 bg-luxury-950 text-gold-400 text-[9px] uppercase font-bold">
                          {item.tag}
                        </span>
                        <span className="font-light text-luxury-800">{item.headline}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteTicker(item.id)}
                        className="text-luxury-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 6: COMMENTS MODERATION                          */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                  Reader Critiques & Dialogue Moderation
                </h3>
                <p className="text-xs tracking-wider uppercase text-luxury-500">
                  MODERATE READERSHIP ENGAGEMENT ACROSS ALL EDITORIAL STORIES
                </p>
              </div>

              <div className="space-y-3">
                {comments.map((cmt) => (
                  <div key={cmt.id} className="p-4 border border-luxury-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold uppercase tracking-wider text-luxury-950">
                          {cmt.author_name}
                        </span>
                        <span className="text-[10px] text-luxury-400">
                          on "{cmt.post_title || 'Story'}"
                        </span>
                      </div>
                      <p className="text-luxury-700 font-light">{cmt.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(cmt.id)}
                      className="p-1.5 text-luxury-400 hover:text-rose-600 self-end sm:self-center"
                      title="Remove comment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-xs text-luxury-500 italic py-4">No comments to moderate.</p>
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 7: VIP SUBSCRIBERS                              */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                  VIP Atelier Subscribers
                </h3>
                <p className="text-xs tracking-wider uppercase text-luxury-500">
                  PRIVATE RUNWAY DISPATCHES MAILING LIST ({subscribers.length} VERIFIED READERS)
                </p>
              </div>

              <div className="border border-luxury-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-luxury-950 text-luxury-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Subscriber Email</th>
                      <th className="p-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-200">
                    {subscribers.map((s) => (
                      <tr key={s.id}>
                        <td className="p-3 font-mono text-luxury-900">{s.email}</td>
                        <td className="p-3 text-luxury-500">{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 8: GOOGLE SHEETS LIVE INTEGRATION               */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'sheets' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="flex items-center gap-2 text-[10px] tracking-luxury uppercase font-bold text-gold-600 mb-1">
                  <FileSpreadsheet size={13} />
                  <span>LIVE SPREADSHEET AUTOMATION</span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950">
                  Google Sheets Form Response Synchronization
                </h3>
                <p className="text-xs tracking-wider uppercase text-luxury-500">
                  ALL GUEST ARTICLES, AD INQUIRIES, CONTACT DISPATCHES & SUBSCRIBERS SYNCED IN REAL TIME
                </p>
              </div>

              {/* Status Header Badge */}
              <div className={`p-4 border flex items-center justify-between text-xs ${
                sheetsConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${sheetsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <div>
                    <span className="font-bold uppercase tracking-wider block">
                      {sheetsConnected ? 'Google Sheet Active & Synchronizing' : 'Awaiting Google Apps Script Webhook'}
                    </span>
                    <span className="text-[11px] opacity-90">
                      {sheetsConnected
                        ? 'Every website form submission is transmitted directly to your Google Sheet in real time.'
                        : 'Connect your Google Sheet below to automatically receive new form responses as they arrive.'}
                    </span>
                  </div>
                </div>

                <a
                  href="/api/forms/export/csv"
                  download="ZAIB_ATTIRE_Responses.csv"
                  className="px-3.5 py-2 bg-white border border-luxury-300 text-luxury-900 hover:bg-luxury-100 transition text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Download size={13} />
                  <span>Download CSV</span>
                </a>
              </div>

              {/* Webhook Configuration Form */}
              <div className="bg-white border border-luxury-200 p-6 shadow-sm space-y-4">
                <h4 className="font-editorial text-lg font-bold text-luxury-950">
                  Google Sheets Webhook URL
                </h4>
                <p className="text-xs text-luxury-600 leading-relaxed font-light">
                  Paste the Web App URL generated from Google Apps Script. Form submissions will immediately trigger an automated row addition into your active Google Sheet.
                </p>

                <form onSubmit={handleSaveSheetsConfig} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={sheetsWebhookUrl}
                    onChange={(e) => setSheetsWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 px-4 py-2.5 bg-luxury-50 border border-luxury-300 font-mono text-xs text-luxury-950 focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="submit"
                    disabled={sheetsSaving}
                    className="px-6 py-2.5 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold shrink-0 disabled:opacity-50"
                  >
                    {sheetsSaving ? 'Saving...' : 'Save Webhook URL'}
                  </button>
                </form>

                {/* Test Connection Button */}
                <div className="pt-3 border-t border-luxury-100 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleTestSheetsSync}
                    disabled={sheetsTesting || !sheetsWebhookUrl}
                    className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition flex items-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={sheetsTesting ? 'animate-spin' : ''} />
                    <span>{sheetsTesting ? 'Transmitting Test Row...' : 'Send Test Row to Google Sheet'}</span>
                  </button>

                  {sheetsTestMsg && (
                    <span className={`text-xs font-semibold ${sheetsTestMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {sheetsTestMsg}
                    </span>
                  )}
                </div>
              </div>

              {/* Step-by-Step Google Apps Script Setup Guide */}
              <div className="bg-white border border-luxury-200 p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="font-editorial text-lg font-bold text-luxury-950 mb-1">
                    How to Connect Your Google Sheet in 3 Minutes
                  </h4>
                  <p className="text-xs text-luxury-600">
                    Follow these simple steps to enable automatic row insertion in your Google Spreadsheet.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-luxury-800">
                  <div className="space-y-3 font-serif">
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-bold font-sans text-[10px] shrink-0">1</span>
                      <p>Open <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-gold-700 font-sans font-bold underline inline-flex items-center gap-0.5">sheets.new <ExternalLink size={10} /></a> to create a new Google Sheet (e.g. named <em>ZAIB ATTIRE Responses</em>).</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-bold font-sans text-[10px] shrink-0">2</span>
                      <p>In the top menu, click <strong className="font-sans text-luxury-950">Extensions</strong> &gt; <strong className="font-sans text-luxury-950">Apps Script</strong>.</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-bold font-sans text-[10px] shrink-0">3</span>
                      <p>Delete any existing code in the editor, copy the script on the right, and paste it into the editor.</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-bold font-sans text-[10px] shrink-0">4</span>
                      <p>Click <strong className="font-sans text-luxury-950">Deploy</strong> &gt; <strong className="font-sans text-luxury-950">New deployment</strong>. In the settings gear, choose <strong className="font-sans text-luxury-950">Web app</strong>.</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-bold font-sans text-[10px] shrink-0">5</span>
                      <p>Set <em>Execute as:</em> <strong>Me</strong>, set <em>Who has access:</em> <strong>Anyone</strong>, and click <strong>Deploy</strong>.</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-bold font-sans text-[10px] shrink-0">6</span>
                      <p>Copy the <strong>Web App URL</strong> and paste it into the box above!</p>
                    </div>
                  </div>

                  {/* Code snippet display */}
                  <div className="bg-luxury-950 text-luxury-200 p-4 border border-luxury-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-luxury-800 text-[10px] uppercase tracking-wider text-gold-400 font-semibold font-sans">
                        <span>Google Apps Script (Code.gs)</span>
                        <button
                          type="button"
                          onClick={handleCopyScript}
                          className="text-white hover:text-gold-400 transition flex items-center gap-1 font-bold"
                        >
                          <Copy size={11} />
                          <span>{copiedScript ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                      </div>
                      <pre className="font-mono text-[10px] leading-relaxed text-luxury-300 max-h-56 overflow-y-auto whitespace-pre-wrap select-all">
                        {sheetsTemplate}
                      </pre>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="mt-3 w-full py-2 bg-luxury-900 border border-gold-500/50 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-[10px] uppercase tracking-luxury font-bold font-sans text-center flex items-center justify-center gap-1.5"
                    >
                      <Copy size={12} />
                      <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Complete Apps Script'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Synchronized Form Responses Table */}
              <div className="bg-white border border-luxury-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-editorial text-lg font-bold text-luxury-950">
                      Recent Synchronized Responses ({sheetsResponses.length})
                    </h4>
                    <p className="text-xs text-luxury-500">
                      All form submissions recorded across the website and queued for Google Sheets.
                    </p>
                  </div>

                  <a
                    href="/api/forms/export/csv"
                    download="ZAIB_ATTIRE_Responses.csv"
                    className="text-xs uppercase tracking-luxury font-bold text-gold-700 hover:underline flex items-center gap-1"
                  >
                    <Download size={12} />
                    <span>Export Full History</span>
                  </a>
                </div>

                <div className="border border-luxury-200 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-luxury-950 text-luxury-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Type</th>
                        <th className="p-3">Name / Brand</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Subject / Title</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-200">
                      {sheetsResponses.map((item, idx) => (
                        <tr key={idx} className="hover:bg-luxury-50 transition">
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-luxury-100 text-luxury-950 text-[9px] uppercase tracking-wider font-bold">
                              {item.type}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-luxury-900">{item.name}</td>
                          <td className="p-3 font-mono text-[11px] text-luxury-600">{item.email}</td>
                          <td className="p-3 text-luxury-800 max-w-xs truncate">{item.title}</td>
                          <td className="p-3 text-luxury-400 text-[10px] whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}

                      {sheetsResponses.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-6 text-center text-luxury-500 italic">
                            No form responses recorded yet. Submissions from Guest Posting, Advertise, Contact, and Newsletter will appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
