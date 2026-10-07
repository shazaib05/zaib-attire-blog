import React, { useState, useEffect } from 'react';
import {
  Megaphone, Sparkles, Award, TrendingUp, Users, Globe,
  CheckCircle2, Mail, ExternalLink, ArrowRight, ShieldCheck,
  Send, FileText, Download, DollarSign, Eye
} from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../utils/api';

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    brand_name: '',
    contact_name: '',
    email: '',
    website: '',
    campaign_type: 'Leaderboard Billboard Banner',
    budget_range: '$2,500 – $5,000',
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
    <div className="min-h-screen bg-[#fafaf8] py-10 sm:py-16 animate-fadeIn">
      <SEO
        title="Advertise With Us — Luxury Fashion Media Kit & Partnerships"
        description="Partner with ZAIB ATTIRE. High-impact luxury display banners, sponsored editorial storytelling, brand showcases, and premium audience reach."
        keywords="advertise fashion blog, luxury fashion sponsorships, brand placement, fashion media kit, zaib attire advertising"
        canonicalUrl="/advertise"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Advertise & Media Kit', item: '/advertise' }
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-bold mb-4">
            <Megaphone size={12} />
            <span>PARTNERSHIPS & MEDIA KIT 2026</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-luxury-950 mb-4">
            Advertise With ZAIB ATTIRE
          </h1>
          <p className="font-cormorant text-lg sm:text-2xl text-luxury-600 italic leading-relaxed">
            "Position your maison, atelier, fine jewelry, or luxury collection at the vanguard of runway culture and contemporary couture journalism."
          </p>
        </div>

        {/* Readership Key Statistics */}
        <div className="bg-luxury-950 text-white p-8 sm:p-12 border border-gold-500/40 mb-16 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-bold block mb-1">
              AUDIENCE DEMOGRAPHICS & ENGAGEMENT
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
              An Influential Global Fashion Audience
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-luxury-800 pt-8">
            <div>
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-gold-400 mb-1">
                240K+
              </div>
              <div className="text-[11px] uppercase tracking-wider text-luxury-300 font-medium">
                Monthly Unique Readers
              </div>
            </div>

            <div>
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-gold-400 mb-1">
                580K+
              </div>
              <div className="text-[11px] uppercase tracking-wider text-luxury-300 font-medium">
                Monthly Page Impressions
              </div>
            </div>

            <div>
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-gold-400 mb-1">
                4.2 MIN
              </div>
              <div className="text-[11px] uppercase tracking-wider text-luxury-300 font-medium">
                Avg. Article Dwell Time
              </div>
            </div>

            <div>
              <div className="font-editorial text-3xl sm:text-4xl font-bold text-gold-400 mb-1">
                $185K
              </div>
              <div className="text-[11px] uppercase tracking-wider text-luxury-300 font-medium">
                Avg. Household Income
              </div>
            </div>
          </div>

          {/* Regional distribution */}
          <div className="mt-8 pt-8 border-t border-luxury-800 flex flex-wrap items-center justify-between text-xs text-luxury-400 gap-4">
            <span className="text-[10px] uppercase tracking-luxury font-bold text-gold-400">
              TOP METROPOLITAN HUBS:
            </span>
            <span>Paris (28%)</span>
            <span>•</span>
            <span>New York (26%)</span>
            <span>•</span>
            <span>London (19%)</span>
            <span>•</span>
            <span>Milan (15%)</span>
            <span>•</span>
            <span>Tokyo & Dubai (12%)</span>
          </div>
        </div>

        {/* Premium Placement Formats */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold block mb-1">
              HIGH-IMPACT INVENTORY
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-luxury-950">
              Available Advertising Placements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Format 1 */}
            <div className="bg-white border border-luxury-200 p-6 flex flex-col justify-between shadow-xs group hover:border-gold-500 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-luxury-950 text-gold-400 text-[9px] uppercase tracking-luxury font-bold">
                    PREMIUM BILLBOARD
                  </span>
                  <span className="text-[10px] text-luxury-400 font-mono font-bold">728 × 90 / FULL</span>
                </div>
                <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-2">
                  Top Leaderboard Banner
                </h4>
                <p className="text-xs text-luxury-600 leading-relaxed font-light mb-4">
                  Situated directly below the masthead on all high-traffic landing pages. Guaranteed 100% above-the-fold visibility to every luxury fashion visitor.
                </p>
                <ul className="text-xs text-luxury-700 space-y-1.5 list-disc list-inside font-serif mb-6">
                  <li>Direct click-through to your collection or e-commerce shop</li>
                  <li>Responsive desktop and mobile auto-fit</li>
                  <li>Over 3.8% average click-through rate (CTR)</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-luxury-100 flex items-center justify-between text-xs">
                <span className="text-luxury-500 uppercase tracking-wider text-[10px]">Monthly Retainer</span>
                <span className="font-bold text-luxury-950 font-serif text-sm">From $1,800 / mo</span>
              </div>
            </div>

            {/* Format 2 */}
            <div className="bg-white border border-gold-400 p-6 flex flex-col justify-between shadow-md relative group">
              <div className="absolute -top-3 right-4 bg-gold-500 text-luxury-950 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                MOST POPULAR
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-luxury-950 text-gold-400 text-[9px] uppercase tracking-luxury font-bold">
                    NATIVE STORY
                  </span>
                  <span className="text-[10px] text-luxury-400 font-mono font-bold">IN-FEED CARD</span>
                </div>
                <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-2">
                  Sponsored Editorial Article
                </h4>
                <p className="text-xs text-luxury-600 leading-relaxed font-light mb-4">
                  An organic, beautifully composed editorial piece penned by our staff or your brand team. Seamlessly featured inside the main trend streams and search archive.
                </p>
                <ul className="text-xs text-luxury-700 space-y-1.5 list-disc list-inside font-serif mb-6">
                  <li>Permanent archival placement in category directories</li>
                  <li>Included in VIP newsletter dispatch to 45k subscribers</li>
                  <li>High-resolution lookbook gallery integration</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-luxury-100 flex items-center justify-between text-xs">
                <span className="text-luxury-500 uppercase tracking-wider text-[10px]">Single Feature</span>
                <span className="font-bold text-luxury-950 font-serif text-sm">From $2,400 / post</span>
              </div>
            </div>

            {/* Format 3 */}
            <div className="bg-white border border-luxury-200 p-6 flex flex-col justify-between shadow-xs group hover:border-gold-500 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-luxury-950 text-gold-400 text-[9px] uppercase tracking-luxury font-bold">
                    PANORAMIC SPREAD
                  </span>
                  <span className="text-[10px] text-luxury-400 font-mono font-bold">FULL BLEED</span>
                </div>
                <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-2">
                  Cinematic Mid-Feed Takeover
                </h4>
                <p className="text-xs text-luxury-600 leading-relaxed font-light mb-4">
                  Full-width luxury spread breaking up editorial columns with atmospheric photography, brand narrative, and immersive interactive styling CTA.
                </p>
                <ul className="text-xs text-luxury-700 space-y-1.5 list-disc list-inside font-serif mb-6">
                  <li>Ideal for seasonal campaign launches and perfumes</li>
                  <li>Custom dark luxury background styling</li>
                  <li>Maximum brand prestige & visual retention</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-luxury-100 flex items-center justify-between text-xs">
                <span className="text-luxury-500 uppercase tracking-wider text-[10px]">Bi-Weekly Run</span>
                <span className="font-bold text-luxury-950 font-serif text-sm">From $1,500 / 2-wks</span>
              </div>
            </div>

          </div>
        </div>

        {/* Partnership Inquiry Form */}
        <div className="bg-white border border-luxury-200 p-6 sm:p-12 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950">
                Partnership Inquiry Received
              </h3>
              <p className="text-xs text-luxury-600 leading-relaxed">
                Thank you for considering ZAIB ATTIRE for your brand's campaign. Our Partnerships Director will review your brief and send our official Media Kit & Rate Card to <strong className="text-luxury-950">{formData.email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    brand_name: '',
                    contact_name: '',
                    email: '',
                    website: '',
                    campaign_type: 'Leaderboard Billboard Banner',
                    budget_range: '$2,500 – $5,000',
                    launch_date: '',
                    brief: ''
                  });
                }}
                className="mt-4 px-6 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-luxury-200 pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-luxury font-bold text-gold-600 block mb-1">
                  DIRECT ADVERTISING DESK
                </span>
                <h3 className="font-editorial text-2xl font-bold text-luxury-950">
                  Request Media Kit & Campaign Reservation
                </h3>
                <p className="text-xs text-luxury-600 mt-1">
                  Fill in your brand specifications to receive our detailed media kit, inventory availability, and bespoke quote.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                    Brand / Maison Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleChange}
                    placeholder="e.g. Atelier Vesper"
                    className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="e.g. Élise Dupont"
                    className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.dupont@atelier.com"
                    className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                    Brand Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://ateliervesper.com"
                    className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                    Primary Placement Desired
                  </label>
                  <select
                    name="campaign_type"
                    value={formData.campaign_type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs uppercase tracking-wider focus:bg-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Leaderboard Billboard Banner">Leaderboard Billboard Banner</option>
                    <option value="Sponsored Editorial Article">Sponsored Native Editorial Article</option>
                    <option value="Cinematic Mid-Feed Takeover">Cinematic Mid-Feed Takeover</option>
                    <option value="Runway Ticker Sponsorship">Runway Ticker Sponsorship</option>
                    <option value="VIP Newsletter Dedicated Dispatch">VIP Newsletter Dedicated Dispatch</option>
                    <option value="Full Fashion Week Takeover">Full Fashion Week Takeover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs uppercase tracking-wider focus:bg-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="$1,500 – $2,500">$1,500 – $2,500</option>
                    <option value="$2,500 – $5,000">$2,500 – $5,000</option>
                    <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-luxury-800 mb-1">
                  Campaign Objective & Brief
                </label>
                <textarea
                  rows={4}
                  name="brief"
                  value={formData.brief}
                  onChange={handleChange}
                  placeholder="Tell us about your upcoming collection, launch timeline, or key target metrics..."
                  className="w-full px-3.5 py-2.5 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500 font-serif"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-luxury-500">
                  <ShieldCheck size={16} className="text-gold-600" />
                  <span>Strict confidentiality assured. Non-disclosure upon request.</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{submitting ? 'Transmitting...' : 'Request Media Kit & Quote'}</span>
                  <Send size={13} />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
