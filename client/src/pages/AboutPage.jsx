import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Feather, Globe, Award, Compass, ArrowRight, Quote } from 'lucide-react';
import SEO from '../components/SEO';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf8] py-10 sm:py-16 animate-fadeIn">
      <SEO
        title="About The Atelier — Fashion Manifesto & Editorial Council"
        description="Learn the history, editorial mission, and artistic manifesto behind ZAIB ATTIRE. Chronicling haute couture, luxury trends, and independent designer guest voices."
        keywords="about zaib attire, fashion manifesto, haute couture editorial, luxury fashion journalism, runway critics"
        canonicalUrl="/about"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'About The Atelier', item: '/about' }
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-bold mb-4">
            <Compass size={12} />
            <span>ESTABLISHED PARIS • MILAN • LONDON • NEW YORK</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-luxury-950 mb-6">
            The ZAIB ATTIRE Manifesto
          </h1>
          <p className="font-cormorant text-xl sm:text-2xl text-luxury-600 italic leading-relaxed">
            "We believe high fashion is not mere consumption; it is architecture for the human form, an anthropological mirror of our era, and pure sensory art."
          </p>
        </div>

        {/* Hero Magazine Image Spread */}
        <div className="relative aspect-[21/9] overflow-hidden bg-luxury-950 shadow-xl border border-luxury-300 mb-16">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=75"
            alt="ZAIB ATTIRE Runway Haute Couture Editorial"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
            <p className="text-white font-editorial text-lg sm:text-2xl font-light">
              Front Row Perspective • From Paris Haute Couture to Underground Subcultures
            </p>
          </div>
        </div>

        {/* Brand Story Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-luxury-800 font-serif leading-relaxed text-base sm:text-lg">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-luxury-950 mb-4 not-italic font-sans">
              Our Genesis
            </h3>
            <p className="mb-4">
              Founded as an intimate atelier journal, <strong className="text-luxury-950 font-sans">ZAIB ATTIRE</strong> has grown into an internationally revered digital chronicle of contemporary couture, avant-garde garment construction, and runway semiotics.
            </p>
            <p>
              In a digital landscape inundated with ephemeral micro-trends and disposable garments, ZAIB ATTIRE stands as a sanctuary of thoughtful fashion criticism, celebrating the master drapers, independent textile innovators, and visionary houses who treat style as high art.
            </p>
          </div>

          <div>
            <h3 className="font-editorial text-2xl font-bold text-luxury-950 mb-4 not-italic font-sans">
              The Contributor Ethos
            </h3>
            <p className="mb-4">
              Unlike legacy fashion houses governed by walled gardens, ZAIB ATTIRE champions a democratized guest posting ecosystem. We open our pages to emerging fashion critics, freelance stylists, and subculture historians from across the globe.
            </p>
            <p>
              Every guest article is held to our exacting editorial codex, ensuring our readers experience a rigorous blend of high couture scholarship and fresh cultural energy.
            </p>
          </div>
        </div>

        {/* Four Fashion Bureaus */}
        <div className="bg-luxury-950 text-white p-8 sm:p-12 border border-gold-500/40 mb-16 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-bold block mb-1">
              GLOBAL FOOTPRINT
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
              Our Four Editorial Capitals
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border border-luxury-800 bg-luxury-900/60">
              <span className="text-gold-400 font-editorial text-xl font-bold block mb-1">PARIS</span>
              <span className="text-[10px] uppercase tracking-wider text-luxury-400 block mb-2">Haute Couture & Heritage</span>
              <p className="text-xs text-luxury-300 font-light font-serif">18 Rue du Faubourg Saint-Honoré</p>
            </div>

            <div className="p-4 border border-luxury-800 bg-luxury-900/60">
              <span className="text-gold-400 font-editorial text-xl font-bold block mb-1">MILAN</span>
              <span className="text-[10px] uppercase tracking-wider text-luxury-400 block mb-2">Artisanal Tailoring & Leather</span>
              <p className="text-xs text-luxury-300 font-light font-serif">Via Monte Napoleone 12</p>
            </div>

            <div className="p-4 border border-luxury-800 bg-luxury-900/60">
              <span className="text-gold-400 font-editorial text-xl font-bold block mb-1">LONDON</span>
              <span className="text-[10px] uppercase tracking-wider text-luxury-400 block mb-2">Avant-Garde & Subculture</span>
              <p className="text-xs text-luxury-300 font-light font-serif">Savile Row 7, Mayfair</p>
            </div>

            <div className="p-4 border border-luxury-800 bg-luxury-900/60">
              <span className="text-gold-400 font-editorial text-xl font-bold block mb-1">NEW YORK</span>
              <span className="text-[10px] uppercase tracking-wider text-luxury-400 block mb-2">Ready-To-Wear & Energy</span>
              <p className="text-xs text-luxury-300 font-light font-serif">575 Broadway, SoHo</p>
            </div>
          </div>
        </div>

        {/* Dual CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-8 bg-white border border-luxury-200 flex flex-col justify-between">
            <div>
              <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-2">
                Join As A Contributor
              </h4>
              <p className="text-xs text-luxury-600 leading-relaxed font-light mb-6">
                Have an eye for runway design or a deep-dive essay on contemporary fashion? Pitch your guest story to our editors.
              </p>
            </div>
            <Link
              to="/write-for-us"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-bold text-gold-700 hover:text-gold-900"
            >
              <span>Explore Contributor Hub</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-8 bg-white border border-luxury-200 flex flex-col justify-between">
            <div>
              <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-2">
                Brand Collaborations
              </h4>
              <p className="text-xs text-luxury-600 leading-relaxed font-light mb-6">
                Discover our high-impact billboard positions, native sponsored articles, and private fashion week partnerships.
              </p>
            </div>
            <Link
              to="/advertise"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-bold text-gold-700 hover:text-gold-900"
            >
              <span>Explore Advertising Media Kit</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
