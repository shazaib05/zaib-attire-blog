import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Heart, Feather, Bookmark } from 'lucide-react';

// Compact read time helper
function calcReadTime(post) {
  if (post.read_time) return post.read_time;
  if (post.read_time_min) return `${post.read_time_min} min read`;
  return '5 min read';
}

// Format date helper
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function ArticleCard({ post, onSelectPost, onLikePost, layout = 'default' }) {
  const navigate = useNavigate();
  if (!post) return null;

  const handleClick = () => {
    if (onSelectPost) onSelectPost(post.slug);
    else navigate(`/blog/${post.slug}`);
  };

  const isHorizontal = layout === 'horizontal' || layout === 'list';

  if (isHorizontal) {
    // ── Medium list / horizontal layout ──
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer flex items-start gap-4 sm:gap-6 py-5 border-b border-ink-200 hover:opacity-90 transition-opacity"
        id={`article-card-${post.id}`}
      >
        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Author row */}
          <div className="flex items-center gap-2 mb-2">
            {post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                {post.author_name?.charAt(0) || 'A'}
              </div>
            )}
            <span className="text-xs font-medium text-ink-700">
              {post.author_name}
            </span>
            {(post.is_guest || post.is_guest_post) && (
              <span className="guest-badge">
                <Feather size={9} /> Guest
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-ink-900 leading-snug mb-1 group-hover:text-ink-700 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Subtitle */}
          {(post.subtitle || post.excerpt) && (
            <p className="text-sm text-ink-500 leading-relaxed line-clamp-2 mb-3 hidden sm:block">
              {post.subtitle || post.excerpt}
            </p>
          )}

          {/* Footer meta */}
          <div className="flex items-center gap-3 text-xs text-ink-400">
            {post.category_name && (
              <span className="topic-pill text-[11px] py-0.5 px-2.5">
                {post.category_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {calcReadTime(post)}
            </span>
            {post.published_at && (
              <span>{formatDate(post.published_at)}</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onLikePost) onLikePost(post.id);
              }}
              className="clap-btn flex items-center gap-1 ml-auto hover:text-brand-accent"
              title="Clap"
            >
              <Heart size={13} className={post.liked ? 'fill-brand-accent text-brand-accent' : ''} />
              <span>{post.likes || 0}</span>
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {post.cover_image && (
          <div className="shrink-0 w-24 h-16 sm:w-32 sm:h-20 overflow-hidden rounded-md bg-ink-100">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}
      </article>
    );
  }

  // ── Default: Medium card layout (used in grid) ──
  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer flex flex-col article-card-hover"
      id={`article-card-${post.id}`}
    >
      {/* Cover image */}
      {post.cover_image && (
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink-100 mb-4">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
            loading="lazy"
          />
          {(post.is_guest || post.is_guest_post) && (
            <div className="absolute top-3 left-3">
              <span className="guest-badge">
                <Feather size={9} /> Guest
              </span>
            </div>
          )}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-2 mb-2.5">
        {post.author_avatar ? (
          <img
            src={post.author_avatar}
            alt={post.author_name}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px] font-bold">
            {post.author_name?.charAt(0) || 'A'}
          </div>
        )}
        <span className="text-xs font-medium text-ink-700">{post.author_name}</span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg font-bold text-ink-900 leading-snug mb-2 group-hover:text-ink-600 transition-colors line-clamp-3">
        {post.title}
      </h3>

      {/* Excerpt */}
      {(post.subtitle || post.excerpt) && (
        <p className="text-sm text-ink-500 leading-relaxed line-clamp-2 mb-3">
          {post.subtitle || post.excerpt}
        </p>
      )}

      {/* Tags */}
      {post.tags && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(Array.isArray(post.tags) ? post.tags : post.tags.split(',')).slice(0, 2).map((tag, i) => (
            <span key={i} className="topic-pill text-[11px] py-0.5 px-2.5">
              {typeof tag === 'string' ? tag.trim() : tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink-100">
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {calcReadTime(post)}
          </span>
          {post.published_at && (
            <>
              <span>·</span>
              <span>{formatDate(post.published_at)}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onLikePost) onLikePost(post.id);
            }}
            className="clap-btn flex items-center gap-1 text-ink-400 hover:text-brand-accent text-xs"
            title="Like"
          >
            <Heart size={13} className={post.liked ? 'fill-brand-accent text-brand-accent' : ''} />
            <span>{post.likes || 0}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
