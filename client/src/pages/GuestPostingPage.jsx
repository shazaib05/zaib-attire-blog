import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PenLine, CheckCircle2, AlertCircle, Link as LinkIcon,
  Bold, Italic, Heading2, Heading3, Quote, List,
  Eye, Edit3, Upload, Image as ImageIcon, ExternalLink,
  ShieldCheck, Mail, ArrowRight, User
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

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zaib_contributor_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sign in / Sign up modal state
  const [authStep, setAuthStep] = useState('input'); // 'input' | 'verify'
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [authError, setAuthError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ALL_NICHES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [content, setContent] = useState('');

  // Editor modal state
  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });

  // Publishing state
  const [publishing, setPublishing] = useState(false);
  const [publishedPost, setPublishedPost] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Handle Send Verification Code
  const handleSendCode = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authName.trim()) {
      setAuthError('Please enter both your name and email.');
      return;
    }
    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setAuthStep('verify');
  };

  // Handle Verify Code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setAuthError('');
    if (inputCode.trim() !== generatedCode) {
      setAuthError('Invalid verification code. Please check and try again.');
      return;
    }
    const userObj = {
      name: authName.trim(),
      email: authEmail.trim(),
      verified: true,
      joined_at: new Date().toISOString()
    };
    localStorage.setItem('zaib_contributor_auth', JSON.stringify(userObj));
    setCurrentUser(userObj);
  };

  // Handle Image Upload (up to 50MB)
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

  // Insert markdown formatting
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

  // Instant Free Publish
  const handlePublish = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter an article title.');
      return;
    }
    if (wordCount < 50) {
      setErrorMsg('Please write at least 50 words for your article.');
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
        category_name: finalCategory,
        content: content,
        summary: content.substring(0, 180).trim() + '...',
        cover_image: coverImage || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        author_name: currentUser?.name || 'Guest Contributor',
        author_email: currentUser?.email || '',
        read_time: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
        views: 1,
        likes: 0,
        created_at: new Date().toISOString()
      };

      // 1. Save directly into live posts via api.createPost
      await api.createPost(newArticle);

      // 2. Save into contributor's personal published articles list
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

  return (
    <div className="min-h-screen bg-white py-10 sm:py-14 text-ink-900">
      <SEO
        title="Article Submission - Guest Post | ZAIB ATTIRE"
        description="Submit your guest post and article for instant publication."
        canonicalUrl="/write"
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8">

        {/* Clean Header */}
        <div className="pb-6 mb-8 border-b border-ink-200">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight mb-2">
            Article Submission
          </h1>
          <p className="text-sm text-ink-500">
            Guest post submission and instant publication.
          </p>
        </div>

        {/* User Auth Banner if not logged in */}
        {!currentUser && (
          <div className="mb-8 border border-ink-200 rounded-2xl p-6 bg-[#fafaf8] shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <User size={18} className="text-ink-900" />
              <h3 className="font-serif text-lg font-bold text-ink-900">
                Sign In / Sign Up to Publish
              </h3>
            </div>
            <p className="text-xs text-ink-500 mb-5">
              Enter your name and email to receive a quick verification code before publishing.
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                {authError}
              </div>
            )}

            {authStep === 'input' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Alex Hunter"
                      className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-ink-900 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm focus:outline-none focus:border-ink-900 transition"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-lg transition"
                >
                  Send Verification Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                  A verification code has been generated for <strong>{authEmail}</strong>: <span className="font-mono font-bold text-sm ml-1 bg-white px-2 py-0.5 rounded border border-emerald-300">{generatedCode}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">Enter Verification Code</label>
                  <input
                    type="text"
                    required
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter 4-digit code"
                    className="w-48 px-3.5 py-2 bg-white border border-ink-200 rounded-lg text-sm font-mono tracking-widest focus:outline-none focus:border-ink-900 transition"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-ink-900 hover:bg-black text-white text-xs font-bold rounded-lg transition"
                  >
                    Verify & Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthStep('input')}
                    className="text-xs text-ink-500 hover:text-ink-900"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SUCCESS POPUP AFTER DIRECT PUBLISH */}
        {publishedPost ? (
          <div className="border border-emerald-200 rounded-2xl p-8 text-center bg-emerald-50/50 shadow-xs animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mb-2">
              Article Published Successfully!
            </h2>
            <p className="text-sm text-ink-600 mb-4">
              Your article is live right now and can be viewed anywhere without login:
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
                  setContent('');
                  setCoverImage('');
                  setImageFileName('');
                }}
                className="btn-ghost text-xs py-2.5 px-5"
              >
                Submit Another Article
              </button>
            </div>
          </div>
        ) : (
          /* MAIN CLEAN SUBMISSION FORM */
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
                Article Title *
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

            {/* 2. Topic / Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
                Topic Category *
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

            {/* 3. Feature Cover Photo (Direct Upload up to 50MB) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
                Feature Cover Photo (Up to 50MB)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-ink-200 hover:border-ink-900 rounded-xl p-6 text-center cursor-pointer transition bg-[#fafaf8]"
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
                      className="max-h-48 rounded-lg mx-auto object-cover shadow-xs"
                    />
                    <p className="text-xs text-ink-500 font-medium">{imageFileName} (Click to change)</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload size={24} className="mx-auto text-ink-400" />
                    <p className="text-sm font-medium text-ink-800">Click to upload cover photo</p>
                    <p className="text-xs text-ink-400">PNG, JPG, WEBP up to 50MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Story Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-600">
                  Story Content *
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

                    {/* Clean Chain Link Icon only (No extra text) */}
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(true)}
                      className="p-1.5 hover:bg-ink-200 text-ink-900 rounded"
                      title="Insert Anchor Link"
                    >
                      <LinkIcon size={15} />
                    </button>

                    <div className="ml-auto text-xs text-ink-400 font-mono">
                      {wordCount} words
                    </div>
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
                <div className="border border-ink-200 rounded-xl p-6 bg-white min-h-[300px] prose max-w-none">
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
              disabled={publishing || !currentUser}
              className="w-full py-4 bg-ink-900 hover:bg-black text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {publishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Article...</span>
                </>
              ) : (
                <span>Publish</span>
              )}
            </button>

            {!currentUser && (
              <p className="text-xs text-center text-ink-400">
                Please verify your name & email above to enable the Publish button.
              </p>
            )}

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
