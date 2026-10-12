import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock, Eye, Heart, Share2, Check, MessageSquare, Feather,
  Globe, ExternalLink, ArrowLeft, BookOpen, Calendar,
  ChevronRight, Send, CheckCircle2
} from 'lucide-react';
import { api } from '../utils/api';
import ArticleCard from '../components/ArticleCard';
import SEO from '../components/SEO';

const XIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const safeStr = typeof dateStr === 'string' && dateStr.includes(' ') && !dateStr.includes('T')
      ? dateStr.replace(' ', 'T') : dateStr;
    return new Date(safeStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress((window.scrollY / total) * 100);
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
    } catch (err) { console.error(err); }
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
      const res = await api.postComment({
        post_id: post.id || post.slug,
        post_title: post.title,
        author_name: authorName.trim(),
        author_email: authorEmail.trim(),
        content: commentContent.trim()
      });
      const newComment = (res && res.id && res.author_name) ? res : {
        id: `cmt_${Date.now()}`,
        author_name: authorName.trim(),
        content: commentContent.trim(),
        created_at: new Date().toISOString()
      };
      setPost(prev => ({ ...prev, comments: [newComment, ...(prev.comments || [])] }));
      setAuthorName(''); setAuthorEmail(''); setCommentContent('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (err) { console.error(err); }
    finally { setSubmittingComment(false); }
  };

  // Inline markdown parser
  const parseInline = (text) => {
    if (!text) return text;
    const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer"
          className="text-[#1a8917] underline font-medium hover:opacity-80 transition">
          {link[1]}
        </a>
      );
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      if (bold) return <strong key={i} className="font-bold text-[#1a1a1a]">{bold[1]}</strong>;
      const italic = part.match(/^\*([^*]+)\*$/);
      if (italic) return <em key={i} className="italic">{italic[1]}</em>;
      return part;
    });
  };

  // Render article body
  const renderContent = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, idx) => {
      const t = line.trim();
      if (!t) return <div key={idx} className="h-4" />;
      if (t.startsWith('## '))
        return <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-12 mb-5">{t.slice(3)}</h2>;
      if (t.startsWith('### '))
        return <h3 key={idx} className="font-serif text-xl sm:text-2xl font-semibold text-[#1a1a1a] mt-9 mb-3">{t.slice(4)}</h3>;
      if (t.startsWith('> '))
        return (
          <blockquote key={idx} className="border-l-4 border-[#1a1a1a] pl-6 my-8 text-[#3d3d3d] text-xl italic leading-relaxed">
            {parseInline(t.slice(2))}
          </blockquote>
        );
      if (t.startsWith('- ') || t.startsWith('* '))
        return (
          <li key={idx} className="ml-6 list-disc text-[#292929] my-2 leading-relaxed text-lg">
            {parseInline(t.slice(2))}
          </li>
        );
      if (idx === 0)
        return (
          <p key={idx} className="text-[#292929] text-xl leading-[1.9] mb-6 font-medium">
            {parseInline(line)}
          </p>
        );
      return (
        <p key={idx} className="text-[#292929] text-lg leading-[1.9] mb-6">
          {parseInline(line)}
        </p>
      );
    });
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#6b6b6b]">Loading story...</p>
      </div>
    );
  }

  // ── 404 state ──
  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-32 px-4 text-center">
        <BookOpen size={40} className="text-[#bdbdbd] mb-4" />
        <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">Story not found</h2>
        <p className="text-[#6b6b6b] max-w-sm mb-6">
          This story may have been removed or the URL is incorrect.
        </p>
        <Link to="/blog" className="btn-primary">Back to Stories</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <SEO
        title={post.title}
        description={post.subtitle || (post.content ? post.content.substring(0, 155) : '')}
        image={post.cover_image}
        keywords={`${post.tags ? post.tags.join(', ') : ''}, fashion blog, ${post.category_name}`}
        article={{ title: post.title, datePublished: post.created_at, authorName: post.author_name }}
        type="article"
      />

      {/* ── Reading Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#f0f0f0] z-50">
        <div
          className="h-full bg-[#d4af37] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Sticky breadcrumb + actions bar ── */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#e0e0e0] z-30">
        <div className="max-w-[728px] mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-[#6b6b6b] overflow-hidden">
            <Link to="/" className="hover:text-[#1a1a1a] transition shrink-0">Home</Link>
            <ChevronRight size={13} className="text-[#bdbdbd] shrink-0" />
            <Link to="/blog" className="hover:text-[#1a1a1a] transition shrink-0">Stories</Link>
            {post.category_name && (
              <>
                <ChevronRight size={13} className="text-[#bdbdbd] shrink-0" />
                <span className="text-[#1a1a1a] font-medium truncate">{post.category_name}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition ${liked ? 'text-red-500' : 'text-[#6b6b6b] hover:text-red-400'}`}
              title="Like this story"
            >
              <Heart size={15} className={liked ? 'fill-red-500' : ''} />
              <span>{post.likes || 0}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition"
            >
              {copied ? <Check size={15} className="text-green-600" /> : <Share2 size={15} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Article container ── */}
      <article className="max-w-[728px] mx-auto px-5 pt-10 pb-20">

        {/* Category + Guest badge */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Link
            to={`/trends?category=${encodeURIComponent(post.category_name)}`}
            className="text-sm font-medium text-[#1a1a1a] hover:underline"
          >
            {post.category_name}
          </Link>
          {(post.is_guest || post.is_guest_post) && (
            <span className="guest-badge">
              <Feather size={9} /> Guest
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-[1.15] tracking-tight mb-5">
          {post.title}
        </h1>

        {/* Subtitle / excerpt */}
        {post.excerpt && (
          <p className="text-xl text-[#6b6b6b] leading-relaxed mb-8 font-normal">
            {post.excerpt}
          </p>
        )}

        {/* Author + meta row — Medium style */}
        <div className="flex items-center gap-3 py-4 border-y border-[#e0e0e0] mb-8">
          {post.author_avatar ? (
            <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-serif font-bold shrink-0">
              {post.author_name?.charAt(0) || 'A'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1a1a1a]">
              {post.author_name}
              {post.is_guest_post && <span className="text-xs text-[#6b6b6b] font-normal ml-1.5">(Guest Writer)</span>}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6b6b6b] mt-0.5">
              {post.created_at && <span>{formatDate(post.created_at)}</span>}
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.read_time || `${post.read_time_min || 5} min read`}
              </span>
              {post.views > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {Number(post.views).toLocaleString()} views
                  </span>
                </>
              )}
            </div>
          </div>
          {/* Share actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full text-[#6b6b6b] hover:bg-[#f7f7f7] hover:text-[#1a1a1a] transition"
              title="Share on Twitter"
            >
              <Twitter size={16} />
            </a>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-[#6b6b6b] hover:bg-[#f7f7f7] hover:text-[#1a1a1a] transition"
              title="Copy link"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
            </button>
          </div>
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="mb-10 -mx-5 sm:mx-0">
            <div className="aspect-[16/9] sm:aspect-[21/11] overflow-hidden sm:rounded-xl bg-[#f7f7f7]">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2.5 text-center text-xs text-[#9e9e9e] italic px-5 sm:px-0">
              Photo: ZAIB ATTIRE Editorial Archives
            </p>
          </div>
        )}

        {/* Article body — Medium reading style */}
        <div className="prose-reading">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="mt-10 pt-6 border-t border-[#e0e0e0] flex flex-wrap items-center gap-2">
            {(Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',') : [])).map((tag, i) => (
              <span key={i} className="topic-pill text-sm">
                {typeof tag === 'string' ? tag.trim() : tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Clap + Share actions — Medium style ── */}
        <div className="flex items-center justify-between my-10 py-6 border-y border-[#e0e0e0]">
          <button
            onClick={handleLike}
            className={`clap-btn flex items-center gap-2 px-5 py-2.5 rounded-full border transition ${
              liked
                ? 'border-red-300 text-red-500 bg-red-50'
                : 'border-[#e0e0e0] text-[#6b6b6b] hover:border-[#bdbdbd] hover:bg-[#f7f7f7]'
            }`}
          >
            <Heart size={18} className={liked ? 'fill-red-500' : ''} />
            <span className="text-sm font-medium">{post.likes || 0} {liked ? 'Thanks!' : 'Likes'}</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-sm py-2 px-4 inline-flex items-center gap-2"
            >
              <XIcon size={15} /> Share
            </a>
            <button onClick={handleShare} className="btn-ghost text-sm py-2 px-4 inline-flex items-center gap-2">
              {copied ? <Check size={15} className="text-green-600" /> : <Share2 size={15} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>

        {/* ── Author bio box — Medium style ── */}
        <div className="bg-[#f7f7f7] rounded-2xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {post.author_avatar ? (
              <img src={post.author_avatar} alt={post.author_name} className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-[#e0e0e0]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
                {post.author_name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="font-serif text-xl font-bold text-[#1a1a1a]">{post.author_name}</h4>
                {(post.is_guest || post.is_guest_post) && (
                  <span className="guest-badge"><Feather size={9} /> Guest Contributor</span>
                )}
              </div>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                {post.author_bio || 'Fashion writer and trend analyst covering international runway weeks and sartorial culture.'}
              </p>
              {post.author_website && (
                <a
                  href={post.author_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#1a8917] underline hover:opacity-80 font-medium"
                >
                  <Globe size={13} /> Visit author's website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Comments — Medium style ── */}
        <div className="border-t border-[#e0e0e0] pt-10 mb-12">
          <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <MessageSquare size={20} />
            Responses <span className="text-[#9e9e9e] font-normal text-lg ml-1">({post.comments?.length || 0})</span>
          </h3>

          {/* Comment form */}
          <form onSubmit={handleAddComment} className="border border-[#e0e0e0] rounded-2xl p-5 mb-8 bg-white shadow-sm space-y-4">
            {commentSuccess && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-lg text-sm">
                <CheckCircle2 size={16} /> Your comment has been posted!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-wider">Your Name *</label>
                <input
                  type="text" required value={authorName} onChange={e => setAuthorName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#1a1a1a] placeholder:text-[#bdbdbd] focus:outline-none focus:border-[#1a1a1a] transition bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-wider">Email (private)</label>
                <input
                  type="email" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#1a1a1a] placeholder:text-[#bdbdbd] focus:outline-none focus:border-[#1a1a1a] transition bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6b6b6b] mb-1 uppercase tracking-wider">Your Response *</label>
              <textarea
                required rows={4} value={commentContent} onChange={e => setCommentContent(e.target.value)}
                placeholder="Share your thoughts on this story..."
                className="w-full px-3 py-2.5 border border-[#e0e0e0] rounded-lg text-sm text-[#1a1a1a] placeholder:text-[#bdbdbd] focus:outline-none focus:border-[#1a1a1a] transition bg-white resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit" disabled={submittingComment}
                className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50"
              >
                {submittingComment ? 'Posting...' : 'Post Response'}
                <Send size={13} />
              </button>
            </div>
          </form>

          {/* Comment list */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-5">
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e0e0e0] text-[#6b6b6b] flex items-center justify-center font-bold text-sm shrink-0">
                    {c.author_name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[#1a1a1a]">{c.author_name}</span>
                      <span className="text-xs text-[#9e9e9e]">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-sm text-[#292929] leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9e9e9e] py-6 text-center">No responses yet. Be the first to respond!</p>
          )}
        </div>

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-[#e0e0e0] pt-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#1a1a1a]">More in {post.category_name}</h3>
              <Link
                to={`/trends?category=${encodeURIComponent(post.category_name)}`}
                className="text-sm text-[#1a1a1a] hover:underline flex items-center gap-1"
              >
                See all <ArrowLeft size={13} className="rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map(rel => (
                <ArticleCard
                  key={rel.id}
                  post={rel}
                  layout="default"
                  onSelectPost={newSlug => navigate(`/blog/${newSlug}`)}
                />
              ))}
            </div>
          </div>
        )}

      </article>
    </div>
  );
}
