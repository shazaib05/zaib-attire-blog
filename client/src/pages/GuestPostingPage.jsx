import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenLine, CheckCircle2, AlertCircle, Link as LinkIcon,
  Bold, Italic, Heading2, Heading3, Quote, List,
  Eye, Edit3, Upload, ExternalLink, Mail, User, Lock, Tag
} from 'lucide-react';
import { api } from '../utils/api';
import SEO from '../components/SEO';

const ALL_NICHES = [
  'Fashion & Haute Couture',
  'Technology & AI',
  'Digital Marketing & SEO',
  'Business & Finance',
  'Health & Fitness',
  'Animation & 3D Design',
  'Gaming & Entertainment',
  'Lifestyle & Travel',
  'Education & Career',
  'Other'
];

export default function GuestPostingPage() {
  const navigate = useNavigate();

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zaib_contributor_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth Form State
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Article Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState(''); // max 120 chars
  const [category, setCategory] = useState(ALL_NICHES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [content, setContent] = useState('');

  // Editor State
  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });

  // Publishing State
  const [publishing, setPublishing] = useState(false);
  const [publishedPost, setPublishedPost] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Direct Instant Sign Up (No social, no email verification needed)
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!email.trim() || !password) {
      setAuthError('Please enter your email address and create a password.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    // Check if email already registered
    let users = [];
    try {
      const u = localStorage.getItem('zaib_registered_users');
      if (u) users = JSON.parse(u);
    } catch {}
    if (users.find(u => u.email === email.trim())) {
      setAuthError('This email is already registered. Please sign in instead.');
      return;
    }

    const displayName = email.trim().split('@')[0];
    const userObj = {
      username: displayName,
      name: displayName,
      email: email.trim(),
      provider: 'email',
      verified: true,
      joined_at: new Date().toISOString()
    };

    users.push({ ...userObj, password });
    localStorage.setItem('zaib_registered_users', JSON.stringify(users));
    localStorage.setItem('zaib_contributor_auth', JSON.stringify(userObj));
    setCurrentUser(userObj);
    window.dispatchEvent(new Event('storage'));
  };

  // 2. Handle Sign In (Email + Password)
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    let users = [];
    try {
      const u = localStorage.getItem('zaib_registered_users');
      if (u) users = JSON.parse(u);
    } catch {}

    const found = users.find(u => u.email === email.trim() && u.password === password);
    if (!found) {
      setAuthError('Incorrect email or password. Please try again.');
      return;
    }
    const userObj = {
      username: found.username,
      name: found.name || found.username,
      email: found.email,
      verified: true
    };
    localStorage.setItem('zaib_contributor_auth', JSON.stringify(userObj));
    setCurrentUser(userObj);
    window.dispatchEvent(new Event('storage'));
  };

  // Cover Image Upload (Required, max 50MB)
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('Image size must be under 50MB.');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target.result);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  // Markdown Formatting Helpers
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('story-content-area');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'Text';
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const handleInsertLink = () => {
    if (!linkData.url.trim()) return;
    const linkText = linkData.text.trim() || linkData.url.trim();
    const markdownLink = `[${linkText}](${linkData.url.trim()})`;
    const textarea = document.getElementById('story-content-area');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + markdownLink + content.substring(end);
      setContent(newContent);
    } else {
      setContent(prev => prev + ' ' + markdownLink);
    }
    setShowLinkModal(false);
    setLinkData({ text: '', url: '' });
  };

  // Article Publishing Logic
  const handlePublish = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validations
    if (!coverImage) {
      setErrorMsg('Please upload a cover image (up to 50MB) for your article.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Article title is required.');
      return;
    }
    if (title.length > 100) {
      setErrorMsg('Title cannot exceed 100 characters.');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('Pitch summary is required.');
      return;
    }
    if (summary.length > 120) {
      setErrorMsg('Summary cannot exceed 120 characters.');
      return;
    }
    if (!content.trim() || content.trim().length < 50) {
      setErrorMsg('Article content must be at least 50 characters.');
      return;
    }

    const finalCategory = category === 'Other' ? (customCategory.trim() || 'General') : category;
    const formattedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    setPublishing(true);

    try {
      const payload = {
        title: title.trim(),
        pitch_summary: summary.trim(),
        category_name: finalCategory,
        content: content.trim(),
        cover_image: coverImage,
        season: 'Spring / Summer 2026',
        tags: formattedTags,
        author_name: currentUser.name || currentUser.username,
        author_email: currentUser.email,
        author_bio: `Guest contributor and writer at ZAIB ATTIRE.`,
        author_website: '',
        author_social: '',
        author_avatar: ''
      };

      const res = await api.submitGuestPost(payload);

      if (res && res.success) {
        // Also save to user's local articles for "My Articles" tracking
        const localPost = {
          id: res.id,
          title: payload.title,
          pitch_summary: payload.pitch_summary,
          category_name: payload.category_name,
          cover_image: payload.cover_image,
          created_at: new Date().toISOString(),
          status: 'pending',
          author_email: currentUser.email
        };

        let userPosts = [];
        try {
          const saved = localStorage.getItem('zaib_user_posts');
          if (saved) userPosts = JSON.parse(saved);
        } catch {}
        userPosts.unshift(localPost);
        localStorage.setItem('zaib_user_posts', JSON.stringify(userPosts));

        setPublishedPost(res);
      } else {
        throw new Error(res?.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error publishing article. Please check your network and try again.');
    } finally {
      setPublishing(false);
    }
  };

  // Sign Out helper
  const handleSignOut = () => {
    localStorage.removeItem('zaib_contributor_auth');
    setCurrentUser(null);
    setAuthMode('signup');
    window.dispatchEvent(new Event('storage'));
  };

  // IF NOT LOGGED IN: Show Clean Direct Sign In / Sign Up Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white py-14 px-5 text-ink-900">
        <SEO title="Sign In / Sign Up | ZAIB ATTIRE" canonicalUrl="/write" />
        <div className="max-w-md mx-auto border border-ink-200 rounded-2xl p-8 bg-white shadow-lg animate-fadeIn">
          
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-ink-500">
              {authMode === 'signin'
                ? 'Sign in to write and manage your articles.'
                : 'Sign up to write and publish articles directly.'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {authError}
            </div>
          )}

          {/* Sign Up Mode â€” Direct Email + Password Only */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:border-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:border-ink-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
              >
                Sign Up
              </button>

              <p className="text-xs text-center text-ink-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                  className="font-bold text-ink-900 underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* Sign In Mode â€” email + password */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:border-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:border-ink-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
              >
                Sign In
              </button>

              <p className="text-xs text-center text-ink-500 pt-2">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                  className="font-bold text-ink-900 underline"
                >
                  Create Account
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    );
  }

  // IF LOGGED IN: Show Article Submission Canvas
  return (
    <div className="min-h-screen bg-sand-50 py-10 px-4 md:px-8 text-ink-900">
      <SEO title="Submit Story | ZAIB ATTIRE" canonicalUrl="/write" />
      <div className="max-w-4xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-ink-200 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold-600 block mb-1">Atelier Studio</span>
            <h1 className="font-serif text-3xl font-bold tracking-tight">Create New Article</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-ink-200 rounded-full text-xs">
              <User className="w-3.5 h-3.5 text-gold-600" />
              <span className="font-medium text-ink-700">{currentUser.name || currentUser.username}</span>
            </div>
            <Link
              to="/my-articles"
              className="px-3.5 py-1.5 border border-ink-300 text-xs font-medium rounded-full hover:bg-white transition"
            >
              My Articles
            </Link>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 text-xs text-red-600 hover:text-red-800 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Success State */}
        {publishedPost ? (
          <div className="bg-white border border-ink-200 rounded-2xl p-8 md:p-12 text-center shadow-sm animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-2">Article Submitted Successfully!</h2>
            <p className="text-sm text-ink-600 max-w-lg mx-auto mb-6">
              Your article <strong>"{publishedPost.title}"</strong> has been submitted to the ZAIB ATTIRE editorial team and is currently under review.
            </p>

            <div className="inline-block p-4 bg-sand-50 border border-ink-200 rounded-xl mb-8 text-left">
              <div className="text-[11px] uppercase tracking-wider text-ink-500 font-semibold mb-1">Tracking ID</div>
              <div className="font-mono text-sm font-bold text-gold-700 select-all">{publishedPost.id}</div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/my-articles"
                className="px-5 py-2.5 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Track in My Articles
              </Link>
              <button
                onClick={() => {
                  setPublishedPost(null);
                  setTitle('');
                  setSummary('');
                  setContent('');
                  setCoverImage('');
                  setImageFileName('');
                  setTags('');
                }}
                className="px-5 py-2.5 border border-ink-300 text-xs font-bold rounded-xl hover:bg-ink-50 transition"
              >
                Write Another Article
              </button>
            </div>
          </div>
        ) : (
          /* Editor Form */
          <form onSubmit={handlePublish} className="space-y-6">
            
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Cover Image Upload (Required, max 50MB) */}
            <div className="bg-white border border-ink-200 rounded-2xl p-6 shadow-sm">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
                Cover Image * <span className="font-normal text-ink-500 lowercase">(required, max 50MB)</span>
              </label>

              {coverImage ? (
                <div className="relative rounded-xl overflow-hidden border border-ink-200 group max-h-72">
                  <img src={coverImage} alt="Cover preview" className="w-full h-72 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white text-ink-900 rounded-lg text-xs font-bold shadow hover:bg-sand-50"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCoverImage(''); setImageFileName(''); }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold shadow hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-ink-200 rounded-xl p-8 text-center cursor-pointer hover:border-gold-500 hover:bg-sand-50/50 transition group"
                >
                  <Upload className="w-8 h-8 text-ink-400 group-hover:text-gold-600 mx-auto mb-2 transition" />
                  <p className="text-xs font-semibold text-ink-700">Click to upload cover image</p>
                  <p className="text-[11px] text-ink-400 mt-1">PNG, JPG, WEBP up to 50MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* 2. Title & Pitch Summary */}
            <div className="bg-white border border-ink-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                    Article Title *
                  </label>
                  <span className={`text-[10px] ${title.length > 100 ? 'text-red-500 font-bold' : 'text-ink-400'}`}>
                    {title.length}/100 max
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Architecture of Minimalist Tailoring: Fall / Winter 2026"
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-base font-serif font-semibold focus:outline-none focus:border-ink-900"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                    Pitch Summary / Subtitle *
                  </label>
                  <span className={`text-[10px] ${summary.length > 120 ? 'text-red-500 font-bold' : 'text-ink-400'}`}>
                    {summary.length}/120 max
                  </span>
                </div>
                <textarea
                  required
                  maxLength={120}
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One or two sharp sentences describing why this story matters to fashion connoisseurs..."
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-xs focus:outline-none focus:border-ink-900 resize-none"
                />
              </div>
            </div>

            {/* 3. Category & Tags */}
            <div className="bg-white border border-ink-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">
                  Category / Niche *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-xs bg-white focus:outline-none focus:border-ink-900"
                >
                  {ALL_NICHES.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom niche name"
                    className="w-full mt-2 px-3 py-2 border border-ink-200 rounded-xl text-xs focus:outline-none focus:border-ink-900"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">
                  Tags <span className="font-normal text-ink-400 lowercase">(comma separated)</span>
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-400" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="couture, silk, tailoring, milan"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-ink-200 rounded-xl text-xs focus:outline-none focus:border-ink-900"
                  />
                </div>
              </div>
            </div>

            {/* 4. Article Content Editor */}
            <div className="bg-white border border-ink-200 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ink-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-700">
                  Article Body * <span className="font-normal text-ink-400 lowercase">(markdown supported, min 50 chars)</span>
                </label>

                {/* Mode Toggle & Formatting Tools */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                      editorMode === 'edit' ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-sand-50'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                      editorMode === 'preview' ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-sand-50'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
              </div>

              {editorMode === 'edit' && (
                <>
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-sand-50 rounded-xl border border-ink-100 text-xs">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 hover:bg-white rounded border border-transparent hover:border-ink-200 transition"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5 text-ink-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 hover:bg-white rounded border border-transparent hover:border-ink-200 transition"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5 text-ink-700" />
                    </button>
                    <div className="w-[1px] h-4 bg-ink-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ')}
                      className="p-1.5 hover:bg-white rounded border border-transparent hover:border-ink-200 transition"
                      title="Heading 2"
                    >
                      <Heading2 className="w-3.5 h-3.5 text-ink-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      className="p-1.5 hover:bg-white rounded border border-transparent hover:border-ink-200 transition"
                      title="Heading 3"
                    >
                      <Heading3 className="w-3.5 h-3.5 text-ink-700" />
                    </button>
                    <div className="w-[1px] h-4 bg-ink-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ')}
                      className="p-1.5 hover:bg-white rounded border border-transparent hover:border-ink-200 transition"
                      title="Quote"
                    >
                      <Quote className="w-3.5 h-3.5 text-ink-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      className="p-1.5 hover:bg-white rounded border border-transparent hover:border-ink-200 transition"
                      title="Bullet list"
                    >
                      <List className="w-3.5 h-3.5 text-ink-700" />
                    </button>
                    <div className="w-[1px] h-4 bg-ink-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(true)}
                      className="p-1.5 hover:bg-white rounded border border-transparent hover:border-ink-200 transition flex items-center gap-1 text-[11px] font-semibold text-ink-700"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-ink-700" />
                      <span>Link</span>
                    </button>
                  </div>

                  <textarea
                    id="story-content-area"
                    required
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Draft your fashion dispatch here in markdown...&#10;&#10;## The New Silhouette&#10;Describe the runway presentation, textures, and craftmanship."
                    className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm leading-relaxed font-sans focus:outline-none focus:border-ink-900"
                  />
                </>
              )}

              {editorMode === 'preview' && (
                <div className="min-h-[380px] p-6 bg-sand-50/50 border border-ink-200 rounded-xl prose prose-sm max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap font-serif leading-relaxed text-ink-800">
                      {content}
                    </div>
                  ) : (
                    <p className="text-ink-400 italic text-center py-12">Nothing to preview yet. Switch back to Write mode to draft your article.</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={publishing}
                className="px-8 py-3.5 bg-ink-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {publishing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <PenLine className="w-4 h-4" />
                    Publish Article Live
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Link Insertion Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-ink-200 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleIn">
            <h3 className="font-serif text-lg font-bold mb-4">Insert Link</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Display Text</label>
                <input
                  type="text"
                  value={linkData.text}
                  onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                  placeholder="e.g., Spring 2026 Collection"
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-xs focus:outline-none focus:border-ink-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">URL *</label>
                <input
                  type="url"
                  required
                  value={linkData.url}
                  onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-xs focus:outline-none focus:border-ink-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 border border-ink-200 rounded-lg text-xs font-semibold hover:bg-sand-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 bg-ink-900 text-white rounded-lg text-xs font-bold hover:bg-black"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
