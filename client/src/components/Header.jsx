import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  PenLine,
  Menu,
  X,
  FileText
} from 'lucide-react';

export default function Header({ onOpenSearchModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('zaib_contributor_auth');
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-ink-200 transition-shadow duration-200">
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left: Logo */}
            <div className="flex items-center gap-10 lg:gap-14">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <img
                  src="/logo.png"
                  alt="ZAIB ATTIRE"
                  className="h-[32px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="hidden font-serif text-xl font-bold tracking-tight text-ink-900">
                  ZAIB ATTIRE
                </span>
              </Link>

              {/* Desktop Navigation: Home, Blog, About, Write (and My Articles ONLY if logged in) */}
              <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
                <Link
                  to="/"
                  className={`text-sm tracking-wide transition-colors py-2 ${
                    isActive('/') && location.pathname === '/'
                      ? 'text-ink-900 font-semibold border-b-2 border-ink-900'
                      : 'text-ink-600 hover:text-ink-900 font-medium'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/blog"
                  className={`text-sm tracking-wide transition-colors py-2 ${
                    isActive('/blog')
                      ? 'text-ink-900 font-semibold border-b-2 border-ink-900'
                      : 'text-ink-600 hover:text-ink-900 font-medium'
                  }`}
                >
                  Blog
                </Link>

                <Link
                  to="/about"
                  className={`text-sm tracking-wide transition-colors py-2 ${
                    isActive('/about')
                      ? 'text-ink-900 font-semibold border-b-2 border-ink-900'
                      : 'text-ink-600 hover:text-ink-900 font-medium'
                  }`}
                >
                  About
                </Link>

                <Link
                  to="/write"
                  className={`text-sm tracking-wide transition-colors py-2 flex items-center gap-1.5 ${
                    isActive('/write')
                      ? 'text-ink-900 font-semibold border-b-2 border-ink-900'
                      : 'text-ink-600 hover:text-ink-900 font-medium'
                  }`}
                >
                  <PenLine size={15} />
                  <span>Write</span>
                </Link>

                {/* Show My Articles ONLY when logged in! */}
                {isLoggedIn && (
                  <Link
                    to="/my-articles"
                    className={`text-sm tracking-wide transition-colors py-2 flex items-center gap-1.5 ${
                      isActive('/my-articles')
                        ? 'text-ink-900 font-semibold border-b-2 border-ink-900'
                        : 'text-ink-600 hover:text-ink-900 font-medium'
                    }`}
                  >
                    <FileText size={15} />
                    <span>My Articles</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Right: Search Only */}
            <div className="flex items-center gap-4">
              <button
                onClick={onOpenSearchModal}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-ink-600 bg-ink-100 hover:bg-ink-200 rounded-full transition-colors cursor-pointer"
                title="Search stories (Ctrl+K)"
                aria-label="Search articles"
              >
                <Search size={14} />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline text-[10px] bg-white border border-ink-300 rounded px-1.5 text-ink-400">âŒ˜K</kbd>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-ink-700 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-ink-200 bg-white px-6 py-5 space-y-4 animate-fadeIn">
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
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-ink-900 hover:text-ink-600"
            >
              About
            </Link>

            <Link
              to="/write"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-base font-medium text-ink-900 hover:text-ink-600"
            >
              <PenLine size={16} />
              <span>Write</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/my-articles"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-base font-medium text-ink-900 hover:text-ink-600"
              >
                <FileText size={16} />
                <span>My Articles</span>
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
