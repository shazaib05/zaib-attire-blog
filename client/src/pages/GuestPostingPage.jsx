import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Feather, Send, CheckCircle2, AlertCircle, HelpCircle,
  Image as ImageIcon, Globe, User, BookOpen, Clock,
  ArrowRight, Check, Link as LinkIcon, Bold, Italic,
  Heading2, Heading3, Quote, List, Eye, Edit3, Mail,
  Search, ExternalLink, Sparkles
} from 'lucide-react';
import { api } from '../utils/api';
import SEO from '../components/SEO';

const FASHION_IMAGE_PRESETS = [
  { label: 'Paris Runway', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Minimalist Silhouette', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quiet Luxury Wool', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sustainable Silk', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80' },
];

const GUEST_POST_FAQS = [
  {
    q: "Are guest post backlinks dofollow and permanent?",
    a: "Yes. All accepted guest articles receive permanent, dofollow contextual anchor text backlinks to your website, plus an author bio attribution link."
  },
  {
    q: "How fast will my article be reviewed and published?",
    a: "Our editorial desk reviews, formats, and publishes submissions within 24 to 48 hours. You will receive an email update with your live link."
  },
  {
    q: "What topics and niches are accepted?",
    a: "We welcome original articles on fashion trends, apparel, styling guides, luxury lifestyle, footwear, sustainable textiles, beauty, accessories, and designer brand stories."
  }
];

