import React, { useState, useEffect } from 'react';
import {
  Sparkles, Feather, Send, Search, CheckCircle2, AlertCircle,
  HelpCircle, Image as ImageIcon, Globe, User, BookOpen, Clock,
  ArrowRight, Check, Award, Compass, Share2
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

export default function GuestPostingPage({ categories = [] }) {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'track' | 'guidelines'

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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePresetSelect = (url) => {
    setFormData(prev => ({ ...prev, cover_image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.title || !formData.content || !formData.author_name || !formData.author_email) {
      setErrorMsg('Please complete all required fields (Article Title, Full Content, Author Name, and Email).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitGuestPost(formData);
      if (res.success) {
        setSubmittedResult(res);
      } else {
        setErrorMsg(res.error || 'Failed to submit article.');
      }
    } catch (err) {
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

  return (
    <div className="min-h-screen bg-[#fafaf8] py-10 sm:py-16 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-bold mb-4">
            <Feather size={12} />
            <span>THE GUEST CONTRIBUTOR ATELIER • OPEN SUBMISSIONS 2026</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-luxury-950 mb-4">
            Write For ZAIB ATTIRE
          </h1>
          <p className="font-cormorant text-lg sm:text-2xl text-luxury-600 italic leading-relaxed">
            "Elevate your sartorial voice. We welcome freelance fashion journalists, trend analysts, stylists, and subculture historians into our global editorial archives."
          </p>
        </div>

        {/* 4 Pillars of Guest Posting with ZAIB ATTIRE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
          <div className="bg-white border border-luxury-200 p-6 shadow-xs">
            <div className="w-10 h-10 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-base mb-4">
              01
            </div>
            <h4 className="font-editorial text-base font-bold text-luxury-950 mb-1">
              Global Runway Reach
            </h4>
            <p className="text-xs text-luxury-600 leading-relaxed font-light">
              Over 240k monthly readers across Paris, Milan, London, New York, and Tokyo.
            </p>
          </div>

          <div className="bg-white border border-luxury-200 p-6 shadow-xs">
            <div className="w-10 h-10 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-base mb-4">
              02
            </div>
            <h4 className="font-editorial text-base font-bold text-luxury-950 mb-1">
              Dofollow Backlinks
            </h4>
            <p className="text-xs text-luxury-600 leading-relaxed font-light">
              Prominent author byline with dofollow portfolio & personal site backlinks.
            </p>
          </div>

          <div className="bg-white border border-luxury-200 p-6 shadow-xs">
            <div className="w-10 h-10 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-base mb-4">
              03
            </div>
            <h4 className="font-editorial text-base font-bold text-luxury-950 mb-1">
              Rapid 48-Hour Review
            </h4>
            <p className="text-xs text-luxury-600 leading-relaxed font-light">
              Our editorial desk reviews, edits, and responds to all guest pitches within 48 hours.
            </p>
          </div>

          <div className="bg-white border border-luxury-200 p-6 shadow-xs">
            <div className="w-10 h-10 bg-luxury-950 text-gold-400 flex items-center justify-center font-bold text-base mb-4">
              04
            </div>
            <h4 className="font-editorial text-base font-bold text-luxury-950 mb-1">
              Social Syndication
            </h4>
            <p className="text-xs text-luxury-600 leading-relaxed font-light">
              Approved articles are syndicated to our VIP newsletter and fashion channels.
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
            <Feather size={14} className={activeTab === 'submit' ? 'text-gold-600' : ''} />
            <span>Submit An Article</span>
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

        {/* TAB 1: SUBMISSION FORM */}
        {activeTab === 'submit' && (
          <div className="bg-white border border-luxury-200 p-6 sm:p-12 shadow-sm">
            {submittedResult ? (
              <div className="text-center py-12 max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950 mb-2">
                    Dispatch Successfully Transmitted
                  </h3>
                  <p className="text-xs text-luxury-600 leading-relaxed">
                    Your guest article has been queued in our review atelier. Our senior editors will inspect your prose and photography within 48 hours.
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
                    Keep this code handy. You can check your article review status anytime in the "Track Submission" tab.
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
                        author_name: '',
                        author_email: '',
                        author_bio: '',
                        author_website: '',
                        author_social: '',
                        author_avatar: ''
                      });
                    }}
                    className="px-6 py-2.5 bg-luxury-950 text-gold-400 text-xs uppercase tracking-luxury font-bold hover:bg-gold-500 hover:text-luxury-950 transition"
                  >
                    Submit Another Article
                  </button>
                  <button
                    onClick={() => {
                      setTrackId(submittedResult.tracking_id);
                      setActiveTab('track');
                    }}
                    className="px-6 py-2.5 bg-luxury-100 text-luxury-800 text-xs uppercase tracking-luxury font-bold hover:bg-luxury-200 transition"
                  >
                    Track This Submission
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section A: Author Credentials */}
                <div>
                  <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 mb-3 flex items-center gap-1.5">
                    <User size={13} />
                    <span>STEP 1: CONTRIBUTOR CREDENTIALS & ATTRIBUTION</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Author Name *
                      </label>
                      <input
                        type="text"
                        name="author_name"
                        required
                        value={formData.author_name}
                        onChange={handleChange}
                        placeholder="e.g. Vivienne Westwood"
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Author Email *
                      </label>
                      <input
                        type="email"
                        name="author_email"
                        required
                        value={formData.author_email}
                        onChange={handleChange}
                        placeholder="editor@domain.com"
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Author Portfolio / Website URL
                      </label>
                      <input
                        type="url"
                        name="author_website"
                        value={formData.author_website}
                        onChange={handleChange}
                        placeholder="https://myportfoliostyle.com"
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                      <span className="text-[9px] text-luxury-500">Dofollow backlink will be assigned here</span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Author Bio (2-3 sentences)
                      </label>
                      <input
                        type="text"
                        name="author_bio"
                        value={formData.author_bio}
                        onChange={handleChange}
                        placeholder="e.g. Freelance fashion journalist based in London covering avant-garde British millinery and sustainable dyes."
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
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
                        placeholder="@sartorialjournal"
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Article Metadata */}
                <div className="pt-6 border-t border-luxury-200">
                  <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 mb-3 flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>STEP 2: ARTICLE SPECIFICATION & CLASSIFICATION</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Article Headline *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. The Structural Revival of Corsetry in Contemporary Streetwear"
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500 font-editorial text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Category / Trend Department *
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
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="haute couture, tailoring, silk, runway, milan"
                        className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Summary / Excerpt */}
                  <div className="mb-5">
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                      Editorial Standfirst / Pitch Excerpt (1-2 sentences)
                    </label>
                    <textarea
                      name="pitch_summary"
                      rows={2}
                      value={formData.pitch_summary}
                      onChange={handleChange}
                      placeholder="A short punchy teaser that highlights why this trend matters to contemporary fashion."
                      className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500 italic font-serif"
                    />
                  </div>
                </div>

                {/* Section C: Imagery Selection */}
                <div className="pt-6 border-t border-luxury-200">
                  <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 mb-2 flex items-center gap-1.5">
                    <ImageIcon size={13} />
                    <span>STEP 3: COVER PHOTOGRAPHY (SELECT PRESET OR ENTER HIGH-RES URL)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                    {FASHION_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handlePresetSelect(preset.url)}
                        className={`text-left relative aspect-[4/3] overflow-hidden border-2 transition group ${
                          formData.cover_image === preset.url ? 'border-gold-600 ring-2 ring-gold-400' : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] uppercase tracking-wider text-white p-1 truncate block">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                      Or Custom Image URL
                    </label>
                    <input
                      type="url"
                      name="cover_image"
                      value={formData.cover_image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                {/* Section D: Full Article Content */}
                <div className="pt-6 border-t border-luxury-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] uppercase tracking-luxury font-bold text-gold-700 flex items-center gap-1.5">
                      <Feather size={13} />
                      <span>STEP 4: FULL EDITORIAL ARTICLE BODY *</span>
                    </div>
                    <span className="text-[10px] text-luxury-500">
                      Word Count: {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words
                    </span>
                  </div>

                  <textarea
                    name="content"
                    required
                    rows={12}
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Compose your article here. Supports markdown: ## Subheading, > Pull Quote, - Bullet list, etc. Recommended length: 800-2,500 words."
                    className="w-full px-4 py-3 bg-luxury-50 border border-luxury-300 text-sm font-serif leading-relaxed text-luxury-900 focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                  <div className="text-[10px] text-luxury-500 mt-1 flex items-center gap-4">
                    <span>💡 Tip: Use ## for section headings</span>
                    <span>💡 Use &gt; for highlighted runway quotes</span>
                    <span>💡 Markdown formatting accepted</span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-8 border-t border-luxury-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-luxury-500 max-w-md">
                    By submitting, you certify that this work is original, unpublished elsewhere, and conforms to the ZAIB ATTIRE Editorial Codex.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-10 py-3.5 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{submitting ? 'Transmitting To Atelier...' : 'Submit Pitch For Review'}</span>
                    <Send size={13} />
                  </button>
                </div>

              </form>
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
                Enter the unique tracking code assigned to your article upon submission (format: ZAIB-GUEST-XXXX) to review live editorial progress.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-lg mx-auto mb-8">
              <input
                type="text"
                required
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                placeholder="ZAIB-GUEST-..."
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
                    {trackingResult.tracking_id}
                  </span>
                </div>

                <div>
                  <h4 className="font-editorial text-lg font-bold text-luxury-950 mb-1">
                    {trackingResult.title}
                  </h4>
                  <div className="text-xs text-luxury-600 flex items-center gap-2">
                    <span>By {trackingResult.author_name}</span>
                    <span>•</span>
                    <span className="text-gold-700 font-semibold">{trackingResult.category_name}</span>
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
                EDITORIAL INTEGRITY
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950 mb-3">
                The ZAIB ATTIRE Contributor Codex
              </h3>
              <p className="text-xs text-luxury-600 leading-relaxed max-w-3xl">
                We maintain uncompromising journalistic and stylistic standards. Every guest article accepted into our journal is treated with the same meticulous curation as our in-house runway correspondents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="border border-luxury-200 p-6 space-y-3">
                <h4 className="font-editorial text-lg font-bold text-luxury-950 flex items-center gap-2">
                  <Check size={18} className="text-emerald-600" />
                  <span>What We Welcome</span>
                </h4>
                <ul className="text-xs text-luxury-700 space-y-2 list-disc list-inside leading-relaxed font-serif">
                  <li>Original analyses of Paris, Milan, London, and New York runway presentations.</li>
                  <li>In-depth examinations of textile innovations, quiet luxury, and sustainable tailoring.</li>
                  <li>Interviews with independent avant-garde designers and heritage artisans.</li>
                  <li>Subculture history (e.g. Japanese streetwear, archival Belgian minimalism).</li>
                  <li>Well-researched trend forecasts backed by historical fashion context.</li>
                </ul>
              </div>

              <div className="border border-luxury-200 p-6 space-y-3">
                <h4 className="font-editorial text-lg font-bold text-luxury-950 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  <span>What We Decline</span>
                </h4>
                <ul className="text-xs text-luxury-700 space-y-2 list-disc list-inside leading-relaxed font-serif">
                  <li>Promotional advertorials disguised as objective journalism without disclosure.</li>
                  <li>Spun or generic AI-generated rehashes of existing Wikipedia articles.</li>
                  <li>Fast fashion hauls or disposable consumer clothing trends.</li>
                  <li>Unattributed low-resolution imagery or unlicensed runway photography.</li>
                  <li>Articles with broken or deceptive hyperlinking practices.</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-luxury-200">
              <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-4">
                Technical Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-luxury-700">
                <div className="p-4 bg-luxury-50 border border-luxury-200">
                  <strong className="block text-luxury-950 uppercase tracking-wider text-[11px] mb-1">
                    Word Length
                  </strong>
                  <p>Minimum 800 words. Comprehensive analyses between 1,200 and 2,500 words are prioritized.</p>
                </div>
                <div className="p-4 bg-luxury-50 border border-luxury-200">
                  <strong className="block text-luxury-950 uppercase tracking-wider text-[11px] mb-1">
                    Author Attribution
                  </strong>
                  <p>Includes author biography, profile headshot, social handle, and 1 dofollow backlink to your portfolio.</p>
                </div>
                <div className="p-4 bg-luxury-50 border border-luxury-200">
                  <strong className="block text-luxury-950 uppercase tracking-wider text-[11px] mb-1">
                    Turnaround Time
                  </strong>
                  <p>Editorial desk reviews within 48 business hours. If revisions are required, notes will appear on your tracking record.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 text-center">
              <button
                onClick={() => setActiveTab('submit')}
                className="px-8 py-3 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition inline-flex items-center gap-2"
              >
                <span>Ready To Submit? Proceed To Form</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
