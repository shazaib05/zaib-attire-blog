import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import HomePage from './pages/HomePage';
import TrendsPage from './pages/TrendsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import GuestPostingPage from './pages/GuestPostingPage';
import AdvertisePage from './pages/AdvertisePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { api } from './utils/api';

// Helper component to scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Inner Application shell with routing context
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Load Categories & Global Settings
  useEffect(() => {
    const loadGlobals = async () => {
      try {
        const [cats, sett] = await Promise.all([
          api.getCategories(),
          api.getSettings()
        ]);
        setCategories(cats || []);
        setTickerItems(sett.tickerItems || []);
      } catch (err) {
        console.error('Failed to load global editorial data:', err);
      }
    };
    loadGlobals();
  }, []);

  // Secret shortcut (Ctrl+Shift+A or Alt+A) for discreet admin access
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (location.pathname === '/admin') {
          navigate('/');
        } else {
          navigate('/admin');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-luxury-950 font-sans">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-luxury-950 flex flex-col font-sans selection:bg-gold-500 selection:text-luxury-950">
      <ScrollToTop />

      {/* Primary Header with User's Official Logo & Navigation */}
      <Header
        categories={categories}
        onOpenSearchModal={() => setSearchModalOpen(true)}
      />

      {/* Multi-Page Route Outlet */}
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage categories={categories} tickerItems={tickerItems} />}
          />
          <Route
            path="/trends"
            element={<TrendsPage categories={categories} />}
          />
          <Route
            path="/blog/:slug"
            element={<BlogDetailPage />}
          />
          <Route
            path="/write-for-us"
            element={<GuestPostingPage categories={categories} />}
          />
          <Route
            path="/guest-posting"
            element={<GuestPostingPage categories={categories} />}
          />
          <Route
            path="/advertise"
            element={<AdvertisePage />}
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
          <Route
            path="/contact"
            element={<ContactPage />}
          />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>

      {/* Global Luxury Footer */}
      <Footer categories={categories} />

      {/* Global Editorial Archive Search Modal */}
      {searchModalOpen && (
        <SearchModal
          onClose={() => setSearchModalOpen(false)}
          onSelectPost={(slug) => navigate(`/blog/${slug}`)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
