import React, { useState, useEffect } from 'react';
import {
  Sparkles, Feather, Send, Search, CheckCircle2, AlertCircle,
  HelpCircle, Image as ImageIcon, Globe, User, BookOpen, Clock,
  ArrowRight, Check, Award, Compass, Share2, Link as LinkIcon,
  Bold, Italic, Heading2, Heading3, Quote, List, Eye, Edit3,
  Lock, KeyRound, Mail, Building, LogOut, CheckCircle
} from 'lucide-react';
import { api } from '../utils/api';
import SEO from '../components/SEO';

const FASHION_IMAGE_PRESETS = [
  { label: 'Paris Atelier High Fashion', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Runway Model Silhouette', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Urban Street Style Minimalist', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quiet Luxury Wool & Cashmere', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sustainable Eco Silk & Botanics', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sculptural Footwear & Jewelry', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80' },
];

export default function GuestPostingPage({ categories = [] }) {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'track' | 'guidelines'

  // Contributor Authentication State
  const [contributor, setContributor] = useState(() => {
    try {
      const saved = localStorage.getItem('zaib_contributor_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    brand_name: '',
    brand_website: ''
  });
  const [authError, setAuthError] = useState('');

  // Submission Form State
  const [formData, setFormData] = useState({
    title: '',
    pitch_summary: '',
    category_name: categories[0]?.name || 'Haute Couture',
    season: 'Spring / Summer 2026',
    content: '',
    cover_image: FASHION_IMAGE_PRESETS[0].url,
    tags: '',
    author_name: '',
    author_email: '',
    author_bio: '',
    author_website: '',
    author_social: '',
    author_avatar: ''
  });

  // Editor states
  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });

  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pre-fill author info if contributor is logged in
  useEffect(() => {
    if (contributor) {
      setFormData(prev => ({
        ...prev,
        author_name: prev.author_name || contributor.name || '',
        author_email: prev.author_email || contributor.email || '',
        author_website: prev.author_website || contributor.brand_website || '',
        author_bio: prev.author_bio || `Editorial contributor representing ${contributor.brand_name || 'independent fashion atelier'}.`
      }));
    }
  }, [contributor]);

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authForm.email || !authForm.password) {
      setAuthError('Please enter your email and password.');
      return;
    }

    if (authMode === 'signup' && !authForm.name) {
      setAuthError('Please provide your author / contact name.');
      return;
    }

    const userData = {
      name: authForm.name || authForm.email.split('@')[0],
      email: authForm.email.trim(),
      brand_name: authForm.brand_name || 'Independent Brand',
      brand_website: authForm.brand_website || '',
      joined_at: new Date().toISOString()
    };

    // Save locally
    localStorage.setItem('zaib_contributor_auth', JSON.stringify(userData));
    setContributor(userData);

    // Sync Contributor registration to Google Sheet lead table
    try {
      await api.submitContactMessage({
        name: userData.name,
        email: userData.email,
        subject: `New Contributor Registered: ${userData.brand_name}`,
        department: 'Contributor Registration & Guest Author',
        message: `Registered for Guest Posting.\nBrand Name: ${userData.brand_name}\nWebsite / Backlink URL: ${userData.brand_website}`
      });
    } catch {}
  };

  const handleSignOut = () => {
    localStorage.removeItem('zaib_contributor_auth');
    setContributor(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePresetSelect = (url) => {
    setFormData(prev => ({ ...prev, cover_image: url }));
  };

  // Editor Toolbar Helpers
  const insertText = (before, after = '') => {
    const textarea = document.getElementById('article-content-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.content.substring(start, end) || 'text';
    const replacement = `${before}${selected}${after}`;

    const newContent =
      formData.content.substring(0, start) +
      replacement +
      formData.content.substring(end);

    setFormData(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 50);
  };

  const handleInsertLink = (e) => {
    e.preventDefault();
    if (!linkData.url) return;

    const anchorText = linkData.text.trim() || contributor?.brand_name || 'Visit Brand Website';
    const url = linkData.url.startsWith('http') ? linkData.url : `https://${linkData.url}`;
    const markdownLink = `[${anchorText}](${url})`;

    const textarea = document.getElementById('article-content-editor');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        formData.content.substring(0, start) +
        markdownLink +
        formData.content.substring(end);
      setFormData(prev => ({ ...prev, content: newContent }));
    } else {
      setFormData(prev => ({ ...prev, content: prev.content + ` ${markdownLink}` }));
    }

    setShowLinkModal(false);
    setLinkData({ text: '', url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Please enter an Article Headline.');
      return;
    }
    if (!formData.cover_image) {
      setErrorMsg('Featured Image is required. Please pick a preset or provide an image URL.');
      return;
    }
    if (!formData.content.trim() || formData.content.trim().split(/\s+/).length < 20) {
      setErrorMsg('Please compose full article content (at least 20 words) with your insights.');
      return;
    }
    if (!formData.author_name || !formData.author_email) {
      setErrorMsg('Author name and email are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        author_name: formData.author_name || contributor?.name,
        author_email: formData.author_email || contributor?.email,
        author_website: formData.author_website || contributor?.brand_website
      };

      const res = await api.submitGuestPost(payload);
      if (res.success) {
        setSubmittedResult(res);
      } else {
        setErrorMsg(res.error || 'Failed to submit article.');
      }
    } catch {
      setErrorMsg('Network error while transmitting your submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await api.checkGuestStatus(trackId.trim());
      if (res.error) {
        setTrackingError(res.error);
      } else {
        setTrackingResult(res);
      }
    } catch {
      setTrackingError('Could not locate any guest submission with this Tracking ID.');
    } finally {
      setTrackingLoading(false);
    }
  };

  // Render article content preview with active clickable anchor links & markdown
  const renderPreviewContent = (text) => {
    if (!text) return <p className="italic text-luxury-400">Article preview will appear here...</p>;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="font-editorial text-lg font-bold text-luxury-900 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="font-editorial text-xl font-bold text-luxury-950 mt-6 mb-3 pb-1 border-b border-luxury-200">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-gold-500 pl-4 py-1.5 my-3 italic font-serif text-luxury-800 bg-luxury-50/50">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc text-luxury-700 my-1">{line.replace('- ', '')}</li>;
      }

      // Parse markdown links [Anchor Text](URL) into live styled hyperlinks
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <a
            key={match.index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-700 underline font-semibold hover:text-gold-600 transition"
            title={`Dofollow Backlink to ${match[2]}`}
          >
            {match[1]}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return line.trim() ? (
        <p key={idx} className="my-2 leading-relaxed text-luxury-800 font-serif">
          {parts.length > 0 ? parts : line}
        </p>
      ) : <br key={idx} />;
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] py-8 sm:py-12 animate-fadeIn font-sans">
      <SEO
        title="Write an Article — Free Guest Posting & Contributor Platform"
        description="Publish high-authority fashion guest posts with brand backlinks on ZAIB ATTIRE. Reach luxury readers, fashion critics, and runway journalists with free guest posting."
        keywords="write for us fashion, fashion guest post, free guest posting, submit guest article, fashion backlink, fashion brand guest post, submit runway story"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Masthead Header */}
        <div className="border-b border-luxury-300 pb-8 mb-8 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-luxury uppercase font-bold text-gold-600 mb-2">
            <Feather size={13} />
            <span>GLOBAL CONTRIBUTOR DESK • FREE GUEST POSTING</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-luxury-950 mb-3">
            Write For ZAIB ATTIRE
          </h1>
          <p className="font-cormorant text-base sm:text-xl text-luxury-600 leading-relaxed italic">
            Publish your fashion trend analysis, brand story, or runway critique. Gain authority, reach high-fashion tastemakers, and secure permanent dofollow backlinks to your brand.
          </p>
        </div>

        {/* Value Proposition Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-left">
          <div className="bg-white border border-luxury-200 p-5 shadow-xs">
            <div className="w-8 h-8 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-xs mb-3">
              01
            </div>
            <h4 className="font-editorial text-sm font-bold text-luxury-950 mb-1">
              Dofollow Brand Backlinks
            </h4>
            <p className="text-[11px] text-luxury-600 leading-relaxed">
              Include contextual anchor text and brand citations with high editorial SEO authority.
            </p>
          </div>

          <div className="bg-white border border-luxury-200 p-5 shadow-xs">
            <div className="w-8 h-8 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-xs mb-3">
              02
            </div>
            <h4 className="font-editorial text-sm font-bold text-luxury-950 mb-1">
              High Fashion Readership
            </h4>
            <p className="text-[11px] text-luxury-600 leading-relaxed">
              Targeted exposure to runway buyers, boutique stylists, fashion students, and luxury consumers.
            </p>
          </div>

          <div className="bg-white border border-luxury-200 p-5 shadow-xs">
            <div className="w-8 h-8 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-xs mb-3">
              03
            </div>
            <h4 className="font-editorial text-sm font-bold text-luxury-950 mb-1">
              Rapid 48-Hour Review
            </h4>
            <p className="text-[11px] text-luxury-600 leading-relaxed">
              Our editorial desk reviews, formats, and indexes all guest dispatches within 48 hours.
            </p>
          </div>

          <div className="bg-white border border-luxury-200 p-5 shadow-xs">
            <div className="w-8 h-8 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-xs mb-3">
              04
            </div>
            <h4 className="font-editorial text-sm font-bold text-luxury-950 mb-1">
              100% Free For Creators
            </h4>
            <p className="text-[11px] text-luxury-600 leading-relaxed">
              No publishing fees. High-quality fashion discourse is rewarded with open publication.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-luxury-300 mb-10 text-xs uppercase tracking-luxury font-bold">
          <button
            onClick={() => setActiveTab('submit')}
            className={`py-3 px-6 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'border-gold-600 text-luxury-950 bg-white'
                : 'border-transparent text-luxury-500 hover:text-luxury-900'
            }`}
          >
            <Edit3 size={14} className={activeTab === 'submit' ? 'text-gold-600' : ''} />
            <span>Write & Submit Article</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`py-3 px-6 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'track'
                ? 'border-gold-600 text-luxury-950 bg-white'
                : 'border-transparent text-luxury-500 hover:text-luxury-900'
            }`}
          >
            <Search size={14} className={activeTab === 'track' ? 'text-gold-600' : ''} />
            <span>Track Submission Status</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`py-3 px-6 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'guidelines'
                ? 'border-gold-600 text-luxury-950 bg-white'
                : 'border-transparent text-luxury-500 hover:text-luxury-900'
            }`}
          >
            <BookOpen size={14} className={activeTab === 'guidelines' ? 'text-gold-600' : ''} />
            <span>Editorial Codex & Guidelines</span>
          </button>
        </div>

        {/* TAB 1: WRITE & SUBMIT ARTICLE */}
        {activeTab === 'submit' && (
          <div>
            {/* Condition 1: Sign Up / Sign In Gate if not logged in */}
            {!contributor ? (
              <div className="bg-white border border-luxury-300 p-8 sm:p-12 shadow-sm max-w-xl mx-auto my-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-luxury-950 text-gold-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                    <User size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-luxury text-gold-700 font-bold block mb-1">
                    CONTRIBUTOR PASSPORT REQUIRED
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                    {authMode === 'signup' ? 'Create Your Contributor Profile' : 'Welcome Back, Contributor'}
                  </h3>
                  <p className="text-xs text-luxury-600 mt-1 font-light">
                    {authMode === 'signup'
                      ? 'Sign up to submit guest posts, link your brand website, and track your publications.'
                      : 'Sign in to access the author studio and submit your article.'}
                  </p>
                </div>

                {authError && (
                  <div className="mb-5 p-3 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Your Full Name / Pen Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        placeholder="e.g. Laurent Moret"
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                      Email Address (Gmail / Corporate) *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        placeholder="name@gmail.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        placeholder="Create a password..."
                        className="w-full pl-9 pr-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                      <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" />
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                          Brand / Company Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={authForm.brand_name}
                            onChange={(e) => setAuthForm({ ...authForm, brand_name: e.target.value })}
                            placeholder="e.g. Atelier Milan / Chic Footwear"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                          <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                          Brand Website / Target URL (For Backlinks)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={authForm.brand_website}
                            onChange={(e) => setAuthForm({ ...authForm, brand_website: e.target.value })}
                            placeholder="https://yourbrand.com"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                          <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-600" />
                        </div>
                        <span className="text-[10px] text-luxury-500 mt-1 block">
                          This URL will be linked in your author bio and available for in-text anchor links.
                        </span>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 font-bold text-xs uppercase tracking-luxury transition shadow-md"
                  >
                    {authMode === 'signup' ? 'Create Contributor Pass & Start Writing' : 'Sign In & Open Studio'}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-luxury-200 text-center">
                  <button
                    onClick={() => {
                      setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
                      setAuthError('');
                    }}
                    className="text-xs text-luxury-600 hover:text-gold-700 font-semibold transition"
                  >
                    {authMode === 'signup'
                      ? 'Already have an account? Sign In here'
                      : "New contributor? Create your free account"}
                  </button>
                </div>
              </div>
            ) : (
              /* Condition 2: Full Rich Writing Studio (Authenticated) */
              <div className="bg-white border border-luxury-200 p-6 sm:p-12 shadow-sm animate-fadeIn">
                {/* Active Contributor Banner */}
                <div className="mb-8 p-4 bg-luxury-950 text-white border border-gold-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-500 text-luxury-950 font-bold flex items-center justify-center shrink-0">
                      {contributor.name ? contributor.name[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{contributor.name}</span>
                        <span className="text-[10px] bg-gold-500/20 text-gold-400 px-2 py-0.5 border border-gold-500/30 uppercase tracking-widest font-mono">
                          VERIFIED CONTRIBUTOR
                        </span>
                      </div>
                      <div className="text-[10px] text-luxury-300 font-light flex items-center gap-3">
                        <span>{contributor.email}</span>
                        {contributor.brand_name && (
                          <>
                            <span>•</span>
                            <span className="text-gold-400">Brand: {contributor.brand_name}</span>
                          </>
                        )}
                        {contributor.brand_website && (
                          <>
                            <span>•</span>
                            <a href={contributor.brand_website} target="_blank" rel="noreferrer" className="underline hover:text-gold-300">
                              {contributor.brand_website}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="text-[11px] uppercase tracking-wider text-luxury-400 hover:text-red-400 flex items-center gap-1 transition self-start sm:self-auto"
                    title="Switch Account"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>

                {submittedResult ? (
                  <div className="text-center py-12 max-w-xl mx-auto space-y-6 animate-fadeIn">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950 mb-2">
                        Article Transmitted to Editorial Committee
                      </h3>
                      <p className="text-xs text-luxury-600 leading-relaxed">
                        Your guest submission has been recorded. Our senior editors will inspect your prose, photography, and backlinks within 48 hours.
                      </p>
                    </div>

                    {/* Tracking ID Badge */}
                    <div className="p-4 bg-luxury-950 text-white border border-gold-500/50 space-y-1">
                      <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block">
                        YOUR UNIQUE SUBMISSION TRACKING CODE
                      </span>
                      <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-white selection:bg-gold-500 selection:text-black">
                        {submittedResult.tracking_id}
                      </div>
                      <p className="text-[10px] text-luxury-400 pt-1">
                        Use this code in the "Track Submission Status" tab to check review notes and publication progress.
                      </p>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                      <button
                        onClick={() => {
                          setSubmittedResult(null);
                          setFormData({
                            title: '',
                            pitch_summary: '',
                            category_name: categories[0]?.name || 'Haute Couture',
                            season: 'Spring / Summer 2026',
                            content: '',
                            cover_image: FASHION_IMAGE_PRESETS[0].url,
                            tags: '',
                            author_name: contributor.name,
                            author_email: contributor.email,
                            author_bio: '',
                            author_website: contributor.brand_website,
                            author_social: '',
                            author_avatar: ''
                          });
                        }}
                        className="px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs uppercase font-bold tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
                      >
                        Submit Another Article
                      </button>
                      <button
                        onClick={() => {
                          setTrackId(submittedResult.tracking_id);
                          setActiveTab('track');
                        }}
                        className="px-6 py-2.5 border border-luxury-300 text-luxury-800 text-xs uppercase font-bold tracking-luxury hover:border-gold-500 transition"
                      >
                        View Status Tracker
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {errorMsg && (
                      <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Section 1: Article Headline & Metadata */}
                    <div>
                      <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 mb-3 flex items-center gap-1.5">
                        <BookOpen size={13} />
                        <span>STEP 1: HEADLINE & CATEGORIZATION</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                            Article Title / Headline *
                          </label>
                          <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Sculptural Silhouettes: Why Parisian Ateliers Are Championing Structured Wool in 2026"
                            className="w-full px-4 py-3 bg-luxury-50 border border-luxury-300 text-sm sm:text-base font-editorial font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                              Category / Niche *
                            </label>
                            <select
                              name="category_name"
                              value={formData.category_name}
                              onChange={handleChange}
                              className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs uppercase tracking-wider focus:bg-white focus:outline-none focus:border-gold-500"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                              <option value="Brand Spotlight">Brand Spotlight</option>
                              <option value="Footwear & Accessories">Footwear & Accessories</option>
                              <option value="Textile Technology">Textile Technology</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                              Fashion Season
                            </label>
                            <select
                              name="season"
                              value={formData.season}
                              onChange={handleChange}
                              className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs uppercase tracking-wider focus:bg-white focus:outline-none focus:border-gold-500"
                            >
                              <option value="Spring / Summer 2026">Spring / Summer 2026</option>
                              <option value="Fall / Winter 2026">Fall / Winter 2026</option>
                              <option value="Resort 2026">Resort 2026</option>
                              <option value="Annual Forecast">Annual Forecast</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                              SEO Tags (comma-separated)
                            </label>
                            <input
                              type="text"
                              name="tags"
                              value={formData.tags}
                              onChange={handleChange}
                              placeholder="couture, brand spotlight, tailoring, boots"
                              className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                            Pitch Summary / Excerpt (1-2 sentences)
                          </label>
                          <textarea
                            name="pitch_summary"
                            rows={2}
                            value={formData.pitch_summary}
                            onChange={handleChange}
                            placeholder="A concise summary highlighting the narrative of your piece..."
                            className="w-full px-3.5 py-2 bg-luxury-50 border border-luxury-300 text-xs font-serif italic focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Featured Image (Required) */}
                    <div className="pt-6 border-t border-luxury-200">
                      <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ImageIcon size={13} />
                          <span>STEP 2: FEATURED IMAGE (MANDATORY COVER PHOTO) *</span>
                        </div>
                        {formData.cover_image && (
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                            <Check size={12} /> Image Configured
                          </span>
                        )}
                      </div>

                      {/* Selected Image Preview */}
                      {formData.cover_image && (
                        <div className="mb-4 p-2 bg-luxury-50 border border-luxury-300 flex items-center gap-4">
                          <img
                            src={formData.cover_image}
                            alt="Cover Preview"
                            className="w-24 h-16 object-cover border border-luxury-200 shadow-xs shrink-0"
                            loading="lazy"
                          />
                          <div className="overflow-hidden text-ellipsis">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-900 block">
                              Active Featured Cover
                            </span>
                            <span className="text-[10px] text-luxury-500 font-mono truncate block">
                              {formData.cover_image}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Presets Grid */}
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-2">
                        Select from 4K Curated Presets:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                        {FASHION_IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handlePresetSelect(preset.url)}
                            className={`text-left relative aspect-[4/3] overflow-hidden border-2 transition group ${
                              formData.cover_image === preset.url
                                ? 'border-gold-600 ring-2 ring-gold-400'
                                : 'border-transparent opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" loading="lazy" />
                            <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] uppercase tracking-wider text-white p-1 truncate block">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                          Or Provide Custom High-Resolution Image URL *
                        </label>
                        <input
                          type="url"
                          required
                          name="cover_image"
                          value={formData.cover_image}
                          onChange={handleChange}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Section 3: Article Content with Rich Formatting & Anchor Text Tool */}
                    <div className="pt-6 border-t border-luxury-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 flex items-center gap-1.5">
                          <Feather size={13} />
                          <span>STEP 3: ARTICLE BODY & ANCHOR TEXT (BACKLINKS) *</span>
                        </div>

                        {/* Editor Mode Tabs */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditorMode('edit')}
                            className={`px-3 py-1 text-[11px] uppercase font-bold tracking-wider transition flex items-center gap-1 ${
                              editorMode === 'edit'
                                ? 'bg-luxury-950 text-gold-400'
                                : 'bg-luxury-100 text-luxury-600 hover:bg-luxury-200'
                            }`}
                          >
                            <Edit3 size={11} />
                            <span>Write</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorMode('preview')}
                            className={`px-3 py-1 text-[11px] uppercase font-bold tracking-wider transition flex items-center gap-1 ${
                              editorMode === 'preview'
                                ? 'bg-luxury-950 text-gold-400'
                                : 'bg-luxury-100 text-luxury-600 hover:bg-luxury-200'
                            }`}
                          >
                            <Eye size={11} />
                            <span>Live Preview</span>
                          </button>
                        </div>
                      </div>

                      {/* Formatting Toolbar */}
                      {editorMode === 'edit' && (
                        <div className="border border-b-0 border-luxury-300 bg-luxury-100 p-2 flex flex-wrap items-center gap-1.5 text-xs text-luxury-800">
                          <button
                            type="button"
                            onClick={() => insertText('**', '**')}
                            className="p-1.5 hover:bg-white rounded transition"
                            title="Bold"
                          >
                            <Bold size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => insertText('*', '*')}
                            className="p-1.5 hover:bg-white rounded transition"
                            title="Italic"
                          >
                            <Italic size={14} />
                          </button>

                          <span className="w-px h-4 bg-luxury-300 mx-1"></span>

                          <button
                            type="button"
                            onClick={() => insertText('## ', '\n')}
                            className="px-2 py-1 hover:bg-white font-bold rounded transition text-[11px]"
                            title="Heading 2"
                          >
                            H2
                          </button>

                          <button
                            type="button"
                            onClick={() => insertText('### ', '\n')}
                            className="px-2 py-1 hover:bg-white font-bold rounded transition text-[11px]"
                            title="Heading 3"
                          >
                            H3
                          </button>

                          <span className="w-px h-4 bg-luxury-300 mx-1"></span>

                          <button
                            type="button"
                            onClick={() => insertText('> ', '\n')}
                            className="p-1.5 hover:bg-white rounded transition"
                            title="Quote"
                          >
                            <Quote size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => insertText('- ', '\n')}
                            className="p-1.5 hover:bg-white rounded transition"
                            title="Bullet List"
                          >
                            <List size={14} />
                          </button>

                          <span className="w-px h-4 bg-luxury-300 mx-1"></span>

                          {/* Prominent Anchor Text / Backlink Inserter */}
                          <button
                            type="button"
                            onClick={() => {
                              const textarea = document.getElementById('article-content-editor');
                              const selected = textarea
                                ? textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
                                : '';
                              setLinkData({
                                text: selected || contributor?.brand_name || '',
                                url: contributor?.brand_website || 'https://'
                              });
                              setShowLinkModal(true);
                            }}
                            className="px-2.5 py-1 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold rounded transition flex items-center gap-1 text-[11px] uppercase tracking-wider shadow-xs"
                            title="Insert Anchor Text / Dofollow Backlink"
                          >
                            <LinkIcon size={12} />
                            <span>Insert Anchor Link</span>
                          </button>

                          <span className="ml-auto text-[10px] text-luxury-500 hidden sm:inline">
                            Word Count: {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words
                          </span>
                        </div>
                      )}

                      {/* Link Inserter Modal / Popover */}
                      {showLinkModal && (
                        <div className="p-4 bg-luxury-950 text-white border border-gold-500 mb-3 space-y-3 shadow-xl animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase font-bold tracking-luxury text-gold-400 flex items-center gap-1.5">
                              <LinkIcon size={14} />
                              <span>Insert Dofollow Brand Backlink</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowLinkModal(false)}
                              className="text-luxury-400 hover:text-white text-xs font-bold"
                            >
                              ✕ Close
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-luxury-300 mb-1">
                                Anchor Text (Keyword to click on) *
                              </label>
                              <input
                                type="text"
                                required
                                value={linkData.text}
                                onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                                placeholder="e.g. Handmade Italian Leather Atelier"
                                className="w-full px-3 py-2 bg-[#1a1a20] border border-luxury-700 text-xs text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-luxury-300 mb-1">
                                Target Destination URL (Brand Backlink) *
                              </label>
                              <input
                                type="url"
                                required
                                value={linkData.url}
                                onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                                placeholder="https://yourbrand.com/collection"
                                className="w-full px-3 py-2 bg-[#1a1a20] border border-luxury-700 text-xs text-white placeholder-luxury-500 focus:outline-none focus:border-gold-500 font-mono"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowLinkModal(false)}
                              className="px-3 py-1.5 border border-luxury-700 text-luxury-300 text-xs uppercase"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleInsertLink}
                              className="px-4 py-1.5 bg-gold-500 text-luxury-950 font-bold text-xs uppercase tracking-luxury hover:bg-gold-400 transition"
                            >
                              Embed Anchor Link
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Content Input or Live Reader Preview */}
                      {editorMode === 'edit' ? (
                        <textarea
                          id="article-content-editor"
                          name="content"
                          required
                          rows={14}
                          value={formData.content}
                          onChange={handleChange}
                          placeholder="Draft your editorial article here. Use the formatting buttons above to structure your piece with Bold, Headings, and Anchor Links to your brand...&#10;&#10;Example:&#10;## The New Renaissance of Luxury Tailoring&#10;Contemporary ateliers are moving away from loud monograms and returning to sensory tactility. In our latest collection at [Atelier Milan](https://ateliermilan.com), we focus on unlined double-faced cashmere that drapes with architectural poise..."
                          className="w-full px-4 py-3 bg-luxury-50 border border-luxury-300 text-sm font-serif leading-relaxed text-luxury-900 focus:bg-white focus:outline-none focus:border-gold-500 font-normal"
                        />
                      ) : (
                        <div className="p-6 bg-white border border-luxury-300 min-h-[300px]">
                          <div className="text-[10px] uppercase tracking-widest text-gold-600 font-bold pb-2 mb-4 border-b border-luxury-100 flex items-center justify-between">
                            <span>LIVE READER VIEW PREVIEW</span>
                            <span className="text-luxury-400 font-normal">Clickable anchor links shown in gold</span>
                          </div>
                          {renderPreviewContent(formData.content)}
                        </div>
                      )}

                      <div className="text-[10px] text-luxury-500 mt-2 flex flex-wrap items-center gap-4">
                        <span>💡 Anchor Links render with permanent dofollow value</span>
                        <span>💡 Tip: Click "Live Preview" to test how your anchor links look and click</span>
                        <span>💡 Recommended length: 800 - 2,500 words</span>
                      </div>
                    </div>

                    {/* Section 4: Author Bio & Brand Link Attribution */}
                    <div className="pt-6 border-t border-luxury-200">
                      <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 mb-3 flex items-center gap-1.5">
                        <User size={13} />
                        <span>STEP 4: AUTHOR ATTRIBUTION & PERMANENT BACKLINK</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                            Author Name *
                          </label>
                          <input
                            type="text"
                            required
                            name="author_name"
                            value={formData.author_name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                            Author Email *
                          </label>
                          <input
                            type="email"
                            required
                            name="author_email"
                            value={formData.author_email}
                            onChange={handleChange}
                            placeholder="your.email@domain.com"
                            className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                            Brand / Website Backlink URL
                          </label>
                          <input
                            type="url"
                            name="author_website"
                            value={formData.author_website}
                            onChange={handleChange}
                            placeholder="https://yourbrand.com"
                            className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500 font-mono"
                          />
                          <span className="text-[9px] text-luxury-500 block mt-0.5">
                            This URL receives a prominent author dofollow link in the article footer.
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                            Social Handle
                          </label>
                          <input
                            type="text"
                            name="author_social"
                            value={formData.author_social}
                            onChange={handleChange}
                            placeholder="@yourbrand"
                            className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                            Author Bio / Brand Description (2-3 sentences)
                          </label>
                          <input
                            type="text"
                            name="author_bio"
                            value={formData.author_bio}
                            onChange={handleChange}
                            placeholder="e.g. Editorial writer and creative director at Atelier Milan, specializing in architectural outerwear and heritage Italian leathercraft."
                            className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <div className="pt-8 border-t border-luxury-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-[11px] text-luxury-500 max-w-md">
                        By submitting, you certify that this work is original and adheres to the ZAIB ATTIRE Editorial Standards. Anchor links and brand citations will be indexed upon publication.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-10 py-3.5 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <span>{submitting ? 'Transmitting To Editorial Desk...' : 'Submit Article For Review'}</span>
                        <Send size={13} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRACK SUBMISSION STATUS */}
        {activeTab === 'track' && (
          <div className="bg-white border border-luxury-200 p-6 sm:p-12 shadow-sm max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Search size={32} className="text-gold-600 mx-auto mb-2" />
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950 mb-2">
                Real-Time Submission Status Lookup
              </h3>
              <p className="text-xs text-luxury-600 max-w-md mx-auto">
                Enter your unique tracking code (format: GP-XXXX or ZAIB-GUEST-XXXX) to review live editorial progress.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-lg mx-auto mb-8">
              <input
                type="text"
                required
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                placeholder="GP-..."
                className="flex-1 px-4 py-3 bg-luxury-50 border border-luxury-300 font-mono text-sm tracking-wider uppercase focus:bg-white focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-6 py-3 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold shrink-0 disabled:opacity-50"
              >
                {trackingLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {trackingError && (
              <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2 max-w-lg mx-auto">
                <AlertCircle size={16} />
                <span>{trackingError}</span>
              </div>
            )}

            {trackingResult && (
              <div className="border border-luxury-300 p-6 bg-luxury-50/70 max-w-lg mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-luxury-200">
                  <span className="text-[10px] uppercase tracking-luxury font-bold text-luxury-500">
                    DISPATCH RECORD
                  </span>
                  <span className="font-mono text-xs font-bold text-luxury-950">
                    {trackingResult.tracking_id || trackId}
                  </span>
                </div>

                <div>
                  <h4 className="font-editorial text-lg font-bold text-luxury-950 mb-1">
                    {trackingResult.title}
                  </h4>
                  <div className="text-xs text-luxury-600 flex items-center gap-2">
                    <span>By {trackingResult.author_name || contributor?.name || 'Author'}</span>
                    <span>•</span>
                    <span className="text-gold-700 font-semibold">{trackingResult.category_name || 'Fashion'}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-luxury-200 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-luxury-700">
                    CURRENT EDITORIAL STATUS:
                  </span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-none ${
                    trackingResult.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    trackingResult.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                    'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {trackingResult.status === 'approved' ? '✓ APPROVED & PUBLISHED' :
                     trackingResult.status === 'rejected' ? '✗ DECLINED' : '⏳ UNDER REVIEW (PENDING)'}
                  </span>
                </div>

                {trackingResult.reviewer_notes && (
                  <div className="p-3 bg-champagne-50 border border-gold-300 text-xs text-luxury-800 italic font-serif">
                    <span className="font-sans font-bold uppercase text-[9px] text-gold-800 block not-italic mb-1">
                      EDITOR'S NOTE:
                    </span>
                    "{trackingResult.reviewer_notes}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GUIDELINES & CODEX */}
        {activeTab === 'guidelines' && (
          <div className="bg-white border border-luxury-200 p-6 sm:p-12 shadow-sm space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 block mb-1">
                EDITORIAL INTEGRITY & LINK QUALITY
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950 mb-3">
                The ZAIB ATTIRE Contributor Codex
              </h3>
              <p className="text-xs text-luxury-600 leading-relaxed max-w-3xl">
                We accept guest posts across fashion, apparel, sustainability, runway critiques, footwear, luxury accessories, and designer profiles. Every article is indexed and permanently maintained with high authority signals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="border border-luxury-200 p-6 space-y-3">
                <h4 className="font-editorial text-lg font-bold text-luxury-950 flex items-center gap-2">
                  <Check size={18} className="text-emerald-600" />
                  <span>Accepted Article Topics</span>
                </h4>
                <ul className="text-xs text-luxury-700 space-y-2 list-disc list-inside leading-relaxed font-serif">
                  <li>Runway reviews of Paris, Milan, London, and New York Fashion Weeks.</li>
                  <li>Brand launch analyses and designer studio showcases.</li>
                  <li>In-depth textile analysis: cashmere, silk organza, sustainable leather.</li>
                  <li>Streetwear subcultures and urban footwear trends.</li>
                  <li>Quiet luxury, minimalist aesthetics, and wardrobe curation.</li>
                </ul>
              </div>

              <div className="border border-luxury-200 p-6 space-y-3">
                <h4 className="font-editorial text-lg font-bold text-luxury-950 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-600" />
                  <span>Backlink & Hyperlink Rules</span>
                </h4>
                <ul className="text-xs text-luxury-700 space-y-2 list-disc list-inside leading-relaxed font-serif">
                  <li>Natural contextual anchor text linking to relevant product/brand pages.</li>
                  <li>1-2 dofollow in-content anchor links allowed per 1,000 words.</li>
                  <li>1 permanent dofollow backlink in the Author Attribution card.</li>
                  <li>Links must point to legitimate, HTTPS fashion/lifestyle/business domains.</li>
                  <li>No broken, deceptive, or spam link schemes.</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button
                onClick={() => setActiveTab('submit')}
                className="px-8 py-3 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition inline-flex items-center gap-2"
              >
                <span>Ready To Publish? Proceed To Form</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
