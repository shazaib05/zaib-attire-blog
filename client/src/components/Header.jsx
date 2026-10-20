import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Feather,
  Menu,
  X,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function Header({ categories = [], onOpenSearchModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-ink-200 transition-shadow duration-200">
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">

            {/*  Left: Logo  */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/logo.png"
                  alt="ZAIB ATTIRE"
                  className="h-[30px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="hidden font-serif text-xl font-bold tracking-tight text-ink-900">
                  ZAIB ATTIRE
                </span>
              </Link>

              {/* Desktop Nav links */}
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  to="/"
                  className={`nav-link text-sm font-medium ${isActive('/') && location.pathname === '/' ? 'text-ink-900 font-semibold' : 'text-ink-600'}`}
                >
                  Home
                </Link>

                <Link
                  to="/blog"
                  className={`nav-link text-sm font-medium ${isActive('/blog') ? 'text-ink-900 font-semibold' : 'text-ink-600'}`}
                >
                  Blog
                </Link>

                <Link
                  to="/write"
                  className={`nav-link text-sm font-medium flex items-center gap-1.5 ${
                    isActive('/write') ? 'text-brand-accent font-semibold' : 'text-ink-600 hover:text-brand-accent'
                  }`}
                >
                  <Feather size={14} className="text-brand-accent" />
                  <span>Write for Us</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-accent/10 text-brand-accent px-1.5 py-0.5 rounded-full">
                    Free
                  </span>
                </Link>

                <Link
                  to="/about"
                  className={`nav-link text-sm font-medium ${isActive('/about') ? 'text-ink-900 font-semibold' : 'text-ink-600'}`}
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  className={`nav-link text-sm font-medium ${isActive('/contact') ? 'text-ink-900 font-semibold' : 'text-ink-600'}`}
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/*  Right: Search + Action CTA  */}
            <div className="flex items-center gap-3">
              {/* Search trigger */}
              <button
                onClick={onOpenSearchModal}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-ink-500 bg-ink-100 hover:bg-ink-200 rounded-full transition-colors cursor-pointer"
                title="Search stories (Ctrl+K)"
                aria-label="Search articles"
              >
                <Search size={14} />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline text-[10px] bg-white border border-ink-300 rounded px-1.5 text-ink-400">?K</kbd>
              </button>

              {/* Guest Post Button (desktop) */}
              <Link
                to="/write"
                className="hidden sm:inline-flex btn-gold text-xs py-2 px-4 rounded-full"
                id="header-write-btn"
              >
                <Feather size={13} />
                <span>Submit Guest Post</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-ink-700 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/*  Mobile Drawer  */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-ink-200 bg-white px-5 py-4 space-y-3 animate-fadeIn">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-ink-900 hover:text-ink-600"
            >
              Home
            </Link>

            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-ink-900 hover:text-ink-600"
            >
              Blog
            </Link>

            <Link
              to="/write"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-semibold text-brand-accent hover:text-brand-muted"
            >
              <span className="flex items-center gap-2">
                <Feather size={16} />
                Write for Us (Guest Post)
              </span>
              <span className="text-xs font-bold uppercase bg-brand-accent/10 px-2 py-0.5 rounded-full">
                Free
              </span>
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-ink-900 hover:text-ink-600"
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-ink-900 hover:text-ink-600"
            >
              Contact
            </Link>

            {/* Mobile CTA */}
            <div className="pt-3 border-t border-ink-200">
              <Link
                to="/write"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-gold w-full justify-center text-sm py-3 rounded-xl"
              >
                <Feather size={15} />
                Submit a Guest Post - It's Free
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}