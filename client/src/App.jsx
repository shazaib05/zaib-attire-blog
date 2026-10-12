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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Caught error in React tree:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white">
          <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">Unable to display this story</h2>
          <p className="text-sm text-ink-500 mb-6 max-w-md">An unexpected formatting issue occurred. You can return to the home feed or refresh.</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary">
            Return to Homepage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
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
    <div className="min-h-screen bg-white text-ink-900 flex flex-col font-sans selection:bg-ink-200 selection:text-ink-900">
      <ScrollToTop />

      {/* Primary Header with User's Official Logo & Navigation */}
      <Header
        categories={categories}
        onOpenSearchModal={() => setSearchModalOpen(true)}
      />

      {/* Multi-Page Route Outlet */}
      <div className="flex-1">
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={<HomePage categories={categories} tickerItems={tickerItems} />}
            />
            <Route
              path="/blog"
              element={<TrendsPage categories={categories} />}
            />
            <Route
              path="/blogs"
              element={<TrendsPage categories={categories} />}
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
              path="/write"
              element={<GuestPostingPage categories={categories} />}
            />
            <Route
              path="/write-for-us"
              element={<GuestPostingPage categories={categories} />}
            />
            <Route
              path="/guest-post"
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
              path="/privacy"
              element={<PrivacyPolicyPage />}
            />
            <Route
              path="/terms"
              element={<TermsPage />}
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </ErrorBoundary>
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
