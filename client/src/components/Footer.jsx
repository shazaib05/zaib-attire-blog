import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, ArrowUpRight, Sparkles, Megaphone, Shield } from 'lucide-react';

export default function Footer({ categories = [] }) {
  return (
    <footer className="bg-luxury-950 text-luxury-300 border-t border-luxury-800 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-luxury-850">
          
          {/* Brand Manifesto & Official Logo */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="ZAIB ATTIRE"
                className="h-6 sm:h-7 w-auto object-contain brightness-0 invert opacity-100 group-hover:scale-105 transition"
              />
            </Link>
            <p className="font-cormorant text-base sm:text-lg text-luxury-400 leading-relaxed italic max-w-sm">
              "Dedicated to chronicling the highest echelon of sartorial expression, runway narratives, and emerging global fashion movements."
            </p>
            <div className="flex items-center space-x-3 pt-2 text-[10px] tracking-luxury uppercase font-medium text-gold-400">
              <span>PARIS</span>
              <span>•</span>
              <span>MILAN</span>
              <span>•</span>
              <span>LONDON</span>
              <span>•</span>
              <span>NEW YORK</span>
            </div>
          </div>

          {/* Site Navigation Pages */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[10px] tracking-luxury uppercase font-bold text-white mb-2">
              JOURNAL PAGES
            </div>
            <ul className="space-y-2 uppercase tracking-wider text-[11px]">
              <li>
                <Link to="/" className="hover:text-gold-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gold-400 transition">
                  Fashion Blog & Trends
                </Link>
              </li>
              <li>
                <Link to="/write" className="hover:text-gold-400 transition text-gold-400 flex items-center gap-1 font-semibold">
                  <Feather size={11} />
                  <span>Write a Guest Post</span>
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-gold-400 transition flex items-center gap-1">
                  <Megaphone size={11} />
                  <span>Advertise</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Trend Departments */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[10px] tracking-luxury uppercase font-bold text-white mb-2">
              TREND CATEGORIES
            </div>
            <ul className="space-y-2 uppercase tracking-wider text-[11px]">
              <li>
                <Link to="/trends" className="hover:text-gold-400 transition">
                  All Runway Stories
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/trends?category=${encodeURIComponent(c.name)}`}
                    className="hover:text-gold-400 transition text-luxury-400"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contributor Atelier Pitch */}
          <div className="md:col-span-3 space-y-4">
            <div className="text-[10px] tracking-luxury uppercase font-bold text-white mb-2">
              CONTRIBUTOR ATELIER
            </div>
            <p className="text-luxury-400 text-xs leading-relaxed">
              We welcome fashion scholars, stylists, and subculture writers to publish guest articles on ZAIB ATTIRE with dofollow author backlinks.
            </p>
            <Link
              to="/write-for-us"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-luxury-900 border border-gold-500/50 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold"
            >
              <Feather size={12} />
              <span>Submit Guest Pitch</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-luxury-500 gap-4">
          <div>
            © {new Date().getFullYear()} ZAIB ATTIRE JOURNAL. All rights reserved. Self-hosted database & guest posting backend.
          </div>

          <div className="flex items-center space-x-6 text-[10px] uppercase tracking-wider">
            <Link to="/write-for-us" className="hover:text-gold-400 transition">
              Contributor Codex
            </Link>
            <Link to="/advertise" className="hover:text-gold-400 transition">
              Media Kit 2026
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
