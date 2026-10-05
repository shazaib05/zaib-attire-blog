import React from 'react';
import { Clock, Eye, Heart, ArrowRight, Bookmark, Share2, Sparkles, Feather } from 'lucide-react';

export default function HeroFeatured({ post, onSelectPost, onLikePost }) {
  if (!post) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="relative bg-luxury-900 text-white rounded-none overflow-hidden shadow-2xl border border-luxury-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          
          {/* Left Column: Editorial Details & Headline */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-14 flex flex-col justify-between z-10 bg-gradient-to-t lg:bg-gradient-to-r from-luxury-950 via-luxury-950/95 to-transparent">
            <div>
              {/* Badge strip */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="px-2.5 py-1 bg-gold-500 text-luxury-950 text-[10px] font-bold tracking-luxury uppercase">
                  COVER STORY
                </span>
                <span className="text-[10px] tracking-luxury uppercase text-gold-400 font-semibold border-b border-gold-500/40 pb-0.5">
                  {post.category_name}
                </span>
                {post.season && (
                  <span className="text-[10px] tracking-luxury uppercase text-luxury-400">
                    • {post.season}
                  </span>
                )}
                {post.is_guest_post && (
                  <span className="px-2 py-0.5 bg-luxury-800 text-gold-300 text-[9px] tracking-widest uppercase border border-gold-500/30 flex items-center gap-1">
                    <Feather size={10} /> Contributor Voice
                  </span>
                )}
              </div>

              {/* Regale Headline */}
              <h2
                onClick={() => onSelectPost(post.slug)}
                className="font-editorial text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white hover:text-gold-300 transition-colors cursor-pointer leading-[1.15] mb-5"
              >
                {post.title}
              </h2>

              {/* Subtitle / Excerpt */}
              {post.subtitle && (
                <p className="font-cormorant text-lg sm:text-xl text-luxury-300 leading-relaxed font-light mb-6 max-w-2xl italic">
                  "{post.subtitle}"
                </p>
              )}
            </div>

            {/* Bottom Meta & Read Action */}
            <div className="pt-6 border-t border-luxury-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Author attribution */}
              <div className="flex items-center space-x-3.5">
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-11 h-11 rounded-full object-cover border border-gold-500/40"
                />
                <div>
                  <div className="text-xs font-semibold tracking-wider text-white uppercase flex items-center gap-1.5">
                    {post.author_name}
                    {post.is_guest_post && <span className="text-[9px] text-gold-400 font-light">(Guest Writer)</span>}
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-luxury-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.read_time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      {post.views} Views
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onSelectPost(post.slug)}
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition-all flex items-center gap-2 group shadow-lg"
                >
                  <span>Explore Article</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onLikePost(post.id)}
                  className="p-3 bg-luxury-800/80 hover:bg-luxury-800 text-luxury-300 hover:text-gold-400 border border-luxury-700 transition"
                  title="Applaud Cover Story"
                >
                  <Heart size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Monumental Cover Imagery */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden group">
            <img
              src={post.cover_image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-950 via-transparent to-transparent lg:hidden"></div>
            <div className="absolute top-4 right-4 bg-luxury-950/80 backdrop-blur-sm border border-gold-500/30 text-gold-400 px-3 py-1 text-[10px] tracking-widest uppercase">
              HIGH COUTURE ARCHIVE
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
