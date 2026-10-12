import React from 'react';
import { Clock, Eye, Heart, ArrowRight, Feather } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return ''; }
}

export default function HeroFeatured({ post, onSelectPost, onLikePost }) {
  if (!post) return null;

  return (
    <section className="max-w-content mx-auto px-5 sm:px-8 py-10 sm:py-14" id="hero-featured">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-4 h-[2px] bg-brand-accent"></span>
        <span className="text-xs font-semibold text-ink-500 uppercase tracking-widest">
          Featured Story
        </span>
      </div>

      {/* Hero card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        
        {/* Left: Text content */}
        <div className="order-2 lg:order-1">
          {/* Category & Guest badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.category_name && (
              <span className="category-chip">{post.category_name}</span>
            )}
            {post.is_guest_post && (
              <span className="guest-badge">
                <Feather size={9} /> Guest Voice
              </span>
            )}
            {post.season && (
              <span className="text-xs text-ink-400 font-medium">{post.season}</span>
            )}
          </div>

          {/* Headline */}
          <h1
            onClick={() => onSelectPost(post.slug)}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 leading-[1.15] tracking-tight cursor-pointer hover:text-ink-600 transition-colors mb-4"
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-lg sm:text-xl text-ink-500 leading-relaxed mb-6 font-light">
              {post.subtitle}
            </p>
          )}

          {/* Author & Meta */}
          <div className="flex items-center gap-4 pt-5 border-t border-ink-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-ink-200 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-ink-900 text-white flex items-center justify-center font-serif font-bold shrink-0">
                  {post.author_name?.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-ink-900 leading-none">
                  {post.author_name}
                  {post.is_guest_post && (
                    <span className="text-xs text-ink-400 font-normal ml-1.5">(Guest Writer)</span>
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs text-ink-400 mt-1">
                  {post.published_at && <span>{formatDate(post.published_at)}</span>}
                  {post.read_time && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.read_time}
                      </span>
                    </>
                  )}
                  {post.views > 0 && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {Number(post.views).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onLikePost && onLikePost(post.id)}
                className="clap-btn p-2 rounded-full hover:bg-ink-100 text-ink-500"
                title="Like this story"
              >
                <Heart size={18} />
              </button>
              <button
                onClick={() => onSelectPost(post.slug)}
                className="btn-primary text-sm py-2.5 px-5"
                id="hero-read-btn"
              >
                <span>Read Story</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Cover image */}
        <div className="order-1 lg:order-2 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100 group">
          <img
            src={post.cover_image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </section>
  );
}
