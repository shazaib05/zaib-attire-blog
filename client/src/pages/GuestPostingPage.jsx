import React, { useState, useEffect } from 'react';
import {
  Sparkles, Feather, Send, Search, CheckCircle2, AlertCircle,
  HelpCircle, Image as ImageIcon, Globe, User, BookOpen, Clock,
  ArrowRight, Check, Award, Compass, Share2, Link as LinkIcon,
  Bold, Italic, Heading2, Heading3, Quote, List, Eye, Edit3,
  Lock, KeyRound, Mail, Building, LogOut, CheckCircle, ChevronDown
} from 'lucide-react';
import { api } from '../utils/api';
import SEO from '../components/SEO';

const GUEST_POSTING_FAQS = [
  {
    question: "How do I submit a free fashion guest post to ZAIB ATTIRE?",
    answer: "Simply create a free Contributor profile with your name, email, and brand website. Compose your article using our Medium-style story editor, insert your contextual anchor text links, pick a cover photo, and click Submit Article."
  },
  {
    question: "Are the backlinks from published guest posts dofollow and permanent?",
    answer: "Yes. All accepted guest posts receive permanent, dofollow contextual anchor backlinks in the article copy as well as a dofollow attribution link in the author credentials card."
  },
  {
    question: "What niches are eligible for guest posting?",
    answer: "While ZAIB ATTIRE is dedicated to high fashion, haute couture, and apparel aesthetics, we accept relevant submissions covering lifestyle, accessories, footwear, beauty, sustainable textiles, design craftsmanship, and brand launch stories."
  },
  {
    question: "How fast will my guest post be indexed by Google Search?",
    answer: "Our XML sitemap automatically notifies Googlebot upon publication. Well-crafted, original guest articles typically index on Google within 24 to 72 hours."
  },
  {
    question: "Are there any hidden fees or charges for guest posting?",
    answer: "No. Standard editorial guest posts are 100% free of charge for writers, brands, and digital agencies seeking high-authority organic search visibility."
  }
];

const FASHION_IMAGE_PRESETS = [
  { label: 'Paris Atelier High Fashion', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Runway Model Silhouette', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Urban Street Style Minimalist', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quiet Luxury Wool & Cashmere', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sustainable Eco Silk & Botanics', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sculptural Footwear & Jewelry', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80' },
];

