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
    <div className="fixed inset-0 z-50 bg-luxury-950/85 backdrop-blur-md flex justify-center p-4 pt-16 sm:pt-24 animate-fadeIn">
      <div className="bg-[#fafaf8] max-w-2xl w-full border border-luxury-300 shadow-2xl self-start overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-luxury-200 flex items-center space-x-3 bg-white">
          <Search size={20} className="text-gold-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search runways, trends, designers, or guest authors..."
            className="w-full text-sm sm:text-base tracking-wide bg-transparent focus:outline-none font-sans text-luxury-950"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-luxury-400 hover:text-luxury-950 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-xs uppercase tracking-wider text-luxury-500">
              Searching the Atelier archive...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="text-[10px] tracking-luxury uppercase text-luxury-500 font-bold mb-2">
                FOUND {results.length} EDITORIAL DISPATCHES
              </div>
              {results.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post.slug);
                    onClose();
                  }}
                  className="flex items-center space-x-4 p-3 hover:bg-luxury-100 transition cursor-pointer group"
                >
                  <img
                    src={post.cover_image}
                    alt=""
                    className="w-14 h-14 object-cover shrink-0 bg-luxury-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold-700 font-semibold mb-0.5">
                      <span>{post.category_name}</span>
                      {post.is_guest_post && (
                        <span className="flex items-center gap-0.5 text-luxury-600">• <Feather size={8} /> Guest</span>
                      )}
                    </div>
                    <h4 className="font-editorial text-sm font-bold text-luxury-950 group-hover:text-gold-700 transition truncate">
                      {post.title}
                    </h4>
                    <div className="text-[11px] text-luxury-500 flex items-center gap-2 mt-0.5">
                      <span>By {post.author_name}</span>
                      <span>•</span>
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-luxury-400 group-hover:text-gold-700 group-hover:translate-x-1 transition" />
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center py-10 text-xs text-luxury-500">
              No matching editorial stories found for "{query}".
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-luxury-500">
              <span className="uppercase tracking-widest font-semibold block mb-2 text-luxury-400">Popular Searches:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {['Haute Couture', 'Schiaparelli', 'Quiet Luxury', 'Tailoring', 'Street Style'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-white border border-luxury-200 text-luxury-800 text-[11px] uppercase tracking-wider hover:border-gold-500"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
