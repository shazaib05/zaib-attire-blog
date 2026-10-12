import React, { useState, useEffect } from 'react';
import { Search, X, Clock, ArrowRight, Feather } from 'lucide-react';
import { api } from '../utils/api';

export default function SearchModal({ onClose, onSelectPost }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api.getPosts({ search: query.trim(), limit: 8 })
        .then(data => {
          setResults(data.posts || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center p-4 pt-16 sm:pt-24 animate-fadeIn">
      <div className="bg-white max-w-2xl w-full rounded-2xl border border-ink-200 shadow-2xl self-start overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-ink-200 flex items-center space-x-3 bg-white">
          <Search size={18} className="text-ink-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, topics, authors..."
            className="w-full text-base bg-transparent focus:outline-none font-sans text-ink-900 placeholder:text-ink-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-900 rounded-full hover:bg-ink-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-xs text-ink-400">
              Searching stories...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="text-xs text-ink-400 font-semibold mb-2">
                Found {results.length} stories
              </div>
              {results.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post.slug);
                    onClose();
                  }}
                  className="flex items-center space-x-4 p-3 hover:bg-ink-100 rounded-xl transition cursor-pointer group"
                >
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt=""
                      className="w-16 h-12 object-cover shrink-0 rounded-lg bg-ink-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-ink-500 font-medium mb-0.5">
                      <span>{post.category_name}</span>
                      {post.is_guest_post && (
                        <span className="flex items-center gap-0.5 text-brand-muted font-semibold">
                          · <Feather size={9} /> Guest
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-sm font-bold text-ink-900 group-hover:text-ink-600 transition truncate">
                      {post.title}
                    </h4>
                    <div className="text-xs text-ink-400 flex items-center gap-2 mt-0.5">
                      <span>{post.author_name}</span>
                      <span>·</span>
                      <span>{post.read_time || '5 min read'}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-ink-400 group-hover:text-ink-900 group-hover:translate-x-0.5 transition shrink-0" />
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-8 text-sm text-ink-400">
              No stories found for "{query}".
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-ink-400">
              Type keywords above to search all articles and guest dispatches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