export default function GuestPostingPage({ categories = [] }) {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'track' | 'guidelines' | 'faq'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
      setErrorMsg('Please enter an Article Title.');
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
    if (!text) return <p className="italic text-ink-400">Story preview will appear here...</p>;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-xl font-bold text-ink-900 mt-6 mb-2">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="font-serif text-2xl font-bold text-ink-900 mt-8 mb-3 pb-2 border-b border-ink-200">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-3 border-brand-accent pl-5 py-2 my-5 italic font-serif text-ink-700 bg-ink-50/70 text-lg">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-5 list-disc text-ink-700 my-1 font-serif text-base">{line.replace('- ', '')}</li>;
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
            className="text-brand-muted underline font-semibold hover:text-ink-900 transition"
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
        <p key={idx} className="my-4 leading-relaxed text-ink-800 font-serif text-lg">
          {parts.length > 0 ? parts : line}
        </p>
      ) : <br key={idx} />;
    });
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-14 animate-fadeIn font-sans">
      <SEO
        title="Write on ZAIB ATTIRE — Free Guest Posting & Publishing"
        description="Publish your fashion articles with permanent dofollow backlinks on ZAIB ATTIRE. Reach style critics, buyers, and luxury readers for free."
        keywords="write for us fashion, fashion guest post, free guest posting, submit guest article, fashion backlink, fashion brand guest post, submit runway story"
        canonicalUrl="/write"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Write on ZAIB ATTIRE', item: '/write' }
        ]}
        faqs={GUEST_POSTING_FAQS}
      />

      <div className="max-w-content mx-auto px-5 sm:px-8">

        {/* Medium-style Publication Masthead */}
        <div className="border-b border-ink-200 pb-10 mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 text-xs font-semibold text-ink-700 mb-4">
            <Feather size={13} className="text-brand-accent" />
            <span>Open Publication Platform • Free Guest Posting</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 mb-4">
            Publish on ZAIB ATTIRE
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed max-w-2xl mx-auto">
            Share your fashion perspective, runway critique, or brand narrative. Gain organic search reach and secure permanent dofollow backlinks to your domain.
          </p>
        </div>

        {/* 4 Value Proposition Cards — Clean Minimal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-left">
          <div className="border border-ink-200 rounded-xl p-5 bg-white hover:border-ink-300 transition">
            <span className="text-xs font-bold text-ink-400 block mb-2">01</span>
            <h4 className="font-serif text-base font-bold text-ink-900 mb-1.5">
              Dofollow Backlinks
            </h4>
            <p className="text-xs text-ink-500 leading-relaxed">
              Include contextual in-content anchor links and permanent author bio links to your domain.
            </p>
          </div>

          <div className="border border-ink-200 rounded-xl p-5 bg-white hover:border-ink-300 transition">
            <span className="text-xs font-bold text-ink-400 block mb-2">02</span>
            <h4 className="font-serif text-base font-bold text-ink-900 mb-1.5">
              Global Fashion Reach
            </h4>
            <p className="text-xs text-ink-500 leading-relaxed">
              Reach boutique stylists, designers, fashion students, and high-fashion readers worldwide.
            </p>
          </div>

          <div className="border border-ink-200 rounded-xl p-5 bg-white hover:border-ink-300 transition">
            <span className="text-xs font-bold text-ink-400 block mb-2">03</span>
            <h4 className="font-serif text-base font-bold text-ink-900 mb-1.5">
              48-Hour Review
            </h4>
            <p className="text-xs text-ink-500 leading-relaxed">
              Our editorial desk reviews, formats, and indexes your dispatches within 48 hours.
            </p>
          </div>

          <div className="border border-ink-200 rounded-xl p-5 bg-white hover:border-ink-300 transition">
            <span className="text-xs font-bold text-ink-400 block mb-2">04</span>
            <h4 className="font-serif text-base font-bold text-ink-900 mb-1.5">
              100% Free For Writers
            </h4>
            <p className="text-xs text-ink-500 leading-relaxed">
              Zero publishing fees. Quality fashion journalism and thoughtful analysis are rewarded with open publication.
            </p>
          </div>
        </div>

        {/* Medium-style Navigation Bar */}
        <div className="flex border-b border-ink-200 mb-10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('submit')}
            className={`py-3 px-5 text-sm font-semibold transition border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'submit'
                ? 'border-ink-900 text-ink-900'
                : 'border-transparent text-ink-500 hover:text-ink-800'
            }`}
          >
            <Edit3 size={15} />
            <span>Write Story</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`py-3 px-5 text-sm font-semibold transition border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'track'
                ? 'border-ink-900 text-ink-900'
                : 'border-transparent text-ink-500 hover:text-ink-800'
            }`}
          >
            <Search size={15} />
            <span>Track Submission</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`py-3 px-5 text-sm font-semibold transition border-b-2 flex items-center gap-2 shrink-0 ${
              activeTab === 'guidelines'
                ? 'border-ink-900 text-ink-900'
                : 'border-transparent text-ink-500 hover:text-ink-800'
            }`}
          >
            <BookOpen size={15} />
            <span>Editorial Guidelines</span>
          </button>
        </div>

        {/* TAB 1: WRITE & SUBMIT ARTICLE */}
        {activeTab === 'submit' && (
          <div>
            {/* Condition 1: Sign Up / Sign In Gate if not logged in */}
            {!contributor ? (
              <div className="border border-ink-200 rounded-2xl p-8 sm:p-12 max-w-lg mx-auto my-6 bg-white shadow-xs">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-ink-900 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={20} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ink-900">
                    {authMode === 'signup' ? 'Create Contributor Profile' : 'Welcome Back'}
                  </h3>
                  <p className="text-sm text-ink-500 mt-1.5">
                    {authMode === 'signup'
                      ? 'Sign up for free to draft articles, set your brand backlink, and track publications.'
                      : 'Sign in to access your story drafting canvas.'}
                  </p>
                </div>

                {authError && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">
                        Your Full Name / Pen Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        placeholder="e.g. Laurent Moret"
                        className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-400 transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-400 transition"
                      />
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        placeholder="Create a password..."
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-400 transition"
                      />
                      <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 mb-1">
                          Brand / Company Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={authForm.brand_name}
                            onChange={(e) => setAuthForm({ ...authForm, brand_name: e.target.value })}
                            placeholder="e.g. Atelier Milan"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-400 transition"
                          />
                          <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-700 mb-1">
                          Brand Website / Target URL (For Backlink)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={authForm.brand_website}
                            onChange={(e) => setAuthForm({ ...authForm, brand_website: e.target.value })}
                            placeholder="https://yourbrand.com"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-400 transition font-mono"
                          />
                          <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-accent" />
                        </div>
                        <span className="text-[11px] text-ink-500 mt-1 block">
                          This URL will be linked in your author bio and available for in-text anchor links.
                        </span>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 btn-primary justify-center text-sm mt-2"
                  >
                    {authMode === 'signup' ? 'Create Profile & Start Writing' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-ink-200 text-center">
                  <button
                    onClick={() => {
                      setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
                      setAuthError('');
                    }}
                    className="text-xs text-ink-600 hover:text-ink-900 font-semibold transition"
                  >
                    {authMode === 'signup'
                      ? 'Already have a contributor pass? Sign In here'
                      : "New contributor? Create your free profile"}
                  </button>
                </div>
              </div>
            ) : (
              /* Condition 2: Full Rich Writing Studio (Authenticated) */
              <div className="max-w-reading mx-auto">
                {/* Active Contributor Banner */}
                <div className="mb-8 p-4 bg-ink-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-ink-900 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                      {contributor.name ? contributor.name[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-ink-900 flex items-center gap-2">
                        <span>{contributor.name}</span>
                        <span className="text-[10px] bg-brand-accent/20 text-brand-muted px-2 py-0.5 rounded-full font-medium">
                          Contributor
                        </span>
                      </div>
                      <div className="text-xs text-ink-500 flex items-center gap-2">
                        <span>{contributor.email}</span>
                        {contributor.brand_name && (
                          <>
                            <span>·</span>
                            <span>{contributor.brand_name}</span>
                          </>
                        )}
                        {contributor.brand_website && (
                          <>
                            <span>·</span>
                            <a href={contributor.brand_website} target="_blank" rel="noreferrer" className="underline hover:text-ink-900">
                              {contributor.brand_website.replace(/^https?:\/\//, '')}
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="text-xs text-ink-500 hover:text-red-500 flex items-center gap-1 transition self-start sm:self-auto font-medium"
                    title="Sign Out"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>

                {submittedResult ? (
                  <div className="text-center py-12 max-w-lg mx-auto space-y-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl font-bold text-ink-900 mb-2">
                        Story Submitted for Review
                      </h3>
                      <p className="text-sm text-ink-500 leading-relaxed">
                        Your article has been submitted to the editorial desk. We review formatting, prose, and backlinks within 48 hours.
                      </p>
                    </div>

                    {/* Tracking ID Badge */}
                    <div className="p-5 border border-ink-200 rounded-xl bg-ink-100 text-center space-y-1">
                      <span className="text-xs text-ink-500 uppercase tracking-wider font-semibold block">
                        Your Submission Tracking Code
                      </span>
                      <div className="font-mono text-xl sm:text-2xl font-bold text-ink-900 tracking-wider">
                        {submittedResult.tracking_id}
                      </div>
                      <p className="text-xs text-ink-400 pt-1">
                        Use this code in the "Track Submission" tab to check review progress.
                      </p>
                    </div>

                    <div className="flex justify-center gap-3 pt-4">
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
                        className="btn-primary text-xs py-2.5 px-5"
                      >
                        Submit Another Story
                      </button>
                      <button
                        onClick={() => {
                          setTrackId(submittedResult.tracking_id);
                          setActiveTab('track');
                        }}
                        className="btn-ghost text-xs py-2.5 px-5"
                      >
                        Track Status
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {errorMsg && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Medium Story Composer */}
                    <div className="space-y-4">
                      {/* Title Input — Medium Style */}
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        className="w-full font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 placeholder:text-ink-300 border-none outline-none focus:outline-none bg-transparent leading-tight"
                      />

                      {/* Subtitle Input */}
                      <input
                        type="text"
                        name="pitch_summary"
                        value={formData.pitch_summary}
                        onChange={handleChange}
                        placeholder="Tell your story or pitch summary..."
                        className="w-full font-sans text-lg text-ink-600 placeholder:text-ink-300 border-none outline-none focus:outline-none bg-transparent"
                      />

                      {/* Topic & Season Selector */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 pb-4 border-b border-ink-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ink-400 font-medium">Topic:</span>
                          <select
                            name="category_name"
                            value={formData.category_name}
                            onChange={handleChange}
                            className="text-xs bg-ink-100 hover:bg-ink-200 border-none rounded-full px-3 py-1 text-ink-800 font-medium focus:outline-none cursor-pointer"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                            <option value="Brand Spotlight">Brand Spotlight</option>
                            <option value="Footwear & Accessories">Footwear & Accessories</option>
                            <option value="Textile Technology">Textile Technology</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ink-400 font-medium">Season:</span>
                          <select
                            name="season"
                            value={formData.season}
                            onChange={handleChange}
                            className="text-xs bg-ink-100 hover:bg-ink-200 border-none rounded-full px-3 py-1 text-ink-800 font-medium focus:outline-none cursor-pointer"
                          >
                            <option value="Spring / Summer 2026">Spring / Summer 2026</option>
                            <option value="Fall / Winter 2026">Fall / Winter 2026</option>
                            <option value="Resort 2026">Resort 2026</option>
                            <option value="Annual Forecast">Annual Forecast</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="Add tags (comma-separated)..."
                            className="text-xs bg-ink-100 rounded-full px-3 py-1 text-ink-800 placeholder:text-ink-400 focus:outline-none border-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Featured Cover Image Section */}
                    <div className="border border-ink-200 rounded-xl p-5 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ImageIcon size={15} className="text-brand-accent" />
                          <span className="text-xs font-bold text-ink-800 uppercase tracking-wider">
                            Featured Cover Photo *
                          </span>
                        </div>
                        {formData.cover_image && (
                          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <Check size={13} /> Cover Selected
                          </span>
                        )}
                      </div>

                      {/* Active cover photo thumbnail */}
                      {formData.cover_image && (
                        <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-ink-100 mb-4 border border-ink-200">
                          <img
                            src={formData.cover_image}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Presets grid */}
                      <span className="text-xs text-ink-500 font-medium block mb-2">
                        Pick a high-resolution editorial photo preset:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                        {FASHION_IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handlePresetSelect(preset.url)}
                            className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${
                              formData.cover_image === preset.url
                                ? 'border-brand-accent ring-2 ring-brand-accent/20'
                                : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                            <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white p-1 truncate block text-left">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div>
                        <input
                          type="url"
                          required
                          name="cover_image"
                          value={formData.cover_image}
                          onChange={handleChange}
                          placeholder="Or paste custom image URL (https://...)"
                          className="w-full px-3 py-2 bg-ink-100 rounded-lg text-xs font-mono text-ink-800 placeholder:text-ink-400 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 transition"
                        />
                      </div>
                    </div>

                    {/* Story Editor & Toolbar */}
                    <div>
                      {/* Toolbar & Mode Toggle */}
                      <div className="flex items-center justify-between py-2 border-b border-ink-200 sticky top-[57px] bg-white z-20">
                        {/* Writing Tools */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertText('**', '**')}
                            className="p-2 hover:bg-ink-100 rounded-md text-ink-700 transition"
                            title="Bold"
                          >
                            <Bold size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertText('*', '*')}
                            className="p-2 hover:bg-ink-100 rounded-md text-ink-700 transition"
                            title="Italic"
                          >
                            <Italic size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertText('## ', '\n')}
                            className="px-2 py-1 hover:bg-ink-100 rounded-md text-xs font-bold text-ink-700 transition"
                            title="Large Header"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => insertText('### ', '\n')}
                            className="px-2 py-1 hover:bg-ink-100 rounded-md text-xs font-bold text-ink-700 transition"
                            title="Small Header"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => insertText('> ', '\n')}
                            className="p-2 hover:bg-ink-100 rounded-md text-ink-700 transition"
                            title="Quote"
                          >
                            <Quote size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertText('- ', '\n')}
                            className="p-2 hover:bg-ink-100 rounded-md text-ink-700 transition"
                            title="Bullet List"
                          >
                            <List size={15} />
                          </button>

                          <span className="w-px h-5 bg-ink-200 mx-1"></span>

                          {/* Link Inserter Button */}
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
                            className="inline-flex items-center gap-1 px-3 py-1 bg-ink-100 hover:bg-ink-200 rounded-full text-xs font-semibold text-ink-900 transition"
                            title="Insert Link / Anchor Text"
                          >
                            <LinkIcon size={12} className="text-brand-accent" />
                            <span>Add Link</span>
                          </button>
                        </div>

                        {/* View Switcher */}
                        <div className="flex items-center gap-1 bg-ink-100 p-0.5 rounded-full">
                          <button
                            type="button"
                            onClick={() => setEditorMode('edit')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                              editorMode === 'edit'
                                ? 'bg-white shadow-xs text-ink-900 font-semibold'
                                : 'text-ink-600 hover:text-ink-900'
                            }`}
                          >
                            Write
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorMode('preview')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                              editorMode === 'preview'
                                ? 'bg-white shadow-xs text-ink-900 font-semibold'
                                : 'text-ink-600 hover:text-ink-900'
                            }`}
                          >
                            Preview
                          </button>
                        </div>
                      </div>

                      {/* Modal to insert link */}
                      {showLinkModal && (
                        <div className="my-4 p-4 border border-ink-300 rounded-xl bg-ink-100 shadow-md animate-fadeIn">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-ink-900 flex items-center gap-1.5">
                              <LinkIcon size={14} className="text-brand-accent" />
                              <span>Insert Dofollow Brand Backlink</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowLinkModal(false)}
                              className="text-xs text-ink-500 hover:text-ink-900"
                            >
                              ✕ Close
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs text-ink-700 font-medium mb-1">
                                Anchor Text (keyword to click) *
                              </label>
                              <input
                                type="text"
                                required
                                value={linkData.text}
                                onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                                placeholder="e.g. Handmade Italian Leather Atelier"
                                className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs text-ink-900 focus:outline-none focus:border-ink-400"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-ink-700 font-medium mb-1">
                                Target Destination URL *
                              </label>
                              <input
                                type="url"
                                required
                                value={linkData.url}
                                onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                                placeholder="https://yourbrand.com/collection"
                                className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs text-ink-900 focus:outline-none focus:border-ink-400 font-mono"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowLinkModal(false)}
                              className="px-3 py-1.5 text-xs text-ink-600 hover:text-ink-900 font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleInsertLink}
                              className="btn-primary text-xs py-1.5 px-4"
                            >
                              Embed Link
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Content Canvas */}
                      {editorMode === 'edit' ? (
                        <textarea
                          id="article-content-editor"
                          name="content"
                          required
                          rows={16}
                          value={formData.content}
                          onChange={handleChange}
                          placeholder="Tell your story...&#10;&#10;Use headings, quotes, and links to craft an engaging fashion article.&#10;&#10;Example:&#10;## The New Renaissance of Luxury Tailoring&#10;Contemporary ateliers are moving away from loud monograms and returning to sensory tactility. In our latest collection at [Atelier Milan](https://ateliermilan.com), we focus on unlined double-faced cashmere that drapes with architectural poise..."
                          className="w-full pt-4 font-serif text-lg sm:text-xl leading-relaxed text-ink-800 placeholder:text-ink-300 border-none outline-none focus:outline-none bg-transparent resize-y min-h-[360px]"
                        />
                      ) : (
                        <div className="pt-6 min-h-[360px]">
                          <div className="border-b border-ink-200 pb-2 mb-6 flex items-center justify-between text-xs text-ink-400">
                            <span>Story Preview</span>
                            <span>Links will render live upon publication</span>
                          </div>
                          {renderPreviewContent(formData.content)}
                        </div>
                      )}

                      <div className="text-xs text-ink-400 flex items-center justify-between pt-3 border-t border-ink-200">
                        <span>Word Count: {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words</span>
                        <span>Recommended: 800 - 2,500 words</span>
                      </div>
                    </div>

                    {/* Author & Backlink Attribution Section */}
                    <div className="border border-ink-200 rounded-xl p-6 bg-white space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-brand-accent" />
                        <h4 className="font-serif text-base font-bold text-ink-900">
                          Author Bio &amp; Permanent Backlink
                        </h4>
                      </div>
                      <p className="text-xs text-ink-500 leading-relaxed">
                        This information will appear in the author card at the bottom of your published story.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">
                            Author Name *
                          </label>
                          <input
                            type="text"
                            required
                            name="author_name"
                            value={formData.author_name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">
                            Author Email *
                          </label>
                          <input
                            type="email"
                            required
                            name="author_email"
                            value={formData.author_email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">
                            Brand / Website Backlink URL
                          </label>
                          <input
                            type="url"
                            name="author_website"
                            value={formData.author_website}
                            onChange={handleChange}
                            placeholder="https://yourbrand.com"
                            className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 font-mono"
                          />
                          <span className="text-[11px] text-ink-400 mt-1 block">
                            Permanent dofollow attribution backlink.
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">
                            Social Handle
                          </label>
                          <input
                            type="text"
                            name="author_social"
                            value={formData.author_social}
                            onChange={handleChange}
                            placeholder="@yourbrand"
                            className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-ink-700 mb-1">
                            Author Bio
                          </label>
                          <input
                            type="text"
                            name="author_bio"
                            value={formData.author_bio}
                            onChange={handleChange}
                            placeholder="Fashion writer and stylist specializing in luxury footwear and heritage tailoring."
                            className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Publish / Submit Action Button */}
                    <div className="pt-6 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-ink-400 max-w-sm">
                        By submitting, you confirm this story is original and conforms to our editorial standards.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto btn-primary py-3.5 px-8 text-sm disabled:opacity-50"
                      >
                        <Feather size={15} />
                        <span>{submitting ? 'Transmitting story...' : 'Publish / Submit Story'}</span>
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
          <div className="border border-ink-200 rounded-2xl p-8 sm:p-12 max-w-lg mx-auto bg-white shadow-xs">
            <div className="text-center mb-6">
              <Search size={30} className="text-brand-accent mx-auto mb-2" />
              <h3 className="font-serif text-2xl font-bold text-ink-900 mb-1.5">
                Check Submission Status
              </h3>
              <p className="text-sm text-ink-500">
                Enter your tracking code (e.g. GP-XXXX or ZAIB-GUEST-XXXX).
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2 mb-6">
              <input
                type="text"
                required
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                placeholder="GP-..."
                className="flex-1 px-3.5 py-2.5 bg-ink-100 rounded-lg font-mono text-sm uppercase text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="btn-primary text-xs py-2.5 px-5 shrink-0 disabled:opacity-50"
              >
                {trackingLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {trackingError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{trackingError}</span>
              </div>
            )}

            {trackingResult && (
              <div className="border border-ink-200 rounded-xl p-5 bg-ink-50/70 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-ink-200 text-xs">
                  <span className="font-semibold text-ink-500">RECORD</span>
                  <span className="font-mono font-bold text-ink-900">{trackingResult.tracking_id || trackId}</span>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-ink-900 mb-1">
                    {trackingResult.title}
                  </h4>
                  <p className="text-xs text-ink-500">
                    By {trackingResult.author_name || 'Author'} · {trackingResult.category_name || 'Fashion'}
                  </p>
                </div>

                <div className="p-3 bg-white border border-ink-200 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-700">STATUS:</span>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                    trackingResult.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    trackingResult.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {trackingResult.status === 'approved' ? '✓ Approved & Published' :
                     trackingResult.status === 'rejected' ? '✗ Declined' : '⏳ Under Review'}
                  </span>
                </div>

                {trackingResult.reviewer_notes && (
                  <div className="p-3 bg-white border border-ink-200 rounded-lg text-xs text-ink-700 italic">
                    <span className="font-sans font-bold text-[10px] text-brand-muted block not-italic mb-1">
                      EDITOR NOTES:
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
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <h3 className="font-serif text-3xl font-bold text-ink-900 mb-2">
                Editorial Guidelines
              </h3>
              <p className="text-base text-ink-500">
                Standards for guest contributors, authors, and partner brands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-ink-200 rounded-2xl p-6 bg-white space-y-3">
                <h4 className="font-serif text-lg font-bold text-ink-900 flex items-center gap-2">
                  <Check size={18} className="text-emerald-600" />
                  <span>Accepted Topics</span>
                </h4>
                <ul className="text-sm text-ink-600 space-y-2 list-disc list-inside leading-relaxed font-serif">
                  <li>Runway reviews of Paris, Milan, London, and New York Fashion Weeks.</li>
                  <li>Brand launch analyses and designer studio spotlights.</li>
                  <li>In-depth textile analysis: cashmere, silk organza, sustainable leather.</li>
                  <li>Streetwear subcultures and urban footwear trends.</li>
                  <li>Quiet luxury, minimalist aesthetics, and capsule wardrobes.</li>
                </ul>
              </div>

              <div className="border border-ink-200 rounded-2xl p-6 bg-white space-y-3">
                <h4 className="font-serif text-lg font-bold text-ink-900 flex items-center gap-2">
                  <AlertCircle size={18} className="text-brand-muted" />
                  <span>Backlink Rules</span>
                </h4>
                <ul className="text-sm text-ink-600 space-y-2 list-disc list-inside leading-relaxed font-serif">
                  <li>Natural contextual anchor text linking to relevant product/brand pages.</li>
                  <li>1-2 dofollow in-content anchor links allowed per 1,000 words.</li>
                  <li>1 permanent dofollow backlink in the Author Attribution card.</li>
                  <li>Links must point to legitimate, HTTPS domains.</li>
                  <li>No broken, deceptive, or spam link schemes.</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setActiveTab('submit')}
                className="btn-primary text-sm py-3 px-6"
              >
                <span>Ready to Submit? Write Your Story</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* FAQ Accordion Section */}
        <div className="mt-16 pt-12 border-t border-ink-200 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-ink-900 mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-ink-500">
              Everything you need to know about publishing and backlinks on ZAIB ATTIRE.
            </p>
          </div>

          <div className="space-y-3">
            {GUEST_POSTING_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-ink-200 rounded-xl bg-white overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-serif font-bold text-base text-ink-900 hover:text-ink-600 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-ink-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-ink-600 font-serif leading-relaxed border-t border-ink-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
