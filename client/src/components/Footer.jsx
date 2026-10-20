import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Mail } from 'lucide-react';

const XIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer({ categories = [] }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-200 bg-white mt-16">
      {/* Main content */}
      <div className="max-w-content mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <img
                src="/logo.png"
                alt="ZAIB ATTIRE"
                className="h-[26px] w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="hidden font-serif text-lg font-bold text-ink-900">ZAIB ATTIRE</span>
            </Link>
            <p className="text-sm text-ink-500 leading-relaxed max-w-xs">
              A premier fashion editorial and guest posting platform. Explore haute couture, runway trends, and publish your writing with a dofollow backlink.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: XIcon, label: 'Twitter', href: '#' },
                { icon: InstagramIcon, label: 'Instagram', href: '#' },
                { icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
                { icon: Mail, label: 'Email', href: '/contact' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2 rounded-full bg-ink-100 hover:bg-ink-200 text-ink-600 hover:text-ink-900 transition-colors"
                  title={label}
                  aria-label={label}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-ink-900 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/blog', label: 'Blog' },
                { to: '/write', label: 'Write for Us (Free Guest Post)', highlight: true },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label, highlight }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`text-sm transition-colors ${
                      highlight
                        ? 'text-brand-accent font-semibold hover:text-brand-muted flex items-center gap-1'
                        : 'text-ink-500 hover:text-ink-900'
                    }`}
                  >
                    {highlight && <Feather size={12} />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guest post CTA */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-ink-900 uppercase tracking-widest">Free Guest Posting</h4>
            <p className="text-sm text-ink-500 leading-relaxed">
              Publish fashion articles, trend analyses, and brand stories on ZAIB ATTIRE - completely free, with a permanent dofollow backlink.
            </p>
            <Link
              to="/write"
              className="btn-gold inline-flex text-sm py-2.5 px-5 rounded-full"
              id="footer-guest-post-btn"
            >
              <Feather size={14} />
              Submit a Guest Post
            </Link>
            <p className="text-xs text-ink-400 mt-1">Fast 48-hour review Â· 100% Free</p>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-200">
        <div className="max-w-content mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-400">
          <p>Â© {currentYear} ZAIB ATTIRE Journal. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:text-ink-700 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink-700 transition-colors">Terms of Use</Link>
            <Link to="/write" className="hover:text-ink-700 transition-colors">Guest Post Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}