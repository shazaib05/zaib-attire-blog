import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenLine, ExternalLink, Trash2, CheckCircle2, User, LogOut } from 'lucide-react';
import SEO from '../components/SEO';

export default function MyArticlesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zaib_contributor_auth');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // If not logged in, redirect to /write for sign in
        navigate('/write');
        return;
      }
    } catch {}

    const loadMyArticles = () => {
      try {
        const mySaved = localStorage.getItem('zaib_my_published_articles');
        const parsed = mySaved ? JSON.parse(mySaved) : [];
        setArticles(parsed);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    loadMyArticles();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('zaib_contributor_auth');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/write');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to remove this article from your list?')) return;
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    localStorage.setItem('zaib_my_published_articles', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-white py-12 text-ink-900">
      <SEO
        title="My Articles - Dashboard | ZAIB ATTIRE"
        description="View and manage your published articles and live URLs."
        canonicalUrl="/my-articles"
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-ink-200 gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
              My Articles
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              {user ? `Logged in as ${user.username || user.name} (${user.email})` : 'Your published articles'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/write"
              className="btn-primary text-xs py-2.5 px-4 rounded-full flex items-center gap-1.5"
            >
              <PenLine size={14} />
              <span>Write New Article</span>
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className="text-xs text-ink-500 hover:text-red-600 p-2 rounded-lg transition"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-ink-400">Loading your articles...</div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-ink-200 rounded-2xl p-8">
            <PenLine size={40} className="mx-auto text-ink-300 mb-3" />
            <h3 className="font-serif text-xl font-bold text-ink-800 mb-1">No articles published yet</h3>
            <p className="text-sm text-ink-500 mb-6">You haven't published any articles yet. Write one to publish it live immediately!</p>
            <Link to="/write" className="btn-primary">
              Write New Article
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((art) => {
              const liveUrl = `https://www.zaibattire.com/blog/${art.slug}`;
              return (
                <div
                  key={art.id || art.slug}
                  className="p-5 border border-ink-200 rounded-xl hover:border-ink-900 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shadow-2xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={12} />
                        Live
                      </span>
                      <span className="text-xs text-ink-400 font-medium">{art.category_name}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-ink-900 truncate">
                      {art.title}
                    </h3>

                    {art.summary && (
                      <p className="text-xs text-ink-500 mt-1 line-clamp-1 italic">
                        "{art.summary}"
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-ink-400 mt-2 font-mono">
                      <span>{art.created_at ? new Date(art.created_at).toLocaleDateString() : 'Just now'}</span>
                      <span className="text-ink-600 font-semibold truncate max-w-xs">{liveUrl}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-ink-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-black transition"
                    >
                      <span>View Live</span>
                      <ExternalLink size={13} />
                    </a>

                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-2 text-ink-400 hover:text-red-600 rounded-lg transition"
                      title="Delete from list"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Write New Article button */}
            <div className="pt-6 text-center">
              <Link to="/write" className="btn-primary inline-flex items-center gap-2">
                <PenLine size={15} />
                <span>Write New Article</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
