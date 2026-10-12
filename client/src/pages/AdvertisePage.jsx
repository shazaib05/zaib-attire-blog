import React, { useState, useEffect } from 'react';
import {
  Megaphone, Sparkles, Award, TrendingUp, Users, Globe,
  CheckCircle2, Mail, ExternalLink, ArrowRight, ShieldCheck,
  Send, FileText, Download, DollarSign, Eye, Feather
} from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../utils/api';

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    brand_name: '',
    contact_name: '',
    email: '',
    website: '',
    campaign_type: 'Sponsored Editorial Story',
    budget_range: '$1,000 – $2,500',
    launch_date: '',
    brief: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitAdvertiseInquiry(formData);
      if (res.success) {
        setInquiryId(res.inquiry_id);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit advertise inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16 animate-fadeIn font-sans">
      <SEO
        title="Advertise With Us — Fashion Media Kit & Partnerships"
        description="Partner with ZAIB ATTIRE. High-impact luxury display banners, sponsored editorial storytelling, brand spotlights, and targeted audience reach."
        keywords="advertise fashion blog, luxury fashion sponsorships, brand placement, fashion media kit, zaib attire advertising"
        canonicalUrl="/advertise"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Advertise', item: '/advertise' }
        ]}
      />

      <div className="max-w-content mx-auto px-5 sm:px-8">
        
        {/* Masthead */}
        <div className="border-b border-ink-200 pb-8 mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-100 text-xs font-semibold text-ink-700 mb-4">
            <Megaphone size={13} className="text-brand-accent" />
            <span>Brand Partnerships &amp; Media Kit</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 mb-4">
            Partner With ZAIB ATTIRE
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed font-serif">
            Position your atelier, footwear label, apparel collection, or accessories maison before a dedicated global audience of fashion enthusiasts.
          </p>
        </div>

        {/* Readership Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          <div className="border border-ink-200 rounded-2xl p-6 bg-white text-center">
            <div className="font-serif text-4xl font-bold text-ink-900 mb-1">50,000+</div>
            <div className="text-sm font-semibold text-ink-700">Monthly Readers</div>
            <p className="text-xs text-ink-500 mt-1">High-engagement fashion consumers, stylists, and buyers.</p>
          </div>

          <div className="border border-ink-200 rounded-2xl p-6 bg-white text-center">
            <div className="font-serif text-4xl font-bold text-ink-900 mb-1">82%</div>
            <div className="text-sm font-semibold text-ink-700">US &amp; European Readership</div>
            <p className="text-xs text-ink-500 mt-1">Concentrated in major fashion hubs: NY, Paris, London, Milan.</p>
          </div>

          <div className="border border-ink-200 rounded-2xl p-6 bg-white text-center">
            <div className="font-serif text-4xl font-bold text-ink-900 mb-1">3.5 min</div>
            <div className="text-sm font-semibold text-ink-700">Average Read Duration</div>
            <p className="text-xs text-ink-500 mt-1">Exceptional dwell time and editorial depth.</p>
          </div>
        </div>

        {/* Partnership Formats */}
        <div className="mb-14">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mb-6 text-center">
            Partnership Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-ink-200 rounded-2xl p-6 bg-white hover:border-ink-300 transition flex flex-col">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Editorial</span>
              <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
                Sponsored Story &amp; Brand Review
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed mb-4 flex-1">
                A long-form, beautifully formatted story written by our critics or co-published with your team, complete with high-res galleries and permanent dofollow backlinks.
              </p>
              <div className="pt-4 border-t border-ink-100 flex items-center justify-between text-xs text-ink-500">
                <span>Permanent Placement</span>
                <span className="font-semibold text-ink-900">Custom Brief</span>
              </div>
            </div>

            <div className="border border-ink-200 rounded-2xl p-6 bg-white hover:border-ink-300 transition flex flex-col">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Display</span>
              <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
                Leaderboard &amp; Sidebar Billboards
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed mb-4 flex-1">
                High-impact display banners across our homepage masthead, sidebar widgets, and story reading pages with direct brand tracking.
              </p>
              <div className="pt-4 border-t border-ink-100 flex items-center justify-between text-xs text-ink-500">
                <span>Exclusive Inventory</span>
                <span className="font-semibold text-ink-900">Monthly Run</span>
              </div>
            </div>

            <div className="border border-ink-200 rounded-2xl p-6 bg-white hover:border-ink-300 transition flex flex-col">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">Direct</span>
              <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">
                Newsletter Dedicated Dispatch
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed mb-4 flex-1">
                Feature your collection directly in the inboxes of our weekly subscribers with dedicated call-to-actions and brand narrative.
              </p>
              <div className="pt-4 border-t border-ink-100 flex items-center justify-between text-xs text-ink-500">
                <span>Weekly Editions</span>
                <span className="font-semibold text-ink-900">Sunday Send</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="border border-ink-200 rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto bg-white shadow-xs">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 mb-2">
              Request Media Kit &amp; Rates
            </h3>
            <p className="text-sm text-ink-500">
              Share details about your brand and campaign objectives. We will respond within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="font-serif text-2xl font-bold text-ink-900">
                Partnership Inquiry Transmitted
              </h4>
              <p className="text-sm text-ink-600 max-w-md mx-auto">
                Thank you, <strong>{formData.contact_name}</strong>. Our partnerships director will review your brief for <strong>{formData.brand_name}</strong> and email <strong>{formData.email}</strong> our rate card and availability.
              </p>
              {inquiryId && (
                <div className="font-mono text-xs text-ink-400">
                  Inquiry ID: {inquiryId}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Brand / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleChange}
                    placeholder="e.g. Maison Laurent"
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="press@brand.com"
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://brand.com"
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Campaign Format *
                  </label>
                  <select
                    name="campaign_type"
                    value={formData.campaign_type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 cursor-pointer"
                  >
                    <option value="Sponsored Editorial Story">Sponsored Editorial Story</option>
                    <option value="Display Leaderboard & Sidebar">Display Leaderboard &amp; Sidebar</option>
                    <option value="Newsletter Sponsorship">Newsletter Sponsorship</option>
                    <option value="Custom Multi-Channel Package">Custom Multi-Channel Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 cursor-pointer"
                  >
                    <option value="$500 – $1,500">$500 – $1,500</option>
                    <option value="$1,500 – $3,500">$1,500 – $3,500</option>
                    <option value="$3,500 – $7,500">$3,500 – $7,500</option>
                    <option value="$7,500+">$7,500+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1">
                  Campaign Brief &amp; Target Launch Date
                </label>
                <textarea
                  rows={4}
                  name="brief"
                  value={formData.brief}
                  onChange={handleChange}
                  placeholder="Tell us about the collection or goals of this campaign..."
                  className="w-full px-3.5 py-2.5 bg-ink-100 rounded-lg text-sm text-ink-900 focus:outline-none focus:bg-white border border-transparent focus:border-ink-300 font-serif"
                />
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-sm py-3 px-8 w-full sm:w-auto justify-center disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{submitting ? 'Transmitting...' : 'Submit Partnership Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
