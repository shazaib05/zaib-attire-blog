import React, { useState } from 'react';
import { Feather, ExternalLink, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdBanner({ type = 'leaderboard', placement = 'inline' }) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  // 1. Clean Top Leaderboard / In-Feed Editorial Sponsor Banner
  if (type === 'leaderboard' || placement === 'top') {
    return (
      <div className="max-w-content mx-auto px-5 sm:px-8 py-4">
        <div className="relative border border-ink-200 rounded-xl bg-ink-100/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-ink-900 text-white flex items-center justify-center font-serif font-bold text-base shrink-0">
              Z
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">
                  Sponsored Partner
                </span>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-ink-900 truncate">
                ZAIB ATTIRE 2026 Suiting &amp; Couture Lookbook
              </h4>
              <p className="text-xs text-ink-500 truncate max-w-xl">
                Double-faced cashmere coats, bespoke Italian silks, and architectural silhouettes.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/trends"
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <span>Explore Collection</span>
              <ArrowRight size={12} />
            </Link>
            <button
              onClick={() => setClosed(true)}
              className="text-ink-400 hover:text-ink-800 p-1 rounded-full hover:bg-ink-200 transition"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Sidebar Ad Card
  if (type === 'sidebar' || placement === 'sidebar') {
    return (
      <div className="border border-ink-200 rounded-xl p-5 bg-ink-100/50">
        <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold block mb-2">
          Partner Showcase
        </span>
        <div className="aspect-[16/10] rounded-lg overflow-hidden bg-ink-200 mb-3">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
            alt="Sponsor"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <h4 className="font-serif text-sm font-bold text-ink-900 mb-1 leading-snug">
          Bespoke Tailoring &amp; Fine Textiles
        </h4>
        <p className="text-xs text-ink-500 mb-3 leading-relaxed">
          Contemporary architectural silhouettes handcrafted in Milan and Paris.
        </p>
        <Link
          to="/advertise"
          className="text-xs font-semibold text-brand-muted hover:text-ink-900 transition flex items-center gap-1"
        >
          <span>Partner with ZAIB ATTIRE</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  // 3. Native Card
  return (
    <div className="border border-ink-200 rounded-xl p-5 bg-white flex flex-col justify-between">
      <div>
        <span className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider block mb-2">
          Editorial Collaboration
        </span>
        <h4 className="font-serif text-base font-bold text-ink-900 mb-2">
          The Architecture of Style
        </h4>
        <p className="text-xs text-ink-500 leading-relaxed mb-4">
          How independent couture houses and designers are shifting runway narratives in 2026.
        </p>
      </div>
      <Link
        to="/write"
        className="btn-ghost text-xs py-2 px-4 self-start"
      >
        Submit Your Story
      </Link>
    </div>
  );
}
