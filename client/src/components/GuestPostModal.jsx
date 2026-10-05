import React, { useState } from 'react';
import { X, Sparkles, Feather, Send, Search, CheckCircle2, AlertCircle, HelpCircle, Image, Globe, User, BookOpen } from 'lucide-react';
import { api } from '../utils/api';

const FASHION_IMAGE_PRESETS = [
  { label: 'Paris Atelier High Fashion', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Runway Model Silhouette', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Urban Street Style Minimalist', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Quiet Luxury Wool & Cashmere', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sustainable Eco Silk & Botanics', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sculptural Footwear & Jewelry', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80' },
];

export default function GuestPostModal({ onClose, categories = [], onPostCreated }) {
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
      setErrorMsg('Please complete all required fields (Title, Content, Name, and Email).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitGuestPost(formData);
      if (res.success) {
        setSubmittedResult(res);
        if (onPostCreated) onPostCreated();
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
      setTrackingError('Could not locate submission with this ID.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-luxury-950/85 backdrop-blur-md overflow-y-auto flex justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#fafaf8] w-full max-w-3xl my-auto rounded-none shadow-2xl border border-gold-500/30 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-luxury-950 text-white px-6 py-5 flex items-center justify-between border-b border-luxury-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/40">
              <Feather size={16} />
            </div>
            <div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold tracking-wide flex items-center gap-2">
                <span>The Contributor Desk</span>
                <span className="text-[10px] bg-gold-500 text-luxury-950 font-bold px-1.5 py-0.5 tracking-widest uppercase">
                  OPEN CALL
                </span>
              </h3>
              <p className="text-[10px] tracking-luxury uppercase text-luxury-400">
                PITCH YOUR EDITORIAL PIECE TO ZAIB ATTIRE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-luxury-400 hover:text-white hover:bg-luxury-800 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-luxury-200 bg-[#f4f4f0] text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'submit'
                ? 'border-gold-600 bg-white text-luxury-950 font-bold'
                : 'border-transparent text-luxury-600 hover:text-luxury-950'
            }`}
          >
            <Sparkles size={14} className="text-gold-600" />
            <span>Submit Guest Article</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'track'
                ? 'border-gold-600 bg-white text-luxury-950 font-bold'
                : 'border-transparent text-luxury-600 hover:text-luxury-950'
            }`}
          >
            <Search size={14} className="text-gold-600" />
            <span>Track Submission Status</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guidelines'
                ? 'border-gold-600 bg-white text-luxury-950 font-bold'
                : 'border-transparent text-luxury-600 hover:text-luxury-950'
            }`}
          >
            <BookOpen size={14} className="text-gold-600" />
            <span>Guidelines & Perks</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* TAB 1: SUBMIT GUEST ARTICLE */}
          {activeTab === 'submit' && (
            <div>
              {submittedResult ? (
                <div className="text-center py-8 px-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-editorial text-2xl font-bold text-luxury-950 mb-2">
                    Submission Received at the Atelier Desk
                  </h4>
                  <p className="text-luxury-700 text-sm max-w-md mx-auto leading-relaxed mb-6 font-light">
                    Your piece has been placed before our editorial review board. Acceptance notifications are dispatched within 48 hours.
                  </p>

                  <div className="bg-champagne-50 p-4 border border-gold-300 max-w-sm mx-auto mb-6 text-left">
                    <div className="text-[10px] tracking-widest uppercase text-luxury-600 font-semibold mb-1">
                      YOUR TRACKING REFERENCE:
                    </div>
                    <div className="font-mono text-sm font-bold text-gold-800 break-all select-all">
                      {submittedResult.submissionId}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setTrackId(submittedResult.submissionId);
                        setActiveTab('track');
                        setSubmittedResult(null);
                      }}
                      className="px-5 py-2.5 bg-luxury-950 text-white font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
                    >
                      Track In Portal
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 border border-luxury-300 text-luxury-800 font-bold text-xs uppercase tracking-luxury hover:bg-luxury-100 transition"
                    >
                      Return to Journal
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 text-rose-800 border border-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Section 1: Editorial Pitch */}
                  <div className="border-b border-luxury-200 pb-5">
                    <h4 className="font-editorial text-base font-bold text-luxury-950 mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 text-[10px] flex items-center justify-center font-bold">1</span>
                      <span>The Editorial Concept</span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Article Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Sculptural Silhouettes: Why Tokyo Tailoring is Dismantling Streetwear"
                          className="w-full p-3 border border-luxury-300 text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                            Primary Category *
                          </label>
                          <select
                            name="category_name"
                            value={formData.category_name}
                            onChange={handleChange}
                            className="w-full p-3 border border-luxury-300 text-xs uppercase tracking-wider focus:outline-none focus:border-gold-500 bg-white"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                            Fashion Season
                          </label>
                          <select
                            name="season"
                            value={formData.season}
                            onChange={handleChange}
                            className="w-full p-3 border border-luxury-300 text-xs uppercase tracking-wider focus:outline-none focus:border-gold-500 bg-white"
                          >
                            <option value="Spring / Summer 2026">Spring / Summer 2026</option>
                            <option value="Fall / Winter 2026">Fall / Winter 2026</option>
                            <option value="Resort 2026">Resort 2026</option>
                            <option value="Pre-Fall 2026">Pre-Fall 2026</option>
                            <option value="Timeless / Archival">Timeless / Archival</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Pitch Excerpt / Subtitle
                        </label>
                        <input
                          type="text"
                          name="pitch_summary"
                          value={formData.pitch_summary}
                          onChange={handleChange}
                          placeholder="Brief 1-2 sentence hook highlighting the core thesis of your critique."
                          className="w-full p-3 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Visual Mood & Photography */}
                  <div className="border-b border-luxury-200 pb-5">
                    <h4 className="font-editorial text-base font-bold text-luxury-950 mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 text-[10px] flex items-center justify-center font-bold">2</span>
                      <span>Cover Photography & Mood</span>
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Cover Image URL (Direct high-res link)
                        </label>
                        <input
                          type="url"
                          name="cover_image"
                          value={formData.cover_image}
                          onChange={handleChange}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full p-3 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500 font-mono"
                        />
                      </div>

                      {/* Preset Chooser */}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-luxury-500 block mb-1.5">
                          Or select from curated runway imagery presets:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {FASHION_IMAGE_PRESETS.map((preset, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => handlePresetSelect(preset.url)}
                              className={`p-1.5 border text-left flex items-center space-x-2 text-[10px] transition ${
                                formData.cover_image === preset.url
                                  ? 'border-gold-600 bg-gold-50 font-bold'
                                  : 'border-luxury-200 hover:border-luxury-400'
                              }`}
                            >
                              <img src={preset.url} alt="" className="w-6 h-6 object-cover" />
                              <span className="truncate">{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Article Body Content */}
                  <div className="border-b border-luxury-200 pb-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-editorial text-base font-bold text-luxury-950 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 text-[10px] flex items-center justify-center font-bold">3</span>
                        <span>Full Article Manuscript *</span>
                      </h4>
                      <span className="text-[10px] text-luxury-500 uppercase tracking-wider">
                        Supports Markdown (## Heading, &gt; Quote)
                      </span>
                    </div>

                    <textarea
                      name="content"
                      required
                      rows={8}
                      value={formData.content}
                      onChange={handleChange}
                      placeholder={`## The Evolution of Form\n\nBegin your fashion critique here. Describe textures, runway context, tailoring techniques, and cultural significance...\n\n> "Fashion is the armor to survive the reality of everyday life."\n\n### Materiality and Craftsmanship\nDetail specific textiles, silhouetting, or atelier heritage.`}
                      className="w-full p-3 border border-luxury-300 text-xs leading-relaxed focus:outline-none focus:border-gold-500 font-sans"
                    ></textarea>

                    <div className="mt-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                        Thematic Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Couture, Milan, Leather, Tailoring, Avant-Garde"
                        className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Section 4: Author Credentials & Bio */}
                  <div className="border-b border-luxury-200 pb-5">
                    <h4 className="font-editorial text-base font-bold text-luxury-950 mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-950 text-gold-400 text-[10px] flex items-center justify-center font-bold">4</span>
                      <span>Author Byline & Attribution *</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          name="author_name"
                          required
                          value={formData.author_name}
                          onChange={handleChange}
                          placeholder="e.g. Julian Vance"
                          className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Editorial Email *
                        </label>
                        <input
                          type="email"
                          name="author_email"
                          required
                          value={formData.author_email}
                          onChange={handleChange}
                          placeholder="julian@fashionpress.co"
                          className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Author Bio (Appears under published article)
                        </label>
                        <input
                          type="text"
                          name="author_bio"
                          value={formData.author_bio}
                          onChange={handleChange}
                          placeholder="e.g. Freelance fashion stylist and runway commentator based between Tokyo and Paris."
                          className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Portfolio / Website URL (Do-Follow Link)
                        </label>
                        <input
                          type="url"
                          name="author_website"
                          value={formData.author_website}
                          onChange={handleChange}
                          placeholder="https://yourportfolio.com"
                          className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-luxury-700 mb-1">
                          Social Handle (Instagram/X)
                        </label>
                        <input
                          type="text"
                          name="author_social"
                          value={formData.author_social}
                          onChange={handleChange}
                          placeholder="@your_handle"
                          className="w-full p-2.5 border border-luxury-300 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission Action */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-luxury-500 max-w-sm">
                      By submitting, you certify this writing is original and adheres to the ZAIB ATTIRE Editorial Codex.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 bg-luxury-950 hover:bg-gold-500 text-white hover:text-luxury-950 font-bold text-xs uppercase tracking-luxury transition-all flex items-center gap-2 shadow-lg"
                    >
                      <Send size={14} />
                      <span>{submitting ? 'Transmitting...' : 'Submit For Review'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: TRACK SUBMISSION STATUS */}
          {activeTab === 'track' && (
            <div className="py-4 space-y-6">
              <div className="text-center max-w-md mx-auto">
                <Search size={32} className="text-gold-600 mx-auto mb-2" />
                <h4 className="font-editorial text-xl font-bold text-luxury-950">
                  Track Editorial Review
                </h4>
                <p className="text-xs text-luxury-600 mt-1">
                  Enter your submission reference code (e.g. <span className="font-mono text-gold-700 font-bold">gsub_01</span> or your submitted ID) to view your review status in real time.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="e.g. gsub_01"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="flex-1 p-3 border border-luxury-300 text-xs tracking-wider uppercase font-mono focus:outline-none focus:border-gold-500"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-6 py-3 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
                >
                  {trackingLoading ? 'Checking...' : 'Inspect'}
                </button>
              </form>

              {trackingError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-300 text-xs max-w-md mx-auto text-center">
                  {trackingError}
                </div>
              )}

              {trackingResult && (
                <div className="bg-white p-6 border border-luxury-200 max-w-lg mx-auto shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-luxury-200">
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-500">
                      SUBMISSION STATUS
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      trackingResult.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : trackingResult.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    }`}>
                      {trackingResult.status === 'approved' ? '✓ Accepted & Published' :
                       trackingResult.status === 'rejected' ? '✗ Not Selected' : '⟳ Under Editorial Review'}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-editorial text-lg font-bold text-luxury-950">
                      {trackingResult.title}
                    </h5>
                    <p className="text-xs text-luxury-500 mt-0.5">
                      Contributed by {trackingResult.author_name} • {trackingResult.category_name}
                    </p>
                  </div>

                  {trackingResult.editorial_feedback && (
                    <div className="p-3.5 bg-champagne-50 border-l-2 border-gold-500 text-xs text-luxury-800 italic">
                      <span className="font-bold not-italic text-gold-800 block text-[10px] uppercase mb-0.5">
                        Editorial Desk Notes:
                      </span>
                      "{trackingResult.editorial_feedback}"
                    </div>
                  )}

                  <div className="text-[10px] text-luxury-400">
                    Submitted: {new Date(trackingResult.created_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GUIDELINES & PERKS */}
          {activeTab === 'guidelines' && (
            <div className="space-y-6">
              <div className="bg-champagne-50 p-6 border border-gold-300">
                <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-2">
                  Why Write For ZAIB ATTIRE?
                </h4>
                <p className="text-xs text-luxury-700 leading-relaxed font-light">
                  ZAIB ATTIRE is an editorial sanctuary for serious fashion discourse. We offer prominent byline attribution, do-follow links to your creative portfolio, and amplification across our international readership of stylists, buyers, and fashion connoisseurs.
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="font-editorial text-base font-bold text-luxury-900 border-b border-luxury-200 pb-2">
                  Editorial Standards Checklist
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-white border border-luxury-200">
                    <span className="font-bold text-luxury-950 block mb-1">01. Originality & Depth</span>
                    <p className="text-luxury-600">Articles must be 100% original, unpublished, and feature thoughtful analysis rather than superficial listicles.</p>
                  </div>

                  <div className="p-4 bg-white border border-luxury-200">
                    <span className="font-bold text-luxury-950 block mb-1">02. Word Count & Tone</span>
                    <p className="text-luxury-600">800 to 2,500 words written in an authoritative, poetic, yet accessible editorial tone.</p>
                  </div>

                  <div className="p-4 bg-white border border-luxury-200">
                    <span className="font-bold text-luxury-950 block mb-1">03. Author Attribution</span>
                    <p className="text-luxury-600">Every contributor receives a permanent author profile card featuring their bio, portfolio link, and social channels.</p>
                  </div>

                  <div className="p-4 bg-white border border-luxury-200">
                    <span className="font-bold text-luxury-950 block mb-1">04. Fast Turnaround</span>
                    <p className="text-luxury-600">Our editor board reviews submissions within 48 to 72 hours, providing constructive feedback.</p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-6 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
                >
                  Ready? Pitch Your Story Now
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
