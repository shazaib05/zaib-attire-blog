import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Feather, Search, Menu, X, Bell, ChevronDown, PenLine } from 'lucide-react';

export default function Header({ categories = [], onOpenSearchModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname]);

  const navLinkBase =
    'text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors duration-150 py-1';
  const navLinkActive = 'text-ink-900 font-semibold';

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white border-b border-ink-200 transition-all duration-200 ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        {/* ── Main navigation bar ── */}
        <div className="max-w-content mx-auto px-5 sm:px-8 h-[57px] flex items-center justify-between gap-4">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex flex-col items-start group select-none">
              <img
                src="/logo.png"
                alt="ZAIB ATTIRE"
                className="h-[26px] w-auto object-contain transition-opacity group-hover:opacity-80"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-serif text-xl font-bold text-ink-900 tracking-tight">
                ZAIB ATTIRE
              </span>
            </Link>
          </div>

          {/* Center: Horizontal nav — desktop only */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${navLinkBase} px-3 rounded-full hover:bg-ink-100 ${isActive ? navLinkActive : ''}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `${navLinkBase} px-3 rounded-full hover:bg-ink-100 ${
                  isActive || location.pathname.startsWith('/trends')
                    ? navLinkActive
                    : ''
                }`
              }
            >
              Stories
            </NavLink>

            {/* Topics dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`${navLinkBase} px-3 rounded-full hover:bg-ink-100 flex items-center gap-1`}
              >
                Topics
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-ink-200 rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                  <Link
                    to="/blog"
                    className="block px-4 py-2 text-sm text-ink-700 hover:bg-ink-100 hover:text-ink-900 transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    All Topics
                  </Link>
                  <div className="border-t border-ink-200 my-1" />
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/trends?category=${encodeURIComponent(cat.name)}`}
                      className="block px-4 py-2 text-sm text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition-colors truncate"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/advertise"
              className={({ isActive }) =>
                `${navLinkBase} px-3 rounded-full hover:bg-ink-100 ${isActive ? navLinkActive : ''}`
              }
            >
              Advertise
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${navLinkBase} px-3 rounded-full hover:bg-ink-100 ${isActive ? navLinkActive : ''}`
              }
            >
              About
            </NavLink>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            <button
              onClick={onOpenSearchModal}
              className="p-2 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-full transition-colors"
              title="Search"
              id="header-search-btn"
            >
              <Search size={18} />
            </button>

            {/* Write for us — desktop */}
            <Link
              to="/write"
              className="hidden sm:inline-flex items-center gap-1.5 btn-ghost text-sm py-2 px-4"
              id="header-write-btn"
            >
              <PenLine size={15} />
              <span>Write</span>
            </Link>

            {/* CTA: Guest Post — desktop */}
            <Link
              to="/write"
              className="hidden sm:inline-flex btn-primary text-sm py-2 px-5"
              id="header-guest-post-btn"
            >
              <Feather size={14} />
              <span>Guest Post</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink-600 hover:bg-ink-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-ink-200 px-5 py-4 space-y-1 shadow-lg animate-fadeIn">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/blog', label: 'Stories' },
              { to: '/write', label: 'Write / Guest Post', highlight: true },
              { to: '/advertise', label: 'Advertise' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label, end, highlight }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-ink-100 text-ink-900 font-semibold'
                      : highlight
                      ? 'text-brand-accent font-semibold'
                      : 'text-ink-700 hover:bg-ink-100 hover:text-ink-900'
                  }`
                }
              >
                {highlight && <Feather size={13} className="inline mr-1.5" />}
                {label}
              </NavLink>
            ))}

            {/* Categories section */}
            {categories.length > 0 && (
              <div className="pt-3 border-t border-ink-200">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider px-3 mb-2">
                  Topics
                </p>
                <div className="flex flex-wrap gap-2 px-3">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/trends?category=${encodeURIComponent(cat.name)}`}
                      className="topic-pill text-xs"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile CTA */}
            <div className="pt-3 border-t border-ink-200">
              <Link to="/write" className="btn-gold w-full justify-center text-sm py-3 rounded-xl">
                <Feather size={15} />
                Submit a Guest Post — It's Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Close dropdown when clicking outside */}
      {categoriesOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCategoriesOpen(false)}
        />
      )}
    </>
  );
}
