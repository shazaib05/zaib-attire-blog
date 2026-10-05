import React, { useState } from 'react';
import { Sparkles, ExternalLink, ArrowRight, X } from 'lucide-react';

export default function AdBanner({ type = 'leaderboard', onOpenGuestModal }) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  // 1. Top Leaderboard Banner (728x90 style luxury editorial banner)
  if (type === 'leaderboard') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2">
        <div className="relative bg-[#121214] text-white border border-gold-500/30 overflow-hidden shadow-md group">
          {/* Ad Label */}
          <div className="absolute top-1.5 right-2 flex items-center gap-2 z-20">
            <span className="text-[8px] uppercase tracking-[0.2em] text-luxury-400 font-semibold bg-luxury-950/80 px-1.5 py-0.5 border border-luxury-800">
              ADVERTISEMENT • LUXURY PARTNER
            </span>
            <button
              onClick={() => setClosed(true)}
              className="text-luxury-400 hover:text-white p-0.5 text-xs transition"
              title="Dismiss ad"
            >
              <X size={12} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:px-8 sm:py-4 gap-4">
            {/* Sponsor details */}
            <div className="flex items-center space-x-4 min-w-0 z-10">
              <div className="w-12 h-12 bg-luxury-950 border border-gold-500/50 text-gold-400 flex items-center justify-center font-editorial font-bold text-lg shrink-0 shadow-inner">
                Z
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-luxury text-gold-400 font-bold block mb-0.5">
                  EXCLUSIVE ATELIER SHOWCASE
                </span>
                <h4 className="font-editorial text-sm sm:text-base font-bold text-white group-hover:text-gold-300 transition truncate">
                  ZAIB ATTIRE PRIVATE SUITING & COUTURE COLLECTION 2026
                </h4>
                <p className="text-[11px] text-luxury-300 font-light truncate max-w-xl">
                  Hand-tailored double-faced cashmere coats, bespoke Italian silks, and architectural silhouettes.
                </p>
              </div>
            </div>

            {/* CTA button */}
            <div className="flex items-center space-x-3 shrink-0 z-10">
              <a
                href="#atelier-collection"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Sponsorship Banner: Click-through to ZAIB ATTIRE 2026 Private Showcase');
                }}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-[10px] sm:text-xs uppercase tracking-luxury transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Explore Lookbook</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Luxury background image blend */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
              alt=""
              className="w-full h-full object-cover object-center scale-105"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. In-Feed Native Sponsored Editorial Card
  if (type === 'native-card') {
    return (
      <div className="group flex flex-col bg-[#141417] text-white border border-gold-500/50 shadow-luxury-card relative overflow-hidden">
        {/* Ad Badge */}
        <div className="relative aspect-[16/11] overflow-hidden bg-luxury-900">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
            alt="Sponsored"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 bg-gold-500 text-luxury-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Sparkles size={9} /> SPONSORED PARTNER
          </div>
          <div className="absolute top-3 right-3 bg-luxury-950/80 px-2 py-0.5 text-[8px] uppercase tracking-widest text-luxury-400">
            PAID COLLABORATION
          </div>
        </div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[9px] tracking-luxury uppercase text-gold-400 font-bold mb-1">
              HAUTE HORLOGERIE & ATELIER
            </div>
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-white group-hover:text-gold-300 transition leading-tight mb-2">
              The Architecture of Time: Audemars Piguet & The New Avant-Garde
            </h3>
            <p className="font-cormorant text-sm text-luxury-300 line-clamp-2 italic mb-4">
              "How sculptural mechanical movements are anchoring contemporary runway styling across Paris and Geneva."
            </p>
          </div>

          <div className="pt-4 border-t border-luxury-800 flex items-center justify-between mt-auto text-xs">
            <span className="text-[10px] uppercase tracking-wider text-luxury-400 font-medium">
              Sponsor: Luxury Maison
            </span>
            <span className="text-gold-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Campaign</span>
              <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Panoramic Mid-Feed Banner
  if (type === 'panoramic') {
    return (
      <div className="my-14 border border-gold-500/40 bg-gradient-to-r from-luxury-950 via-luxury-900 to-luxury-950 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-3 right-4 text-[8px] uppercase tracking-widest text-luxury-400 bg-luxury-950 px-2 py-0.5 border border-luxury-800">
          FEATURED BRAND PARTNERSHIP
        </div>

        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-gold-400 text-[10px] tracking-luxury uppercase font-bold">
            SPECIAL EDITORIAL PROMOTION
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            High Jewelry & Runway Alchemy 2026
          </h3>
          <p className="text-xs sm:text-sm text-luxury-300 font-light leading-relaxed">
            Discover how heritage jewelry houses craft sculptural titanium and unheated emerald chokers for private haute couture showings.
          </p>
          <div className="pt-2">
            <button
              onClick={() => alert('Advertisement: Discover Luxury Partner Collection')}
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition inline-flex items-center gap-2"
            >
              <span>Explore The Collection</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Right background motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 pointer-events-none hidden sm:block">
          <img
            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return null;
}
