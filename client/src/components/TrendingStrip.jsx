import React from 'react';
import { TrendingUp, Clock, Feather } from 'lucide-react';

export default function TrendingStrip({ posts = [], onSelectPost }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="border-y border-luxury-200 bg-[#f6f6f2] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-luxury-300">
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-luxury-950">
            <TrendingUp size={16} className="text-gold-600" />
            <span>MOST READ IN THE ATELIER THIS WEEK</span>
          </div>
          <span className="text-[10px] tracking-widest text-luxury-500 uppercase font-semibold">
            EDITORIAL RANKING
          </span>
        </div>

        {/* Responsive Grid with Editorial Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {posts.slice(0, 4).map((post, index) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Ranking Number & Category */}
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-editorial text-3xl sm:text-4xl font-bold text-gold-600/40 group-hover:text-gold-600 transition-colors">
                    0{index + 1}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-500 group-hover:text-luxury-900 transition-colors">
                    {post.category_name}
                  </span>
                </div>

                {/* Article Image Preview */}
                <div className="aspect-[16/10] overflow-hidden mb-3 relative bg-luxury-200">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.is_guest_post && (
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-luxury-950/90 text-gold-400 text-[8px] uppercase tracking-wider flex items-center gap-1">
                      <Feather size={9} /> Guest Post
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-editorial text-base sm:text-lg font-bold text-luxury-950 group-hover:text-gold-700 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h4>
              </div>

              {/* Author & Read time */}
              <div className="flex items-center justify-between text-[11px] text-luxury-500 pt-3 border-t border-luxury-200 mt-3">
                <span className="font-medium text-luxury-800 truncate max-w-[140px] uppercase tracking-wider text-[10px]">
                  {post.author_name}
                </span>
                <span className="flex items-center gap-1 text-[10px]">
                  <Clock size={10} />
                  {post.read_time}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
