import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, ArrowRight, TrendingUp, Sparkles, PenLine, BookOpen } from 'lucide-react';
import HeroFeatured from '../components/HeroFeatured';
import ArticleCard from '../components/ArticleCard';
import AdBanner from '../components/AdBanner';
import NewsletterSection from '../components/NewsletterSection';
import SEO from '../components/SEO';
import { api } from '../utils/api';

// ── Side panel: Topics widget ──
function TopicsWidget({ categories }) {
  if (!categories?.length) return null;
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-ink-900 mb-3">Recommended Topics</h3>
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 10).map((cat) => (
          <Link
            key={cat.id}
            to={`/trends?category=${encodeURIComponent(cat.name)}`}
            className="topic-pill text-sm"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Side panel: Staff picks / trending sidebar ──
function SidebarPicks({ posts, onSelectPost }) {
  if (!posts?.length) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-brand-accent" />
        <h3 className="text-sm font-bold text-ink-900">Trending Now</h3>
      </div>
      <div className="space-y-5">
        {posts.slice(0, 5).map((post, i) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post.slug)}
            className="group cursor-pointer flex items-start gap-3"
          >
            <span className="text-2xl font-bold text-ink-200 leading-none shrink-0 w-7 pt-0.5">
              0{i + 1}
            </span>
            <div>
              {/* Author */}
              <div className="flex items-center gap-1.5 mb-1">
                {post.author_avatar ? (
                  <img src={post.author_avatar} alt={post.author_name} className="w-4 h-4 rounded-full" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-ink-900 text-white text-[8px] flex items-center justify-center font-bold">
                    {post.author_name?.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-medium text-ink-600">{post.author_name}</span>
              </div>
              <h4 className="text-sm font-bold text-ink-900 group-hover:text-ink-600 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h4>
              <p className="text-xs text-ink-400 mt-1">{post.read_time || '5 min read'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Guest post CTA banner ──
function GuestPostCTA() {
  return (
    <div className="border border-ink-200 rounded-2xl p-6 bg-gradient-to-br from-white to-ink-100 mb-8">
      <div className="flex items-center gap-2 mb-2">
        <Feather size={16} className="text-brand-accent" />
        <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
          Free Guest Posting
        </span>
      </div>
      <h3 className="font-serif text-xl font-bold text-ink-900 mb-2 leading-snug">
        Write for ZAIB ATTIRE
      </h3>
      <p className="text-sm text-ink-500 leading-relaxed mb-4">
        Publish your fashion articles with a dofollow backlink. 100% free — reviewed in 48 hours.
      </p>
      <Link
        to="/write"
        className="btn-gold inline-flex text-sm py-2.5 px-5 w-full justify-center"
        id="sidebar-guest-post-btn"
      >
        <PenLine size={14} />
        Submit Your Article
      </Link>
    </div>
  );
}

// ── Skeleton loader ──
function ArticleSkeleton() {
  return (
    <div className="space-y-4 py-5 border-b border-ink-200">
      <div className="flex gap-3 items-center">
        <div className="skeleton w-5 h-5 rounded-full" />
        <div className="skeleton w-28 h-3 rounded" />
      </div>
      <div className="skeleton w-full h-5 rounded" />
      <div className="skeleton w-4/5 h-5 rounded" />
      <div className="skeleton w-3/5 h-4 rounded" />
    </div>
  );
}

export default function HomePage({ categories = [], tickerItems = [] }) {
  const navigate = useNavigate();
  const [featuredPost, setFeaturedPost] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [curatedPosts, setCuratedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [feat, trend, postsRes] = await Promise.all([
          api.getFeaturedPost(),
          api.getTrendingPosts(),
          api.getPosts({ limit: 12 }),
        ]);
        setFeaturedPost(feat);
        setTrendingPosts(trend || []);
        setCuratedPosts(postsRes.posts || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleLikePost = async (id) => {
    try {
      const res = await api.likePost(id);
      setCuratedPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: res.likes } : p)));
      if (featuredPost?.id === id) setFeaturedPost((prev) => ({ ...prev, likes: res.likes }));
      setTrendingPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: res.likes } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  // Category pills for filtering
  const categoryPills = ['All', ...categories.slice(0, 6).map((c) => c.name)];
  const filteredPosts =
    activeCategory === 'All'
      ? curatedPosts
      : curatedPosts.filter((p) => p.category_name === activeCategory);

  return (
    <div className="animate-fadeIn bg-white min-h-screen">
      <SEO
        title="ZAIB ATTIRE — Fashion Stories, Runway Trends & Free Guest Posting"
        description="Discover fashion trends, haute couture analysis, and publish free guest posts with dofollow backlinks on ZAIB ATTIRE — the premier fashion editorial platform."
        keywords="fashion blog, runway trends 2026, haute couture, guest post, free guest posting, fashion editorial"
        canonicalUrl="/"
      />

      {/* ── Hero Featured Story ── */}
      <HeroFeatured
        post={featuredPost}
        onSelectPost={(slug) => navigate(`/blog/${slug}`)}
        onLikePost={handleLikePost}
      />

      {/* ── Divider ── */}
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <hr className="article-divider" />
      </div>

      {/* ── Main 2-column layout (Medium style) ── */}
      <div className="max-w-content mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

          {/* ── Left: Main feed ── */}
          <main className="flex-1 min-w-0">

            {/* Category filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-ink-200">
              {categoryPills.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-ink-900 text-white'
                      : 'text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <Link
                to="/blog"
                className="shrink-0 ml-auto text-sm text-ink-400 hover:text-ink-900 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                See all <ArrowRight size={13} />
              </Link>
            </div>

            {/* Articles feed */}
            {loading ? (
              <div>
                {[...Array(5)].map((_, i) => <ArticleSkeleton key={i} />)}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div>
                {/* Top 3 as list */}
                {filteredPosts.slice(0, 3).map((post) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    layout="horizontal"
                    onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                    onLikePost={handleLikePost}
                  />
                ))}

                {/* Top ad insertion */}
                <div className="py-4">
                  <AdBanner type="leaderboard" />
                </div>

                {/* Next articles as grid */}
                {filteredPosts.length > 3 && (
                  <div>
                    <h2 className="font-serif text-xl font-bold text-ink-900 mb-5 mt-2">
                      More Stories
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {filteredPosts.slice(3, 9).map((post) => (
                        <ArticleCard
                          key={post.id}
                          post={post}
                          layout="default"
                          onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                          onLikePost={handleLikePost}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Remaining list */}
                {filteredPosts.length > 9 && (
                  <div className="mt-8 border-t border-ink-200 pt-6">
                    <h2 className="font-serif text-xl font-bold text-ink-900 mb-3">
                      Latest Posts
                    </h2>
                    {filteredPosts.slice(9).map((post) => (
                      <ArticleCard
                        key={post.id}
                        post={post}
                        layout="horizontal"
                        onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                        onLikePost={handleLikePost}
                      />
                    ))}
                  </div>
                )}

                {/* Load more */}
                <div className="mt-10 text-center">
                  <Link
                    to="/blog"
                    className="btn-ghost text-sm inline-flex py-3 px-8"
                  >
                    <BookOpen size={15} />
                    <span>Browse All Stories</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center">
                <Sparkles size={32} className="mx-auto text-ink-300 mb-4" />
                <p className="font-serif text-xl text-ink-700 mb-2">No articles yet in this topic.</p>
                <p className="text-sm text-ink-400 mb-6">
                  Be the first to contribute — submit a guest post!
                </p>
                <Link to="/write" className="btn-gold inline-flex">
                  <Feather size={14} />
                  Submit Guest Post
                </Link>
              </div>
            )}
          </main>

          {/* ── Right: Sidebar ── */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
            {/* Guest post CTA */}
            <GuestPostCTA />

            {/* Topics */}
            <TopicsWidget categories={categories} />

            <div className="border-t border-ink-200 pt-6">
              {/* Trending sidebar */}
              <SidebarPicks
                posts={trendingPosts}
                onSelectPost={(slug) => navigate(`/blog/${slug}`)}
              />
            </div>

            {/* Sidebar ad */}
            <div className="mt-4">
              <AdBanner type="sidebar" />
            </div>
          </aside>
        </div>
      </div>

      {/* ── Full-width editorial quote ── */}
      <div className="bg-ink-100 border-y border-ink-200 py-14 my-10">
        <div className="max-w-reading mx-auto px-5 text-center">
          <blockquote className="font-serif text-2xl sm:text-3xl text-ink-800 font-medium leading-relaxed mb-4">
            "Fashion is the armor to survive the reality of everyday life."
          </blockquote>
          <cite className="text-sm text-ink-400 not-italic">
            — ZAIB ATTIRE Editorial
          </cite>
        </div>
      </div>

      {/* ── Newsletter ── */}
      <NewsletterSection />
    </div>
  );
}
