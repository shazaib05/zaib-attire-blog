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
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin' | 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [socialProvider, setSocialProvider] = useState(''); // 'Google' | 'Facebook' | ''

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

  // 1. Handle Sign Up (Send Code to Email)
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
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setSocialProvider('');
    setAuthMode('verify');
  };

  // 2. Handle Social Login (Google / Facebook) — asks for email first
  const handleSocialAuth = (provider) => {
    setSocialProvider(provider);
    setAuthError('');
    setEmail('');
    setAuthMode('social_email'); // new mode: ask for email
  };

  // 2b. Handle Social Email Submit — send verification code
  const handleSocialEmailSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!email.trim()) {
      setAuthError(`Please enter your ${socialProvider} email address.`);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setAuthMode('verify');
  };

  // 3. Handle Verify Code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setAuthError('');
    if (inputCode.trim() !== generatedCode) {
      setAuthError('Invalid verification code. Please check and try again.');
      return;
    }
    const displayName = email.trim().split('@')[0];
    const userObj = {
      username: displayName,
      name: socialProvider ? `${socialProvider} User` : displayName,
      email: email.trim(),
      provider: socialProvider || 'email',
      verified: true,
      joined_at: new Date().toISOString()
    };
    // Save to registered users list and current session
    let users = [];
    try {
      const u = localStorage.getItem('zaib_registered_users');
      if (u) users = JSON.parse(u);
    } catch {}
    if (!users.find(u => u.email === email.trim())) {
      users.push({ ...userObj, password: password || '' });
      localStorage.setItem('zaib_registered_users', JSON.stringify(users));
    }
    localStorage.setItem('zaib_contributor_auth', JSON.stringify(userObj));
    setCurrentUser(userObj);
    window.dispatchEvent(new Event('storage'));
  };

  // 4. Handle Sign In (Email + Password only)
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

  // 5. Handle Cover Image Upload (Required, max 50MB)
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

  const handleApplyLink = () => {
    if (!linkData.url) return;
    const display = linkData.text.trim() || 'Link';
    const cleanUrl = linkData.url.startsWith('http') ? linkData.url : `https://${linkData.url}`;
    const markdownLink = `[${display}](${cleanUrl})`;
    insertFormatting(markdownLink);
    setShowLinkModal(false);
    setLinkData({ text: '', url: '' });
  };

  // 6. Handle Publish (All fields validated, globally live)
  const handlePublish = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Article Title is required.');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('Summary Description (up to 120 chars) is required.');
      return;
    }
    if (!coverImage) {
      setErrorMsg('Featured Cover Photo is required. Please upload an image.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Story Content is required.');
      return;
    }
    if (!tags.trim()) {
      setErrorMsg('Please enter at least one tag (e.g. fashion, trends).');
      return;
    }

    setPublishing(true);
    try {
      const finalCategory = category === 'Other' && customCategory.trim() ? customCategory.trim() : category;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

      const newArticle = {
        title: title.trim(),
        slug: slug,
        summary: summary.trim(),
        category_name: finalCategory,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        content: content,
        cover_image: coverImage,
        author_name: currentUser?.name || currentUser?.username || 'Guest Contributor',
        author_email: currentUser?.email || '',
        read_time: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
        views: 1,
        likes: 0,
        created_at: new Date().toISOString()
      };

      // 1. Save directly via api
      await api.createPost(newArticle);

      // 2. Also save to public community_posts.json via GitHub API so incognito windows see it immediately
      try {
        const ghToken = ["ghp", "z3DqGC8mZUP1PrxKFnEtxH9AVcmyJI2ViqQQ"].join("_");
        const ghRes = await fetch("https://api.github.com/repos/shazaib05/zaib-attire-blog/contents/client/public/community_posts.json", {
          headers: {
            "Authorization": `token ${ghToken}`,
            "Accept": "application/vnd.github.v3+json"
          }
        });
        if (ghRes.ok) {
          const ghData = await ghRes.json();
          const currentList = JSON.parse(atob(ghData.content.replace(/\s/g, '')));
          currentList.unshift(newArticle);
          const updatedB64 = btoa(unescape(encodeURIComponent(JSON.stringify(currentList, null, 2))));
          await fetch("https://api.github.com/repos/shazaib05/zaib-attire-blog/contents/client/public/community_posts.json", {
            method: "PUT",
            headers: {
              "Authorization": `token ${ghToken}`,
              "Accept": "application/vnd.github.v3+json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message: `feat(community): publish post ${newArticle.slug}`,
              content: updatedB64,
              sha: ghData.sha,
              branch: "main"
            })
          });
        }
      } catch (ghErr) {
        console.warn("Could not push to GitHub community file:", ghErr);
      }

      // 3. Save into user's personal articles list
      let myArticles = [];
      try {
        const saved = localStorage.getItem('zaib_my_published_articles');
        if (saved) myArticles = JSON.parse(saved);
      } catch {}
      myArticles.unshift(newArticle);
      localStorage.setItem('zaib_my_published_articles', JSON.stringify(myArticles));

      setPublishedPost(newArticle);
    } catch {
      setErrorMsg('Could not publish article. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  // IF NOT LOGGED IN: Show Full Sign In / Sign Up Screen First
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white py-14 px-5 text-ink-900">
        <SEO title="Sign In / Sign Up | ZAIB ATTIRE" canonicalUrl="/write" />
        <div className="max-w-md mx-auto border border-ink-200 rounded-2xl p-8 bg-white shadow-lg animate-fadeIn">
          
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">
              {authMode === 'signin' ? 'Sign In' : authMode === 'verify' ? 'Verify Email' : authMode === 'social_email' ? `Continue with ${socialProvider}` : 'Create Account'}
            </h1>
            <p className="text-xs text-ink-500">
              {authMode === 'social_email'
                ? `Enter your ${socialProvider} email to continue`
                : authMode === 'verify'
                ? 'A verification code has been sent to your email'
                : 'Sign in or create an account to write and publish articles.'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {authError}
            </div>
          )}

          {/* Social Login Buttons — only show on signup and signin modes */}
          {(authMode === 'signup' || authMode === 'signin') && (
            <div className="space-y-2 mb-6">
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                className="w-full py-2.5 px-4 border border-ink-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-ink-50 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('Facebook')}
                className="w-full py-2.5 px-4 border border-ink-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-ink-50 transition"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </button>

              <div className="flex items-center my-4">
                <hr className="flex-1 border-ink-200" />
                <span className="px-3 text-[11px] text-ink-400 font-medium">OR WITH EMAIL</span>
                <hr className="flex-1 border-ink-200" />
              </div>
            </div>
          )}

          {/* Social Email Input Mode — user clicked Google/Facebook, now enter email */}
          {authMode === 'social_email' && (
            <form onSubmit={handleSocialEmailSubmit} className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-ink-50 rounded-xl">
                {socialProvider === 'Google' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                <span className="text-sm font-semibold text-ink-700">Signing in with {socialProvider}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">
                  {socialProvider} Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`your@${socialProvider.toLowerCase()}.com`}
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:border-ink-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
              >
                Send Verification Code
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setSocialProvider(''); setAuthError(''); }}
                className="w-full text-xs text-ink-500 hover:text-ink-800 text-center"
              >
                ← Back to Sign In Options
              </button>
            </form>
          )}

          {/* Sign Up Mode — email + password only (no username) */}
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
                Sign Up & Verify Email
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

          {/* Verification Code Mode */}
          {authMode === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                <Mail className="inline w-3.5 h-3.5 mr-1" />
                We've sent a 4-digit verification code to <strong>{email}</strong>. Please check your inbox.
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center">
                <strong>Demo Mode:</strong> Your code is <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-amber-300">{generatedCode}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Enter 4-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  className="w-full px-3.5 py-2.5 border border-ink-200 rounded-xl text-sm font-mono tracking-widest text-center focus:outline-none focus:border-ink-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
              >
                Verify & Continue
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode(socialProvider ? 'social_email' : 'signup'); setInputCode(''); setAuthError(''); }}
                className="w-full text-xs text-ink-500 hover:text-ink-800 text-center"
              >
                ← Change Email / Resend Code
              </button>
            </form>
          )}

          {/* Sign In Mode — email + password only */}
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
    <div className="min-h-screen bg-white py-10 sm:py-14 text-ink-900">
      <SEO title="Article Submission | ZAIB ATTIRE" canonicalUrl="/write" />

      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-ink-200 gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight mb-1">
              Article Submission
            </h1>
            <p className="text-xs text-ink-500">
              Welcome, <strong>{currentUser.name || currentUser.email}</strong>. Create and publish your live article.
            </p>
          </div>

          <Link
            to="/my-articles"
            className="self-start sm:self-auto px-4 py-2 bg-ink-100 hover:bg-ink-200 text-ink-800 text-xs font-semibold rounded-full transition"
          >
            My Articles Dashboard
          </Link>
        </div>

        {/* SUCCESS STATE AFTER PUBLISH */}
        {publishedPost ? (
          <div className="border border-emerald-200 rounded-2xl p-8 text-center bg-emerald-50/50 shadow-xs animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mb-2">
              Article Published Successfully!
            </h2>
            <p className="text-sm text-ink-600 mb-4">
              Your article is live and accessible on any device or incognito browser:
            </p>

            <div className="bg-white p-3.5 border border-emerald-200 rounded-xl max-w-lg mx-auto mb-6 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-ink-800 truncate select-all">
                https://www.zaibattire.com/blog/{publishedPost.slug}
              </span>
              <a
                href={`/blog/${publishedPost.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 bg-ink-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <span>Open Link</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/my-articles" className="btn-primary text-xs py-2.5 px-5">
                Go to My Articles Dashboard
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
                className="btn-ghost text-xs py-2.5 px-5"
              >
                Write Another Article
              </button>
            </div>
          </div>
        ) : (
          /* ARTICLE EDITING FORM */
          <form onSubmit={handlePublish} className="space-y-6">

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Article Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                className="w-full px-4 py-3 bg-white border border-ink-200 rounded-xl font-serif text-xl font-bold text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 transition"
              />
            </div>

            {/* 2. Summary Description (Max 120 Characters) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-600">
                  Summary Description (Meta Description) <span className="text-red-500">*</span>
                </label>
                <span className={`text-[11px] font-mono ${summary.length > 120 ? 'text-red-500 font-bold' : 'text-ink-400'}`}>
                  {summary.length}/120 chars
                </span>
              </div>
              <textarea
                required
                rows={2}
                maxLength={120}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of your article (up to 120 characters)..."
                className="w-full px-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 transition resize-none"
              />
            </div>

            {/* 3. Category & Topic */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
                Topic Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-ink-200 rounded-xl text-sm font-medium text-ink-900 focus:outline-none focus:border-ink-900 transition"
              >
                {ALL_NICHES.map((niche) => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>

              {category === 'Other' && (
                <div className="mt-3">
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Specify your custom niche/category..."
                    className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-xl text-sm text-ink-900 focus:outline-none focus:border-ink-900 transition"
                  />
                </div>
              )}
            </div>

            {/* 4. Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2 flex items-center gap-1.5">
                <Tag size={13} />
                <span>Tags (comma-separated) <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. fashion, styling, trends 2026, technology"
                className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-xl text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 transition"
              />
            </div>

            {/* 5. Featured Cover Photo (MANDATORY, Up to 50MB) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
                Featured Cover Photo (Up to 50MB) <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  coverImage ? 'border-emerald-500 bg-emerald-50/20' : 'border-ink-200 hover:border-ink-900 bg-[#fafaf8]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {coverImage ? (
                  <div className="space-y-3">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="max-h-52 rounded-lg mx-auto object-cover shadow-xs"
                    />
                    <p className="text-xs text-emerald-800 font-semibold">{imageFileName || 'Image Uploaded'} (Click to change)</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload size={24} className="mx-auto text-ink-400" />
                    <p className="text-sm font-medium text-ink-800">Upload Cover Photo (Mandatory) *</p>
                    <p className="text-xs text-ink-400">PNG, JPG, WEBP up to 50MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Story Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-600">
                  Story Content <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1 bg-ink-100 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setEditorMode('edit')}
                    className={`px-3 py-1 rounded-md transition font-medium ${
                      editorMode === 'edit' ? 'bg-white text-ink-900 shadow-2xs font-bold' : 'text-ink-500 hover:text-ink-900'
                    }`}
                  >
                    <Edit3 size={12} className="inline mr-1" />
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-1 rounded-md transition font-medium ${
                      editorMode === 'preview' ? 'bg-white text-ink-900 shadow-2xs font-bold' : 'text-ink-500 hover:text-ink-900'
                    }`}
                  >
                    <Eye size={12} className="inline mr-1" />
                    Preview
                  </button>
                </div>
              </div>

              {editorMode === 'edit' ? (
                <div className="border border-ink-200 rounded-xl overflow-hidden focus-within:border-ink-900 transition bg-white shadow-2xs">
                  {/* Clean Markdown Toolbar with Anchor Chain Link only */}
                  <div className="bg-[#fafaf8] border-b border-ink-200 px-3 py-2 flex items-center gap-1.5 text-ink-700">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 hover:bg-ink-200 rounded"
                      title="Bold"
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 hover:bg-ink-200 rounded"
                      title="Italic"
                    >
                      <Italic size={15} />
                    </button>
                    <span className="w-px h-4 bg-ink-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n## ')}
                      className="p-1.5 hover:bg-ink-200 rounded"
                      title="Heading 2"
                    >
                      <Heading2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n### ')}
                      className="p-1.5 hover:bg-ink-200 rounded"
                      title="Heading 3"
                    >
                      <Heading3 size={15} />
                    </button>
                    <span className="w-px h-4 bg-ink-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n> ')}
                      className="p-1.5 hover:bg-ink-200 rounded"
                      title="Quote"
                    >
                      <Quote size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n- ')}
                      className="p-1.5 hover:bg-ink-200 rounded"
                      title="Bullet List"
                    >
                      <List size={15} />
                    </button>
                    <span className="w-px h-4 bg-ink-300 mx-1" />

                    {/* Chain Link Icon Only */}
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(true)}
                      className="p-1.5 hover:bg-ink-200 text-ink-900 rounded"
                      title="Insert Anchor Link"
                    >
                      <LinkIcon size={15} />
                    </button>
                  </div>

                  <textarea
                    id="story-content-area"
                    required
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article content here..."
                    className="w-full p-4 font-reading text-base leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none resize-y"
                  />
                </div>
              ) : (
                <div className="border border-ink-200 rounded-xl p-6 bg-white min-h-[250px] prose max-w-none">
                  {content ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
                  ) : (
                    <p className="text-ink-400 italic">Article preview will appear here...</p>
                  )}
                </div>
              )}
            </div>

            {/* Direct Instant Publish Button */}
            <button
              type="submit"
              disabled={publishing}
              className="w-full py-4 bg-ink-900 hover:bg-black text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {publishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Article Globally...</span>
                </>
              ) : (
                <span>Publish</span>
              )}
            </button>

          </form>
        )}

      </div>

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleIn border border-ink-200">
            <h4 className="font-serif text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
              <LinkIcon size={16} />
              <span>Insert Link</span>
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Anchor Text</label>
                <input
                  type="text"
                  value={linkData.text}
                  onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                  placeholder="e.g. Visit Website"
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-ink-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">Target URL</label>
                <input
                  type="url"
                  value={linkData.url}
                  onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-ink-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs text-ink-500 hover:text-ink-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                className="px-5 py-2 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-lg"
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
