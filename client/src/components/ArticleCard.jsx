import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Eye, Heart, MessageSquare, Feather, ArrowUpRight } from 'lucide-react';

export default function ArticleCard({ post, onSelectPost, onLikePost }) {
  const navigate = useNavigate();
  if (!post) return null;

  const handleClick = (e) => {
    if (onSelectPost) {
      onSelectPost(post.slug);
    } else {
      navigate(`/blog/${post.slug}`);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer flex flex-col bg-white border border-luxury-200 hover:border-gold-500/60 transition-all duration-300 hover:shadow-luxury-card relative overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/11] overflow-hidden bg-luxury-100">
        <img
          src={post.cover_image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Category & Status Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 bg-luxury-950/90 text-white text-[9px] tracking-luxury uppercase font-semibold">
            {post.category_name}
          </span>
          {(post.is_guest || post.is_guest_post) && (
            <span className="px-2 py-0.5 bg-gold-500 text-luxury-950 text-[9px] tracking-wider uppercase font-bold flex items-center gap-1 shadow-sm">
              <Feather size={9} /> Guest Voice
            </span>
          )}
        </div>

        {/* Season pill */}
        {post.season && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase tracking-wider text-luxury-800 font-medium">
            {post.season}
          </div>
        )}

        {/* Quick Read icon on hover */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-luxury-900 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md">
          <ArrowUpRight size={14} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {(Array.isArray(post.tags) ? post.tags : post.tags.split(',')).slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[10px] text-gold-700 tracking-wider uppercase font-medium">
                  #{typeof tag === 'string' ? tag.trim() : tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-luxury-950 group-hover:text-gold-700 transition-colors leading-tight mb-2.5">
            {post.title}
          </h3>

          {/* Subtitle / Excerpt */}
          {(post.subtitle || post.excerpt) && (
            <p className="font-cormorant text-sm sm:text-base text-luxury-600 line-clamp-2 leading-relaxed mb-4 italic">
              {post.subtitle || post.excerpt}
            </p>
          )}
        </div>

        {/* Card Footer: Author Attribution & Metrics */}
        <div className="pt-4 border-t border-luxury-100 flex items-center justify-between mt-auto">
          {/* Author avatar & name */}
          <div className="flex items-center space-x-2.5 min-w-0">
            {post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-7 h-7 rounded-full object-cover border border-luxury-200 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-editorial font-bold text-[10px] shrink-0">
                {post.author_name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-luxury-900 truncate">
                {post.author_name}
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-luxury-400">
                <span className="flex items-center gap-0.5">
                  <Clock size={10} />
                  {post.read_time || `${post.read_time_min || 5} min`}
                </span>
              </div>
            </div>
          </div>

          {/* Engagement counts */}
          <div className="flex items-center space-x-3 text-luxury-400 text-xs shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onLikePost) onLikePost(post.id);
              }}
              className="flex items-center gap-1 hover:text-gold-600 transition"
              title="Like story"
            >
              <Heart size={13} className="hover:fill-current" />
              <span className="text-[11px]">{post.likes || 0}</span>
            </button>
            {post.comment_count !== undefined && (
              <span className="flex items-center gap-1">
                <MessageSquare size={12} />
                <span className="text-[11px]">{post.comment_count}</span>
              </span>
            )}
          </div>
        </div>

      </div>
    </article>
  );
}
