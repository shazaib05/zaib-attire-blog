import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Feather, ArrowRight, Quote, Compass, BookOpen,
  TrendingUp, Award, Layers, Megaphone
} from 'lucide-react';
import Ticker from '../components/Ticker';
import HeroFeatured from '../components/HeroFeatured';
import TrendingStrip from '../components/TrendingStrip';
import ArticleCard from '../components/ArticleCard';
import AdBanner from '../components/AdBanner';
import NewsletterSection from '../components/NewsletterSection';
import SEO from '../components/SEO';
import { api } from '../utils/api';

export default function HomePage({ categories = [], tickerItems = [] }) {
  const navigate = useNavigate();
  const [featuredPost, setFeaturedPost] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [curatedPosts, setCuratedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [feat, trend, postsRes] = await Promise.all([
          api.getFeaturedPost(),
          api.getTrendingPosts(),
          api.getPosts({ limit: 8 })
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
      setCuratedPosts(prev => prev.map(p => p.id === id ? { ...p, likes: res.likes } : p));
      if (featuredPost?.id === id) {
        setFeaturedPost(prev => ({ ...prev, likes: res.likes }));
      }
      setTrendingPosts(prev => prev.map(p => p.id === id ? { ...p, likes: res.likes } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SEO
        title="ZAIB ATTIRE — Haute Couture, Runway Trends & Editorial Culture"
        description="The premier fashion blog and runway trend forecast. Explore Paris, Milan, London, and New York collections, street style subcultures, and publish guest posts with brand backlinks."
        keywords="fashion blog, runway trends 2026, haute couture, quiet luxury, fashion guest post, free guest posting, paris fashion week"
        canonicalUrl="/"
      />

      {/* 1. Runway Ticker */}
      <Ticker tickerItems={tickerItems} />

      {/* 2. Top Leaderboard Billboard Advertisement */}
      <AdBanner type="leaderboard" />

      {/* 3. Hero Featured Cover Story */}
      <HeroFeatured
        post={featuredPost}
        onSelectPost={(slug) => navigate(`/blog/${slug}`)}
        onLikePost={handleLikePost}
      />

      {/* 4. Trending Strip (01-04 ranking) */}
      <TrendingStrip
        posts={trendingPosts}
        onSelectPost={(slug) => navigate(`/blog/${slug}`)}
      />

      {/* 5. Main Editorial Highlights Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full">
        
        {/* Curated Trends Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-luxury-300 mb-10">
          <div>
            <div className="text-[10px] tracking-luxury uppercase text-gold-600 font-bold mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping"></span>
              <span>CURATED RUNWAY ARCHIVE • EDITION 2026</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-luxury-950">
              The Season's Defining Fashion Trends
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-luxury-950 text-gold-400 hover:text-white hover:bg-black transition text-xs font-semibold tracking-luxury uppercase border border-gold-500/40 shadow-sm"
            >
              <span>Explore All Blogs & Trends</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Fashion Category Quick Explore Pills */}
        <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] tracking-luxury uppercase font-bold text-luxury-500 mr-2 shrink-0">
            TREND DEPARTMENTS:
          </span>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/trends?category=${encodeURIComponent(cat.name)}`}
              className="px-3.5 py-1.5 bg-white border border-luxury-200 text-luxury-800 hover:border-gold-500 hover:text-gold-600 transition text-[11px] uppercase tracking-wider font-medium shrink-0 shadow-xs"
            >
              {cat.name}
              {cat.post_count > 0 && <span className="ml-1 text-[9px] text-luxury-400">({cat.post_count})</span>}
            </Link>
          ))}
        </div>

        {/* Articles Grid with Native Ad inserted */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs tracking-luxury uppercase text-luxury-500">Arranging Runway Columns...</p>
          </div>
        ) : curatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedPosts.slice(0, 2).map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                onLikePost={handleLikePost}
              />
            ))}

            {/* Injected Native Sponsored Editorial Card */}
            <AdBanner type="native-card" />

            {/* Remaining articles */}
            {curatedPosts.slice(2, 6).map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                onLikePost={handleLikePost}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-luxury-200 p-8">
            <p className="font-editorial text-lg text-luxury-800 mb-2">No articles found in this archive.</p>
            <Link
              to="/write-for-us"
              className="inline-block mt-4 px-6 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
            >
              Submit Guest Post
            </Link>
          </div>
        )}

        {/* 6. Panoramic Mid-Magazine Luxury Brand Spread */}
        <AdBanner type="panoramic" />

        {/* 7. Magazine Editorial Quote / Atmosphere Breakout */}
        <div className="my-14 bg-champagne-50 border-y border-gold-300/60 p-8 sm:p-14 text-center relative overflow-hidden">
          <Quote size={40} className="text-gold-400/40 mx-auto mb-4" />
          <blockquote className="font-editorial text-xl sm:text-2xl md:text-3xl font-normal text-luxury-900 max-w-3xl mx-auto leading-relaxed">
            "Fashion is neither moral nor immoral, but it is done to bring up sensations."
          </blockquote>
          <cite className="font-cormorant text-base sm:text-lg text-gold-700 italic block mt-4">
            — Camille de Valois, Editor-in-Chief, ZAIB ATTIRE
          </cite>
        </div>

        {/* 8. Dual Action Columns: Guest Posting Atelier & Advertising Partnerships */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-14">
          
          {/* Guest Posting Card */}
          <div className="bg-luxury-950 text-white p-8 sm:p-10 border border-gold-500/40 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-gold-400 text-[10px] uppercase tracking-luxury font-bold bg-luxury-900 px-2.5 py-1 border border-gold-500/30">
                <Feather size={12} />
                <span>CONTRIBUTOR ATELIER</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                Write For ZAIB ATTIRE
              </h3>
              <p className="text-xs text-luxury-300 leading-relaxed font-light">
                Are you a fashion journalist, freelance stylist, or couture critic? Publish your guest essays, trend forecasts, and styling narratives on our global editorial platform with full author attribution & portfolio backlinks.
              </p>
            </div>

            <div className="pt-8 relative z-10 flex items-center justify-between">
              <span className="text-[11px] text-luxury-400 uppercase tracking-wider">
                Fast 48-Hour Review
              </span>
              <Link
                to="/write-for-us"
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition flex items-center gap-2 shadow-md"
              >
                <span>Guest Submission Hub</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Subtle luxury watermark */}
            <div className="absolute -bottom-6 -right-6 text-luxury-900/40 pointer-events-none select-none">
              <Feather size={140} />
            </div>
          </div>

          {/* Advertising & Media Kit Card */}
          <div className="bg-[#18181c] text-white p-8 sm:p-10 border border-luxury-800 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-gold-400 text-[10px] uppercase tracking-luxury font-bold bg-luxury-900 px-2.5 py-1 border border-gold-500/30">
                <Megaphone size={12} />
                <span>BRAND MONETIZATION & PARTNERSHIPS</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                Advertise With Us
              </h3>
              <p className="text-xs text-luxury-300 leading-relaxed font-light">
                Connect your maison, fragrance, luxury jewelry, or contemporary collection with over 240,000 discerning fashion enthusiasts, industry buyers, and stylists worldwide. High-impact billboards, native sponsored articles, and newsletter takeovers.
              </p>
            </div>

            <div className="pt-8 relative z-10 flex items-center justify-between">
              <span className="text-[11px] text-luxury-400 uppercase tracking-wider">
                Media Kit 2026 Available
              </span>
              <Link
                to="/advertise"
                className="px-6 py-3 bg-white hover:bg-luxury-100 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition flex items-center gap-2 shadow-md"
              >
                <span>Explore Ad Formats</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Subtle luxury watermark */}
            <div className="absolute -bottom-6 -right-6 text-luxury-900/30 pointer-events-none select-none">
              <Sparkles size={140} />
            </div>
          </div>

        </div>

      </main>

      {/* 9. VIP Atelier Newsletter */}
      <NewsletterSection />
    </div>
  );
}
