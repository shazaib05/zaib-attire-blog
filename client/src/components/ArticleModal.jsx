import React, { useState, useEffect } from 'react';
import {
  X, Heart, Share2, Check, Clock, Eye, Feather,
  Globe, ExternalLink, ArrowRight, MessageSquare, Send
} from 'lucide-react';
import { api } from '../utils/api';

export default function ArticleModal({ slug, onClose, onSelectPost }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getPostBySlug(slug)
      .then(data => {
        setPost(data);
        if (data?.liked || api.isPostLiked?.(data?.id)) {
          setLiked(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

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
    navigator.clipboard.writeText(window.location.origin + `/blog/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.postComment({
        post_id: post.id || post.slug,
        post_title: post.title,
        author_name: commentName.trim(),
        author_email: commentEmail.trim(),
        content: commentText.trim()
      });
      const newComment = (res && res.id) ? res : {
        id: `c_${Date.now()}`,
        author_name: commentName.trim(),
        content: commentText.trim(),
        created_at: new Date().toISOString()
      };
      setPost(prev => ({ ...prev, comments: [newComment, ...(prev.comments || [])] }));
      setCommentName('');
      setCommentEmail('');
      setCommentText('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto flex justify-center p-4 pt-10 pb-10 animate-fadeIn font-sans">
      <div className="bg-white max-w-2xl w-full rounded-2xl border border-ink-200 shadow-2xl overflow-hidden self-start flex flex-col">
        {/* Top bar */}
        <div className="p-4 border-b border-ink-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-600">
              {post?.category_name || 'Story'}
            </span>
            {(post?.is_guest || post?.is_guest_post) && (
              <span className="guest-badge text-[10px]">
                <Feather size={8} /> Guest
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-900 rounded-full hover:bg-ink-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-16 text-center text-sm text-ink-400">Loading story...</div>
        ) : post ? (
          <div className="p-6 sm:p-10 space-y-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 leading-snug">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 pb-4 border-b border-ink-200">
              <div className="w-9 h-9 rounded-full bg-ink-900 text-white font-bold flex items-center justify-center text-xs">
                {post.author_name?.charAt(0) || 'A'}
              </div>
              <div className="text-xs">
                <span className="font-bold text-ink-900 block">{post.author_name}</span>
                <span className="text-ink-400">{post.read_time || '5 min read'}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-xs text-ink-600 hover:text-red-500 transition px-2.5 py-1 rounded-full border border-ink-200"
                >
                  <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : ''} />
                  <span>{post.likes || 0}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-ink-600 hover:text-ink-900 rounded-full border border-ink-200"
                >
                  {copied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
                </button>
              </div>
            </div>

            {/* Cover */}
            {post.cover_image && (
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-ink-100">
                <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Body */}
            <div className="font-serif text-lg leading-relaxed text-ink-800 space-y-4">
              {post.content ? (
                post.content.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : <br key={i} />)
              ) : (
                <p>{post.excerpt}</p>
              )}
            </div>

            {/* Author Bio Card with Dofollow Backlink */}
            <div className="p-5 border border-ink-200 rounded-xl bg-ink-100/60 mt-8 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-900">About the Author</span>
                {(post.author_website || post.brand_website) && (
                  <a
                    href={post.author_website || post.brand_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-muted hover:underline flex items-center gap-1"
                  >
                    <span>Visit Brand</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              <p className="text-xs text-ink-600 leading-relaxed font-serif">
                {post.author_bio || `${post.author_name} is a contributing writer at ZAIB ATTIRE.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center text-sm text-ink-400">Story not found.</div>
        )}
      </div>
    </div>
  );
}
