import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock, Eye, Heart, Share2, Check, MessageSquare, Feather,
  Globe, ExternalLink, ArrowLeft, Sparkles, BookOpen, User,
  Calendar, ChevronRight, Send, CheckCircle2
} from 'lucide-react';
import { api } from '../utils/api';
import ArticleCard from '../components/ArticleCard';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Comment state
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const loadArticle = async () => {
      try {
        const data = await api.getPostBySlug(slug);
        setPost(data);

        // Fetch related posts from same category
        if (data?.category_name) {
          const relatedRes = await api.getPosts({ category: data.category_name, limit: 3 });
          setRelatedPosts((relatedRes.posts || []).filter(p => p.slug !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-5" />;

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950 mt-12 mb-5 border-b border-luxury-200 pb-3">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-editorial text-xl sm:text-2xl font-semibold text-luxury-900 mt-9 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-gold-500 pl-6 my-8 italic font-cormorant text-xl sm:text-2xl text-luxury-800 bg-champagne-50/50 py-4 pr-4">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-6 list-disc text-luxury-700 my-2 leading-relaxed font-serif text-base sm:text-lg">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }

      // First paragraph lead styling
      if (idx === 0) {
        return (
          <p key={idx} className="font-serif text-lg sm:text-xl text-luxury-900 leading-relaxed font-normal mb-6 first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:text-gold-700 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
            {line}
          </p>
        );
      }

      return (
        <p key={idx} className="font-serif text-base sm:text-lg text-luxury-800 leading-relaxed font-normal mb-5">
          {line}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-luxury text-luxury-500">Retrieving Haute Couture Dispatch...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center py-32 px-4 text-center">
        <BookOpen size={48} className="text-luxury-400 mb-4" />
        <h2 className="font-editorial text-3xl font-bold text-luxury-950 mb-2">Dispatch Not Found</h2>
        <p className="text-xs text-luxury-600 max-w-md mb-6">
          The requested fashion trend story could not be located in our archive. It may have been relocated or archived.
        </p>
        <Link
          to="/trends"
          className="px-6 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
        >
          Return to Trend Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-luxury-950 relative selection:bg-gold-500 selection:text-luxury-950">
      
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-luxury-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-luxury-200 bg-white/70 backdrop-blur-sm sticky top-0 z-30 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between text-[11px] uppercase tracking-wider text-luxury-600">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/" className="hover:text-gold-600 transition">Home</Link>
            <ChevronRight size={12} className="text-luxury-400 shrink-0" />
            <Link to="/trends" className="hover:text-gold-600 transition">Trends</Link>
            <ChevronRight size={12} className="text-luxury-400 shrink-0" />
            <Link to={`/trends?category=${encodeURIComponent(post.category_name)}`} className="text-gold-700 font-semibold hover:underline shrink-0">
              {post.category_name}
            </Link>
          </div>

          <div className="flex items-center gap-4 shrink-0 ml-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition ${liked ? 'text-red-500 font-bold' : 'text-luxury-600 hover:text-red-500'}`}
              title="Applaud this story"
            >
              <Heart size={14} className={liked ? 'fill-red-500' : ''} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={handleShare}
              className="text-luxury-600 hover:text-gold-600 transition flex items-center gap-1"
              title="Share story link"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Core Content Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        
        {/* Header Metadata & Category Tag */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-luxury-950 text-gold-400 text-[10px] tracking-luxury uppercase font-bold">
              {post.category_name}
            </span>
            {(post.is_guest || post.is_guest_post) ? (
              <span className="px-3 py-1 bg-champagne-100 text-gold-800 border border-gold-300 text-[10px] tracking-luxury uppercase font-bold flex items-center gap-1">
                <Feather size={10} />
                <span>Guest Contributor</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-luxury-100 text-luxury-700 text-[10px] tracking-luxury uppercase font-semibold">
                Staff Atelier
              </span>
            )}
            {post.season && (
              <span className="text-[10px] uppercase tracking-wider text-luxury-500 font-medium">
                • {post.season}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-luxury-950 leading-[1.1] mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-cormorant text-lg sm:text-2xl text-luxury-600 italic max-w-2xl mx-auto leading-relaxed mb-8">
              "{post.excerpt}"
            </p>
          )}

          {/* Author Byline Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-y border-luxury-200 text-xs text-luxury-600 uppercase tracking-wider">
            <div className="flex items-center gap-2.5">
              {post.author_avatar ? (
                <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full object-cover border border-gold-400" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-editorial font-bold text-xs">
                  {post.author_name?.charAt(0) || 'A'}
                </div>
              )}
              <span className="font-bold text-luxury-950 tracking-normal text-sm font-sans">
                By {post.author_name}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-luxury-400" />
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-luxury-400" />
              <span>{post.read_time_min || 5} Min Read</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Eye size={13} className="text-luxury-400" />
              <span>{post.views} Views</span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {post.cover_image && (
          <div className="mb-12">
            <div className="relative aspect-[16/10] sm:aspect-[21/11] overflow-hidden bg-luxury-950 shadow-xl border border-luxury-300">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2.5 text-center text-[10px] uppercase tracking-wider text-luxury-500 font-serif italic">
              Photographed for ZAIB ATTIRE Editorial Runway Archives • All Rights Reserved
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="max-w-2xl mx-auto mb-16">
          {renderFormattedContent(post.content)}
        </div>

        {/* In-Article Luxury Sponsor Placement */}
        <div className="max-w-2xl mx-auto my-12 bg-[#121215] text-white p-6 sm:p-8 border border-gold-500/40 relative overflow-hidden">
          <div className="text-[8px] uppercase tracking-[0.25em] text-gold-400 font-bold mb-2">
            EDITORIAL SPONSORSHIP • LUXURY MAISON
          </div>
          <h4 className="font-editorial text-lg sm:text-xl font-bold mb-2 text-white">
            ZAIB ATTIRE Privé: The Bespoke Eveningwear Capsule
          </h4>
          <p className="text-xs text-luxury-300 font-light leading-relaxed mb-4">
            Hand-constructed silk crêpe-de-chine and sculpted midnight wool. Hand-numbered editions available for private appointments.
          </p>
          <Link
            to="/advertise"
            className="inline-flex items-center gap-2 text-gold-400 hover:text-white font-bold text-xs uppercase tracking-luxury"
          >
            <span>Partner With ZAIB ATTIRE</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="max-w-2xl mx-auto pt-6 border-t border-luxury-200 mb-10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-luxury font-bold text-luxury-500 mr-2">
              TOPICS:
            </span>
            {(Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',') : [])).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-luxury-100 text-luxury-800 text-[11px] uppercase tracking-wider font-medium"
              >
                #{typeof tag === 'string' ? tag.trim() : tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="max-w-2xl mx-auto bg-champagne-50/60 border border-gold-300/60 p-6 sm:p-8 mb-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {post.author_avatar ? (
              <img src={post.author_avatar} alt={post.author_name} className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-luxury-950 text-gold-400 flex items-center justify-center font-editorial font-bold text-xl shrink-0">
                {post.author_name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="font-editorial text-lg sm:text-xl font-bold text-luxury-950">
                  {post.author_name}
                </h4>
                {(post.is_guest || post.is_guest_post) && (
                  <span className="px-2 py-0.5 bg-gold-500 text-luxury-950 text-[9px] font-bold uppercase tracking-wider">
                    Guest Contributor
                  </span>
                )}
              </div>
              <p className="font-serif text-sm text-luxury-700 leading-relaxed italic">
                {post.author_bio || "Fashion theorist, style documentarian, and regular essayist covering international fashion weeks and sartorial transformations."}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs">
                {post.author_website && (
                  <a
                    href={post.author_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-700 hover:text-gold-900 font-semibold flex items-center gap-1 underline"
                  >
                    <Globe size={12} />
                    <span>Author Portfolio</span>
                  </a>
                )}
                {post.author_social && (
                  <span className="text-luxury-500 font-medium">
                    @{post.author_social.replace('@', '')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reader Comments Section */}
        <div className="max-w-2xl mx-auto border-t border-luxury-300 pt-12 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-editorial text-2xl font-bold text-luxury-950 flex items-center gap-2">
              <MessageSquare size={20} className="text-gold-600" />
              <span>Editorial Dialogue & Reflections</span>
            </h3>
            <span className="text-xs uppercase tracking-wider text-luxury-500 font-bold">
              {post.comments?.length || 0} Comments
            </span>
          </div>

          {/* Comment Submission Form */}
          <form onSubmit={handleAddComment} className="bg-white border border-luxury-200 p-6 shadow-sm mb-10 space-y-4">
            <h4 className="text-xs uppercase tracking-luxury font-bold text-luxury-800">
              Contribute to the Critical Dialogue
            </h4>

            {commentSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Your reflection has been recorded and published in the dialogue.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-600 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Laurent Moret"
                  className="w-full px-3 py-2 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-600 mb-1">
                  Email (Kept Confidential)
                </label>
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="laurent@atelier.fr"
                  className="w-full px-3 py-2 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-luxury-600 mb-1">
                Your Reflection *
              </label>
              <textarea
                required
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your perspective on this runway presentation or design philosophy..."
                className="w-full px-3 py-2 bg-luxury-50 border border-luxury-300 text-xs focus:bg-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="px-6 py-2.5 bg-luxury-950 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition text-xs uppercase tracking-luxury font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <span>{submittingComment ? 'Transmitting...' : 'Post Reflection'}</span>
                <Send size={12} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white border border-luxury-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-luxury-950">{comment.author_name}</span>
                    <span className="text-[10px] text-luxury-400 uppercase tracking-wider">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-serif text-sm text-luxury-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-luxury-500 text-xs">
              No reader reflections yet. Be the first to share your thoughts on this story.
            </div>
          )}
        </div>

        {/* Related Trend Stories Section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-luxury-300 pt-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-gold-600 font-bold block mb-1">
                  CONTINUE READING
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-luxury-950">
                  More From {post.category_name}
                </h3>
              </div>
              <Link
                to={`/trends?category=${encodeURIComponent(post.category_name)}`}
                className="text-xs uppercase tracking-luxury font-bold text-gold-700 hover:underline flex items-center gap-1"
              >
                <span>View Department</span>
                <ArrowLeft size={12} className="rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <ArticleCard
                  key={rel.id}
                  post={rel}
                  onSelectPost={(newSlug) => navigate(`/blog/${newSlug}`)}
                />
              ))}
            </div>
          </div>
        )}

      </article>

    </div>
  );
}
