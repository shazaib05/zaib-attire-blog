import React, { useState, useEffect } from 'react';
import {
  X, Clock, Eye, Heart, Share2, Check, MessageSquare, Feather,
  Globe, ExternalLink, ArrowLeft, Sparkles, BookOpen, User
} from 'lucide-react';
import { api } from '../utils/api';

export default function ArticleModal({ slug, onClose, onSelectPost }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Comment Form state
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getPostBySlug(slug)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Track reading progress
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight > clientHeight) {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;
    try {
      const res = await api.likePost(post.id);
      setPost(prev => ({ ...prev, likes: res.likes }));
      setLiked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await api.postComment({
        post_id: post.id,
        author_name: authorName,
        author_email: authorEmail,
        content: commentContent
      });

      setPost(prev => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])]
      }));

      setAuthorName('');
      setAuthorEmail('');
      setCommentContent('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Render markdown-like simple content into rich elements
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950 mt-10 mb-4 border-b border-luxury-200 pb-2">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-editorial text-xl sm:text-2xl font-semibold text-luxury-900 mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-6 pl-6 border-l-2 border-gold-500 italic font-cormorant text-xl text-luxury-800 bg-champagne-50/70 py-3.5 pr-4">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }

      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-luxury-800 my-1 leading-relaxed text-base sm:text-lg">
            {trimmed.replace('- ', '')}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-luxury-800 my-1 leading-relaxed text-base sm:text-lg">
            {trimmed.replace(/^\d+\.\s/, '')}
          </li>
        );
      }

      return (
        <p key={idx} className="text-luxury-850 leading-relaxed text-base sm:text-lg mb-5 font-light">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div
      onScroll={handleScroll}
      className="fixed inset-0 z-50 bg-[#fafaf8] overflow-y-auto text-luxury-950 animate-fadeIn"
    >
      {/* 1. Sticky Editorial Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#fafaf8]/95 backdrop-blur-md border-b border-luxury-200 transition-all">
        {/* Reading progress bar */}
        <div
          className="h-0.5 bg-gold-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-luxury-700 hover:text-luxury-950 transition"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Trends</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Centered Brand Tag */}
          <div className="text-center">
            <span className="text-[10px] tracking-luxury uppercase font-bold text-luxury-600">
              ZAIB ATTIRE • <span className="text-gold-600">{post?.category_name || 'EDITORIAL'}</span>
            </span>
          </div>

          {/* Right Actions: Share & Close */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-1.5 text-luxury-700 hover:text-luxury-950 hover:bg-luxury-100 rounded-full transition flex items-center gap-1.5 text-xs uppercase tracking-wider"
              title="Share article"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-luxury-700 hover:text-luxury-950 hover:bg-luxury-100 rounded-full transition"
              title="Close story"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Article Content Area */}
      {loading ? (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-editorial text-sm tracking-widest uppercase text-luxury-600">Opening Atelier Story...</p>
          </div>
        </div>
      ) : post ? (
        <article className="max-w-4xl mx-auto px-4 sm:px-8 md:px-12 py-10">
          
          {/* Category, Season & Guest Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-semibold">
              {post.category_name}
            </span>
            {post.season && (
              <span className="text-xs uppercase tracking-wider text-luxury-600 font-medium">
                {post.season}
              </span>
            )}
            {post.is_guest_post && (
              <span className="px-2.5 py-0.5 bg-gold-500 text-luxury-950 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 shadow-sm">
                <Feather size={10} /> Verified Guest Contributor
              </span>
            )}
          </div>

          {/* Monumental Headline */}
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-luxury-950 leading-[1.15] mb-5 tracking-tight">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.subtitle && (
            <p className="font-cormorant text-xl sm:text-2xl text-luxury-700 italic leading-relaxed mb-8">
              {post.subtitle}
            </p>
          )}

          {/* Article Author Attribution Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-luxury-200 mb-8">
            <div className="flex items-center space-x-3.5">
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-12 h-12 rounded-full object-cover border border-gold-500/50"
              />
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-luxury-950 flex items-center gap-2">
                  {post.author_name}
                  {post.is_guest_post && (
                    <span className="text-[9px] text-gold-700 bg-gold-100 px-1.5 py-0.5">Guest Writer</span>
                  )}
                </div>
                <div className="text-[11px] text-luxury-500 font-light mt-0.5">
                  {post.author_bio}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-luxury-500">
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {post.read_time}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {post.views} Views
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-10 overflow-hidden bg-luxury-100 border border-luxury-200 shadow-sm">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full max-h-[560px] object-cover object-center"
            />
            <div className="p-2.5 bg-luxury-100 text-[10px] tracking-widest uppercase text-luxury-500 text-center font-medium">
              HAUTE COUTURE ARCHIVE • EDITORIAL DISPATCH
            </div>
          </div>

          {/* Article Body Content (Clean Warm White Background) */}
          <div className="article-prose max-w-none text-luxury-900 leading-relaxed mb-12">
            {renderFormattedContent(post.content)}
          </div>

          {/* Thematic Tags Strip */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-6 pb-8 border-t border-luxury-200">
              <span className="text-xs uppercase tracking-luxury text-luxury-500 font-semibold mr-2">
                THEMATIC TAGS:
              </span>
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border border-luxury-300 text-xs text-luxury-800 uppercase tracking-wider hover:border-gold-500 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Applaud / Like CTA Box */}
          <div className="bg-luxury-950 text-white p-6 sm:p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gold-500/30 shadow-md">
            <div>
              <span className="text-gold-400 text-[10px] tracking-luxury uppercase font-semibold block mb-1">
                EDITORIAL APPRECIATION
              </span>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold">
                Did this perspective inspire your aesthetic?
              </h4>
              <p className="text-luxury-400 text-xs mt-1">
                Applaud to let {post.author_name} know their couture analysis resonated.
              </p>
            </div>

            <button
              onClick={handleLike}
              className={`px-6 py-3 font-bold text-xs uppercase tracking-luxury transition-all flex items-center gap-2 shrink-0 ${
                liked
                  ? 'bg-rosewood text-white'
                  : 'bg-gold-500 hover:bg-gold-400 text-luxury-950 shadow-glow-gold'
              }`}
            >
              <Heart size={16} className={liked ? 'fill-current' : ''} />
              <span>{liked ? 'Applauded' : 'Applaud Story'} ({post.likes})</span>
            </button>
          </div>

          {/* Author Showcase Profile Card */}
          <div className="bg-champagne-50 p-6 sm:p-8 border border-gold-300/40 mb-12 flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={post.author_avatar}
              alt={post.author_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold-500 shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-editorial text-lg font-bold text-luxury-950">
                  {post.author_name}
                </h4>
                {post.is_guest_post && (
                  <span className="text-[10px] bg-gold-500 text-luxury-950 px-2 py-0.5 font-bold uppercase tracking-wider">
                    Guest Contributor
                  </span>
                )}
              </div>
              <p className="text-sm text-luxury-700 leading-relaxed mb-3">
                {post.author_bio}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gold-700">
                {post.author_social && (
                  <span className="hover:underline cursor-pointer">
                    {post.author_social}
                  </span>
                )}
                {post.author_website && (
                  <a
                    href={post.author_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline text-luxury-900"
                  >
                    <Globe size={12} />
                    <span>Portfolio / Website</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Reader Comments & Critiques Section */}
          <div className="border-t border-luxury-300 pt-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-editorial text-2xl font-bold text-luxury-950 flex items-center gap-2">
                <MessageSquare size={20} className="text-gold-600" />
                <span>The Atelier Dialogue</span>
                <span className="text-sm font-sans font-normal text-luxury-500">
                  ({post.comments?.length || 0})
                </span>
              </h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="bg-white p-6 border border-luxury-200 mb-8 space-y-4">
              <h4 className="font-editorial text-base font-bold text-luxury-900">
                Join the Fashion Discussion
              </h4>
              
              {commentSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs border border-emerald-300">
                  Your critique has been shared to the article dialogue.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name (e.g. Margot Laurent)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="p-3 border border-luxury-300 text-xs tracking-wider focus:outline-none focus:border-gold-500"
                />
                <input
                  type="email"
                  placeholder="Your Email (Optional, private)"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="p-3 border border-luxury-300 text-xs tracking-wider focus:outline-none focus:border-gold-500"
                />
              </div>

              <textarea
                required
                rows={3}
                placeholder="Share your perspective on this runway critique or collection..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full p-3 border border-luxury-300 text-xs leading-relaxed tracking-wider focus:outline-none focus:border-gold-500"
              ></textarea>

              <button
                type="submit"
                disabled={submittingComment}
                className="px-6 py-2.5 bg-luxury-950 hover:bg-gold-500 text-white hover:text-luxury-950 font-bold text-xs uppercase tracking-luxury transition"
              >
                {submittingComment ? 'Submitting...' : 'Post Critique'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="p-5 bg-white border border-luxury-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-luxury-950 uppercase tracking-wider">
                        {comment.author_name}
                      </span>
                      <span className="text-[10px] text-luxury-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-luxury-800 leading-relaxed font-light">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-luxury-500 italic py-2">
                  No critiques posted yet. Be the first to share your thoughts on this editorial piece.
                </p>
              )}
            </div>
          </div>

          {/* Related Articles in Same Category */}
          {post.related && post.related.length > 0 && (
            <div className="border-t border-luxury-300 pt-8">
              <h4 className="font-editorial text-xl font-bold text-luxury-950 mb-6 uppercase tracking-wider text-xs">
                More From {post.category_name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {post.related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectPost(rel.slug)}
                    className="cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] overflow-hidden mb-3 bg-luxury-200">
                      <img
                        src={rel.cover_image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h5 className="font-editorial text-sm font-bold text-luxury-950 group-hover:text-gold-700 transition line-clamp-2">
                      {rel.title}
                    </h5>
                    <div className="text-[10px] text-luxury-500 mt-2 flex items-center justify-between">
                      <span className="uppercase">{rel.author_name}</span>
                      <span>{rel.read_time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </article>
      ) : (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
          <p className="font-editorial text-lg text-luxury-800 mb-4">Story not found.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
          >
            Return to Trends
          </button>
        </div>
      )}

      {/* 3. Bottom Close Strip */}
      <div className="border-t border-luxury-200 bg-[#f6f6f2] py-8 text-center mt-12">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-luxury-950 hover:bg-gold-500 text-white hover:text-luxury-950 font-bold text-xs uppercase tracking-luxury transition inline-flex items-center gap-2 shadow-md"
        >
          <ArrowLeft size={14} />
          <span>Back to All Trends</span>
        </button>
      </div>

    </div>
  );
}
