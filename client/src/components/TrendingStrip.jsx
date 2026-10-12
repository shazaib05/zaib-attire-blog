import React from 'react';
import { Clock, Feather, TrendingUp } from 'lucide-react';

export default function TrendingStrip({ posts = [], onSelectPost }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="border-t border-ink-200 bg-ink-100 py-10">
      <div className="max-w-content mx-auto px-5 sm:px-8">

        {/* Heading */}
        <div className="flex items-center gap-2 mb-7">
          <TrendingUp size={16} className="text-brand-accent" />
          <h2 className="text-sm font-bold text-ink-700 uppercase tracking-widest">
            Trending This Week
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.slice(0, 4).map((post, i) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="group cursor-pointer"
            >
              {/* Rank + category */}
              <div className="flex items-baseline justify-between mb-2.5">
                <span className="font-serif text-4xl font-bold text-ink-200 group-hover:text-brand-accent transition-colors leading-none">
                  0{i + 1}
                </span>
                {post.category_name && (
                  <span className="text-[10px] text-ink-400 font-medium uppercase tracking-wider">
                    {post.category_name}
                  </span>
                )}
              </div>

              {/* Thumbnail */}
              {post.cover_image && (
                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-ink-200 mb-3">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Title */}
              <h3 className="font-serif text-base font-bold text-ink-900 group-hover:text-ink-600 transition-colors line-clamp-2 leading-snug mb-2">
                {post.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-ink-400 border-t border-ink-200 pt-2 mt-2">
                <span className="font-medium text-ink-600 truncate max-w-[120px]">
                  {post.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {post.read_time || '5 min'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
