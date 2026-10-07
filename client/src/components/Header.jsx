import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Sparkles, Feather, Search, Menu, X, ArrowUpRight,
  Compass, BookOpen, Megaphone, Info, Mail
} from 'lucide-react';

export default function Header({ categories = [], onOpenSearchModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  const navLinkClass = ({ isActive }) =>
    `transition-all py-1.5 border-b-2 whitespace-nowrap uppercase tracking-luxury text-xs font-semibold ${
      isActive
        ? 'border-gold-600 text-luxury-950 font-bold'
        : 'border-transparent text-luxury-600 hover:text-luxury-950 hover:border-luxury-300'
    }`;

  return (
    <header className="border-b border-luxury-200 bg-[#fafaf8] sticky top-0 z-40 backdrop-blur-md bg-opacity-95 transition-all duration-300 shadow-xs">
      
      {/* 1. Top Editorial Micro-Bar (Smoothly hides on scroll) */}
      <div
        className={`border-b border-luxury-200/80 px-4 sm:px-8 text-[10px] tracking-luxury uppercase font-medium text-luxury-600 flex justify-between items-center transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0 opacity-0 border-transparent' : 'max-h-12 py-2 opacity-100'
        }`}
      >
        <div className="hidden md:flex items-center space-x-6">
          <span className="text-luxury-950 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
            PARIS • MILAN • LONDON • NEW YORK
          </span>
          <span className="text-luxury-400">|</span>
          <span>VOL. XXVI — ATELIER EDITION</span>
        </div>
        <div className="text-center w-full md:w-auto font-serif tracking-wider text-luxury-700">
          {currentDate}
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/write-for-us"
            className="text-luxury-900 hover:text-gold-600 font-semibold tracking-wider transition-colors flex items-center gap-1"
          >
            <Feather size={11} className="text-gold-600" />
            <span>CONTRIBUTOR CALL 2026</span>
          </Link>
          <span className="text-luxury-300">•</span>
          <Link
            to="/advertise"
            className="text-luxury-700 hover:text-gold-600 tracking-wider transition-colors"
          >
            MEDIA KIT
          </Link>
        </div>
      </div>

      {/* 2. Main Masthead (User's Official Logo) */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-1.5' : 'py-2 sm:py-2.5'
        }`}
      >
        {/* Left: Search Trigger & Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSearchModal}
            className="p-1.5 text-luxury-700 hover:text-luxury-950 hover:bg-luxury-100 rounded-full transition flex items-center gap-2 text-xs tracking-widest uppercase font-medium"
            title="Search Editorial Archive"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-luxury-700 hover:bg-luxury-100 rounded-full"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Center: Official ZAIB ATTIRE Logo (Set to sleek scroll size) */}
        <Link to="/" className="text-center flex flex-col items-center group select-none py-0.5">
          <img
            src="/logo.png"
            alt="ZAIB ATTIRE"
            className="h-6 sm:h-7 w-auto object-contain transition-all duration-300"
          />
          {!isScrolled && (
            <p className="text-[8px] sm:text-[9px] tracking-[0.28em] uppercase text-luxury-700 font-semibold mt-1 hidden sm:block animate-fadeIn">
              THE CHRONICLE OF CONTEMPORARY HIGH FASHION & RUNWAY CULTURE
            </p>
          )}
        </Link>

        {/* Right: Write an Article Action */}
        <div className="flex items-center space-x-3">
          <Link
            to="/write"
            className={`relative group overflow-hidden border border-gold-500 bg-luxury-950 text-gold-400 hover:text-luxury-950 text-xs tracking-wider uppercase font-semibold transition-all shadow-sm ${
              isScrolled ? 'px-3 py-1.5' : 'px-4 sm:px-5 py-2 sm:py-2.5'
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-gold-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out -z-0"></span>
            <span className="relative z-10 flex items-center gap-1.5">
              <Feather size={12} className="text-gold-400 group-hover:text-luxury-950 transition-colors" />
              <span className="hidden sm:inline">Write an Article</span>
              <span className="sm:hidden">Write</span>
              <ArrowUpRight size={12} className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </div>

      {/* 3. Primary Multi-Page Navigation Bar */}
      <nav
        className={`border-t border-luxury-200 hidden md:block bg-[#fdfdfb] transition-all duration-300 ${
          isScrolled ? 'py-1 shadow-sm' : 'py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center gap-8 overflow-x-auto scrollbar-none">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `transition-all py-1.5 border-b-2 whitespace-nowrap uppercase tracking-luxury text-xs font-semibold ${
                isActive || location.pathname === '/trends' || location.pathname === '/blogs'
                  ? 'border-gold-600 text-luxury-950 font-bold'
                  : 'border-transparent text-luxury-600 hover:text-luxury-950 hover:border-luxury-300'
              }`
            }
          >
            <span className="flex items-center gap-1">
              <BookOpen size={12} className="text-gold-600" />
              <span>Blog & Trends</span>
            </span>
          </NavLink>

          <NavLink
            to="/write"
            className={({ isActive }) =>
              `transition-all py-1.5 border-b-2 whitespace-nowrap uppercase tracking-luxury text-xs font-semibold ${
                isActive || location.pathname === '/write-for-us' || location.pathname === '/guest-post'
                  ? 'border-gold-600 text-luxury-950 font-bold'
                  : 'border-transparent text-luxury-600 hover:text-luxury-950 hover:border-luxury-300'
              }`
            }
          >
            <span className="flex items-center gap-1">
              <Feather size={12} className="text-gold-600" />
              <span>Write / Guest Post</span>
            </span>
          </NavLink>

          <NavLink to="/advertise" className={navLinkClass}>
            <span className="flex items-center gap-1">
              <Megaphone size={12} className="text-gold-600" />
              <span>Advertise With Us</span>
            </span>
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-luxury-200 bg-white px-6 py-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="space-y-2 border-b border-luxury-200 pb-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block py-2 text-xs uppercase tracking-luxury font-bold ${
                  isActive ? 'text-gold-600' : 'text-luxury-900'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `block py-2 text-xs uppercase tracking-luxury font-bold flex items-center gap-1.5 ${
                  isActive || location.pathname === '/trends' || location.pathname === '/blogs'
                    ? 'text-gold-600'
                    : 'text-luxury-900'
                }`
              }
            >
              <BookOpen size={13} className="text-gold-600" />
              <span>Fashion Blog & Trends</span>
            </NavLink>

            <NavLink
              to="/write"
              className={({ isActive }) =>
                `block py-2 text-xs uppercase tracking-luxury font-bold flex items-center gap-1.5 ${
                  isActive || location.pathname === '/write-for-us' || location.pathname === '/guest-post'
                    ? 'text-gold-600'
                    : 'text-gold-700'
                }`
              }
            >
              <Feather size={13} />
              <span>Write an Article (Free Guest Post)</span>
            </NavLink>

            <NavLink
              to="/advertise"
              className={({ isActive }) =>
                `block py-2 text-xs uppercase tracking-luxury font-bold flex items-center gap-1.5 ${
                  isActive ? 'text-gold-600' : 'text-luxury-900'
                }`
              }
            >
              <Megaphone size={13} />
              <span>Advertise & Media Kit</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `block py-2 text-xs uppercase tracking-luxury font-bold ${
                  isActive ? 'text-gold-600' : 'text-luxury-900'
                }`
              }
            >
              About The Journal
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `block py-2 text-xs uppercase tracking-luxury font-bold ${
                  isActive ? 'text-gold-600' : 'text-luxury-900'
                }`
              }
            >
              Contact Offices
            </NavLink>
          </div>

          {/* Quick Category Jump in Mobile Menu */}
          <div>
            <div className="text-[10px] uppercase tracking-luxury font-bold text-luxury-500 mb-2">
              BROWSE DEPARTMENTS
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-luxury-700">
              {categories.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  to={`/trends?category=${encodeURIComponent(c.name)}`}
                  className="py-1 hover:text-gold-600 truncate block"
                >
                  • {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/write-for-us"
              className="block w-full py-3 bg-luxury-950 text-gold-400 text-xs uppercase tracking-luxury font-bold text-center border border-gold-500/50 shadow-sm"
            >
              Submit Guest Story
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
