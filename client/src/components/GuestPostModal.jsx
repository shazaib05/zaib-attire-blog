import React, { useState } from 'react';
import { X, Feather, Send, Search, CheckCircle2, AlertCircle, HelpCircle, Image as ImageIcon, Globe, User, BookOpen } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto flex justify-center p-3 sm:p-6 animate-fadeIn font-sans">
      <div className="relative bg-white w-full max-w-3xl my-auto rounded-2xl shadow-2xl border border-ink-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-ink-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-ink-100 flex items-center justify-center text-ink-900">
              <Feather size={16} className="text-brand-accent" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 flex items-center gap-2">
                <span>Write Story</span>
                <span className="text-[10px] bg-brand-accent/20 text-brand-muted font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Free Guest Post
                </span>
              </h3>
              <p className="text-xs text-ink-400">
                Submit an article to ZAIB ATTIRE with permanent dofollow backlinks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-900 hover:bg-ink-100 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ink-200 bg-ink-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'submit'
                ? 'bg-white text-ink-900 border-b-2 border-ink-900'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            Submit Story
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'track'
                ? 'bg-white text-ink-900 border-b-2 border-ink-900'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            Track Status
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex-1 py-3 text-center transition ${
              activeTab === 'guidelines'
                ? 'bg-white text-ink-900 border-b-2 border-ink-900'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            Guidelines
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'submit' && (
            submittedResult ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="font-serif text-2xl font-bold text-ink-900">
                  Article Transmitted
                </h4>
                <p className="text-sm text-ink-500 max-w-md mx-auto">
                  Your piece has been transmitted to our editorial desk for review within 48 hours.
                </p>
                <div className="p-4 border border-ink-200 rounded-xl bg-ink-100 text-center space-y-1 max-w-sm mx-auto">
                  <span className="text-xs text-ink-500 uppercase font-semibold">Tracking Code</span>
                  <div className="font-mono text-xl font-bold text-ink-900">{submittedResult.tracking_id}</div>
                </div>
                <button onClick={onClose} className="btn-primary text-xs py-2 px-6">
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Sculptural Silhouettes: Why Ateliers Champion Wool in 2026"
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 font-serif font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">
                      Topic / Category *
                    </label>
                    <select
                      name="category_name"
                      value={formData.category_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-ink-100 rounded-lg text-xs text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">
                      Fashion Season
                    </label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-ink-100 rounded-lg text-xs text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                    >
                      <option value="Spring / Summer 2026">Spring / Summer 2026</option>
                      <option value="Fall / Winter 2026">Fall / Winter 2026</option>
                      <option value="Resort 2026">Resort 2026</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Cover Photo (Presets)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                    {FASHION_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handlePresetSelect(preset.url)}
                        className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${
                          formData.cover_image === preset.url
                            ? 'border-brand-accent'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Article Body *
                  </label>
                  <textarea
                    required
                    rows={8}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Draft your fashion story... You can use markdown like ## Subheading and [Anchor Text](https://yourbrand.com) for backlinks."
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 font-serif focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-ink-200">
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
                      className="w-full px-3 py-2 bg-ink-100 rounded-lg text-xs text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
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
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 bg-ink-100 rounded-lg text-xs text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-ink-700 mb-1">
                      Brand Website / Target URL (Permanent Backlink)
                    </label>
                    <input
                      type="url"
                      name="author_website"
                      value={formData.author_website}
                      onChange={handleChange}
                      placeholder="https://yourbrand.com"
                      className="w-full px-3 py-2 bg-ink-100 rounded-lg text-xs text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-ghost text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs py-2 px-5 disabled:opacity-50"
                  >
                    {submitting ? 'Transmitting...' : 'Submit Story'}
                  </button>
                </div>
              </form>
            )
          )}

          {activeTab === 'track' && (
            <div className="space-y-4 max-w-md mx-auto py-4">
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                  placeholder="GP-..."
                  className="flex-1 px-3 py-2 bg-ink-100 rounded-lg text-xs font-mono text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 uppercase"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="btn-primary text-xs py-2 px-4 shrink-0"
                >
                  {trackingLoading ? 'Checking...' : 'Check Status'}
                </button>
              </form>

              {trackingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {trackingError}
                </div>
              )}

              {trackingResult && (
                <div className="border border-ink-200 rounded-xl p-4 bg-ink-50 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-ink-900">{trackingResult.title}</h4>
                  <p className="text-xs text-ink-500">Status: <strong className="text-ink-900">{trackingResult.status}</strong></p>
                  {trackingResult.reviewer_notes && (
                    <p className="text-xs text-ink-600 italic">Notes: "{trackingResult.reviewer_notes}"</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-4 text-xs text-ink-600 leading-relaxed font-serif">
              <h4 className="font-sans font-bold text-ink-900 text-sm">Guest Post Standards</h4>
              <p>1. Articles must be original, insightful fashion analysis or brand stories.</p>
              <p>2. Up to 2 contextual dofollow anchor links permitted per piece.</p>
              <p>3. Each author receives a permanent author attribution card with brand backlink.</p>
              <p>4. Editorial reviews are completed within 48 hours.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