export default function GuestPostingPage({ categories = [] }) {
  // Pre-load saved contributor info from browser storage
  const savedContributor = (() => {
    try {
      const saved = localStorage.getItem('zaib_contributor_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    title: '',
    category_name: categories[0]?.name || 'Haute Couture',
    cover_image: FASHION_IMAGE_PRESETS[0].url,
    content: '',
    author_name: savedContributor?.name || '',
    author_email: savedContributor?.email || '',
    author_website: savedContributor?.brand_website || '',
    author_bio: savedContributor?.author_bio || ''
  });

  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Tracking state
  const [trackId, setTrackId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  // Insert markdown helpers
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('story-content-area');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.content.substring(start, end) || 'Text';
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = formData.content.substring(0, start) + replacement + formData.content.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Please enter a story title.');
      return;
    }
    if (wordCount < 50) {
      setErrorMsg('Please write at least 50 words for your article draft.');
      return;
    }
    if (!formData.author_name.trim() || !formData.author_email.trim()) {
      setErrorMsg('Author name and email are required so we can notify you when live.');
      return;
    }

    setSubmitting(true);
    try {
      // Save author profile for next time
      const authorProfile = {
        name: formData.author_name.trim(),
        email: formData.author_email.trim(),
        brand_website: formData.author_website.trim(),
        author_bio: formData.author_bio.trim(),
        last_submitted: new Date().toISOString()
      };
      localStorage.setItem('zaib_contributor_auth', JSON.stringify(authorProfile));

      const payload = {
        title: formData.title.trim(),
        category_name: formData.category_name,
        pitch_summary: formData.content.substring(0, 180).trim(),
        content: formData.content,
        cover_image: formData.cover_image,
        author_name: formData.author_name.trim(),
        author_email: formData.author_email.trim(),
        author_website: formData.author_website.trim(),
        author_bio: formData.author_bio.trim() || `Editorial contributor writing for ${formData.author_name}.`
      };

      const res = await api.submitGuestPost(payload);
      if (res.success) {
        setSubmittedResult({
          tracking_id: res.tracking_id || `GP-${Date.now().toString().slice(-4)}`,
          title: formData.title,
          email: formData.author_email,
          website: formData.author_website
        });
      } else {
        setErrorMsg(res.error || 'Failed to submit article. Please try again.');
      }
    } catch {
      setErrorMsg('Could not transmit your article. Please check your internet connection.');
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
      setTrackingError('No article found with this tracking ID.');
    } finally {
      setTrackingLoading(false);
    }
  };

  // Live reader preview parser
  const renderPreviewContent = (text) => {
    if (!text) return <p className="text-ink-400 italic">Your article preview will render here...</p>;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="font-serif text-2xl font-bold text-ink-900 mt-6 mb-3">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-xl font-bold text-ink-900 mt-5 mb-2">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-ink-900 pl-4 py-1 my-4 italic text-ink-700 bg-ink-50">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-6 list-disc text-ink-800 my-1 leading-relaxed">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }

      // Inline markdown parser for links and bold
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIdx = 0;
      let match;
      while ((match = linkRegex.exec(trimmed)) !== null) {
        if (match.index > lastIdx) {
          parts.push(trimmed.substring(lastIdx, match.index));
        }
        parts.push(
          <a
            key={match.index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-accent underline font-semibold hover:opacity-80"
          >
            {match[1]}
          </a>
        );
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < trimmed.length) {
        parts.push(trimmed.substring(lastIdx));
      }

      return (
        <p key={idx} className="text-base text-ink-800 leading-[1.85] mb-4">
          {parts.length > 0 ? parts : trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-14 text-ink-900">
      <SEO
        title="Write on ZAIB ATTIRE — Free Guest Posting & Editorial Submissions"
        description="Publish fashion guest posts with brand backlinks on ZAIB ATTIRE. Fast 24-48h editorial review, permanent dofollow backlinks, and high authority reach."
        keywords="write for us fashion, submit guest post fashion, fashion backlink, free guest posting, fashion brand story"
        canonicalUrl="/write"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Write / Guest Post', item: '/write' }
        ]}
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-8">

        {/* ── Page Header — Simple & Direct ── */}
        <div className="border-b border-ink-200 pb-8 mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-100 text-xs font-semibold text-ink-700 mb-3">
            <Feather size={13} className="text-brand-accent" />
            <span>Open Contributor Desk • Free Guest Post</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight mb-3">
            Write on ZAIB ATTIRE
          </h1>
          <p className="text-base text-ink-500 leading-relaxed">
            Publish your fashion perspective, runway critique, or brand narrative. We offer 100% free publication with permanent dofollow backlinks to your brand.
          </p>

          {/* Quick reassurance pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-medium text-ink-600">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-ink-100 rounded-full">
              <Check size={13} className="text-emerald-600" /> 100% Free
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-ink-100 rounded-full">
              <Check size={13} className="text-emerald-600" /> Permanent Dofollow Link
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-ink-100 rounded-full">
              <Check size={13} className="text-emerald-600" /> 24–48h Fast Review
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-ink-100 rounded-full">
              <Check size={13} className="text-emerald-600" /> Google Indexed
            </span>
          </div>
        </div>

        {/* ── SUCCESS STATE ── */}
        {submittedResult ? (
          <div className="max-w-2xl mx-auto border border-emerald-200 rounded-2xl p-8 sm:p-12 text-center bg-emerald-50/50 shadow-xs animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-2">
              Story Submitted Successfully!
            </h2>
            <div className="inline-block px-4 py-1.5 bg-white border border-emerald-300 rounded-full font-mono text-xs font-bold text-emerald-800 my-3">
              Tracking ID: {submittedResult.tracking_id}
            </div>
            <p className="text-sm text-ink-700 leading-relaxed max-w-lg mx-auto mb-6">
              Thank you for sharing your fashion authority. Our editorial team will review and publish <strong>"{submittedResult.title}"</strong> within 24 to 48 hours. A publication confirmation with your live link will be sent to <strong>{submittedResult.email}</strong>.
            </p>
            {submittedResult.website && (
              <p className="text-xs text-ink-500 mb-8">
                Target Backlink Domain: <span className="font-medium text-ink-800">{submittedResult.website}</span>
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSubmittedResult(null);
                  setFormData(prev => ({ ...prev, title: '', content: '' }));
                }}
                className="btn-primary"
              >
                Submit Another Story
              </button>
              <Link to="/blog" className="btn-ghost">
                Browse Stories
              </Link>
            </div>
          </div>
        ) : (
          /* ── MAIN 2-COLUMN SUBMISSION CANVAS ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left: The Simple Clean Writing Form (8 cols) */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle size={17} className="shrink-0" />
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
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. The Evolution of Quiet Luxury & Tactile Tailoring"
                    className="w-full px-4 py-3.5 bg-white border border-ink-200 rounded-xl font-serif text-xl font-bold text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 transition"
                  />
                </div>

                {/* 2. Category & Topic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
                      Topic / Category *
                    </label>
                    <select
                      value={formData.category_name}
                      onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                      className="w-full px-3.5 py-3 bg-white border border-ink-200 rounded-xl text-sm font-medium text-ink-900 focus:outline-none focus:border-ink-900 transition"
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                      {categories.length === 0 && (
                        <>
                          <option value="Haute Couture">Haute Couture</option>
                          <option value="Street Style">Street Style</option>
                          <option value="Quiet Luxury">Quiet Luxury</option>
                          <option value="Sustainable Fashion">Sustainable Fashion</option>
                          <option value="Footwear & Accessories">Footwear & Accessories</option>
                          <option value="Brand Story">Brand Story</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 3. Cover Photo Quick-Select */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink-600 mb-2">
                      Featured Cover Photo
                    </label>
                    <input
                      type="url"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      placeholder="Paste image URL (https://...)"
                      className="w-full px-3.5 py-3 bg-white border border-ink-200 rounded-xl text-xs text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 transition"
                    />
                  </div>
                </div>

                {/* Image Presets Quick-Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-ink-400 font-medium">Quick Photo Presets:</span>
                  {FASHION_IMAGE_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setFormData({ ...formData, cover_image: preset.url })}
                      className={`text-xs px-2.5 py-1 rounded-full border transition ${
                        formData.cover_image === preset.url
                          ? 'border-ink-900 bg-ink-900 text-white font-semibold'
                          : 'border-ink-200 text-ink-600 hover:border-ink-400 bg-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* 4. Article Content Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-600">
                      Story Content & Backlinks *
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
                      {/* Markdown Toolbar */}
                      <div className="bg-[#fafaf8] border-b border-ink-200 px-3 py-2 flex flex-wrap items-center gap-1 text-ink-700">
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**')}
                          className="p-1.5 hover:bg-ink-200 rounded text-xs font-bold"
                          title="Bold"
                        >
                          <Bold size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*')}
                          className="p-1.5 hover:bg-ink-200 rounded text-xs italic"
                          title="Italic"
                        >
                          <Italic size={14} />
                        </button>
                        <span className="w-px h-4 bg-ink-300 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n## ')}
                          className="p-1.5 hover:bg-ink-200 rounded text-xs"
                          title="Heading 2"
                        >
                          <Heading2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n### ')}
                          className="p-1.5 hover:bg-ink-200 rounded text-xs"
                          title="Heading 3"
                        >
                          <Heading3 size={14} />
                        </button>
                        <span className="w-px h-4 bg-ink-300 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n> ')}
                          className="p-1.5 hover:bg-ink-200 rounded text-xs"
                          title="Quote"
                        >
                          <Quote size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('\n- ')}
                          className="p-1.5 hover:bg-ink-200 rounded text-xs"
                          title="Bullet List"
                        >
                          <List size={14} />
                        </button>
                        <span className="w-px h-4 bg-ink-300 mx-1" />
                        {/* Insert Anchor Link button */}
                        <button
                          type="button"
                          onClick={() => setShowLinkModal(true)}
                          className="px-2.5 py-1 bg-brand-accent/20 hover:bg-brand-accent/30 text-ink-900 font-semibold rounded text-xs flex items-center gap-1 border border-brand-accent/40"
                          title="Insert Dofollow Anchor Link"
                        >
                          <LinkIcon size={12} />
                          <span>Insert Backlink</span>
                        </button>

                        <div className="ml-auto text-[11px] text-ink-500 font-medium pr-1">
                          {wordCount} words · ~{estimatedReadTime} min read
                        </div>
                      </div>

                      {/* Textarea */}
                      <textarea
                        id="story-content-area"
                        required
                        rows={14}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Compose your fashion article here... Share your trend breakdown, brand craftsmanship, styling perspectives, and insert your brand links..."
                        className="w-full p-4 font-reading text-base leading-[1.85] text-ink-800 placeholder:text-ink-400 focus:outline-none resize-y"
                      />
                    </div>
                  ) : (
                    /* Reader Preview Mode */
                    <div className="border border-ink-200 rounded-xl p-6 bg-white min-h-[350px]">
                      {renderPreviewContent(formData.content)}
                    </div>
                  )}
                  <p className="text-[11px] text-ink-400 mt-1.5">
                    Pro tip: Use the <strong>Insert Backlink</strong> button to embed your brand's anchor text link naturally in your story.
                  </p>
                </div>

                {/* 5. Author & Backlink Credentials (No Password Needed!) */}
                <div className="border border-ink-200 rounded-xl p-5 sm:p-6 bg-[#fafaf8]">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={16} className="text-ink-900" />
                    <h3 className="font-serif text-lg font-bold text-ink-900">
                      Author & Backlink Profile
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">
                        Your Full Name / Author Byline *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.author_name}
                        onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                        placeholder="e.g. Elena Rossi"
                        className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-900 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">
                        Your Email Address * <span className="font-normal text-ink-400">(for live link notice)</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.author_email}
                        onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                        placeholder="elena@myfashionbrand.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-900 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">
                        Brand / Target Backlink Website URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={formData.author_website}
                          onChange={(e) => setFormData({ ...formData, author_website: e.target.value })}
                          placeholder="https://mybrand.com"
                          className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-900 transition"
                        />
                        <Globe size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">
                        Short Author Bio <span className="font-normal text-ink-400">(1 sentence)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.author_bio}
                        onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                        placeholder="e.g. Founder at Milan Atelier, writing on sustainable textiles."
                        className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-900 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-ink-900 hover:bg-black text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Story to Editorial Desk...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Article for Free Publication</span>
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Right: Clean Sticky Sidebar with Guidelines & Tracker (4 cols) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Card 1: Editorial Checklist */}
              <div className="border border-ink-200 rounded-2xl p-6 bg-[#fafaf8]">
                <h4 className="font-serif text-base font-bold text-ink-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Editorial Standards</span>
                </h4>
                <ul className="text-xs text-ink-600 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span><strong>100% Free Publication:</strong> Zero fees for writers or brands.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span><strong>Dofollow Links:</strong> Up to 2 contextual anchor links allowed per story.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span><strong>Length:</strong> 400+ words recommended for fast Google indexing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span><strong>Originality:</strong> Must be original and written with insight.</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Track Submission */}
              <div className="border border-ink-200 rounded-2xl p-6 bg-white shadow-2xs">
                <h4 className="font-serif text-base font-bold text-ink-900 mb-2 flex items-center gap-2">
                  <Search size={15} />
                  <span>Track Submission</span>
                </h4>
                <p className="text-xs text-ink-500 mb-3">
                  Check the live editorial review status of your previous draft.
                </p>

                <form onSubmit={handleTrackSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      placeholder="e.g. GP-1234"
                      className="flex-1 px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs font-mono text-ink-900 uppercase focus:outline-none focus:border-ink-900"
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="px-3.5 py-2 bg-ink-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition"
                    >
                      {trackingLoading ? '...' : 'Track'}
                    </button>
                  </div>
                </form>

                {trackingError && (
                  <p className="text-xs text-red-600 mt-2">{trackingError}</p>
                )}

                {trackingResult && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                    <p className="font-bold">Status: {trackingResult.status || 'Under Review'}</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Editorial queue priority active.</p>
                  </div>
                )}
              </div>

              {/* Card 3: Quick FAQs */}
              <div className="border border-ink-200 rounded-2xl p-6 bg-white space-y-4">
                <h4 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
                  <HelpCircle size={15} className="text-brand-muted" />
                  <span>Contributor FAQs</span>
                </h4>
                <div className="space-y-3">
                  {GUEST_POST_FAQS.map((faq, idx) => (
                    <div key={idx} className="border-b border-ink-100 pb-2.5 last:border-b-0">
                      <p className="text-xs font-bold text-ink-900 mb-1">{faq.q}</p>
                      <p className="text-xs text-ink-500 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ── MODAL: Insert Dofollow Anchor Link ── */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-ink-200 p-6 max-w-md w-full shadow-xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-ink-200 pb-3">
              <h4 className="font-serif text-lg font-bold text-ink-900 flex items-center gap-2">
                <LinkIcon size={16} className="text-brand-accent" />
                <span>Insert Anchor Text Link</span>
              </h4>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-ink-400 hover:text-ink-900 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">
                  Anchor Text (Words that readers will click)
                </label>
                <input
                  type="text"
                  value={linkData.text}
                  onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                  placeholder="e.g. Sustainable Italian Cashmere"
                  className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">
                  Target Website URL (Your backlink destination)
                </label>
                <input
                  type="url"
                  value={linkData.url}
                  onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                  placeholder="https://yourbrand.com/collection"
                  className="w-full px-3.5 py-2.5 bg-white border border-ink-200 rounded-lg text-sm text-ink-900 focus:outline-none focus:border-ink-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs font-medium text-ink-600 hover:text-ink-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                disabled={!linkData.url}
                className="btn-primary text-xs py-2 px-4"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
