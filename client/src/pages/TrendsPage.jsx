import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Feather, Sparkles, Compass,
  ArrowRight, BookOpen, Layers, Filter, Check, TrendingUp, PenLine
} from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import AdBanner from '../components/AdBanner';
import SEO from '../components/SEO';
import { api } from '../utils/api';

export default function TrendsPage({ categories = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlCategory = searchParams.get('category') || 'all';
  const urlType = searchParams.get('type') || 'all';
  const urlSeason = searchParams.get('season') || 'all';
  const urlSearch = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activeSeason, setActiveSeason] = useState(urlSeason);
  const [filterType, setFilterType] = useState(urlType);
  const [searchQuery, setSearchQuery] = useState(urlSearch);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with search params if URL changes externally
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
    setFilterType(searchParams.get('type') || 'all');
    setActiveSeason(searchParams.get('season') || 'all');
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Load articles
  const fetchTrends = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'all') params.category = activeCategory;
      if (activeSeason !== 'all') params.season = activeSeason;
      if (filterType !== 'all') params.type = filterType;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await api.getPosts(params);
      setPosts(res.posts || []);
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [activeCategory, activeSeason, filterType, searchQuery]);

  const updateFilters = (newCat, newSeason, newType, newQuery) => {
    const nextParams = {};
    if (newCat && newCat !== 'all') nextParams.category = newCat;
    if (newSeason && newSeason !== 'all') nextParams.season = newSeason;
    if (newType && newType !== 'all') nextParams.type = newType;
    if (newQuery && newQuery.trim()) nextParams.q = newQuery.trim();
    setSearchParams(nextParams);
  };

  const handleCategoryClick = (catName) => {
    setActiveCategory(catName);
    updateFilters(catName, activeSeason, filterType, searchQuery);
  };

  const handleSeasonChange = (seasonVal) => {
    setActiveSeason(seasonVal);
    updateFilters(activeCategory, seasonVal, filterType, searchQuery);
  };

  const handleTypeChange = (typeVal) => {
    setFilterType(typeVal);
    updateFilters(activeCategory, activeSeason, typeVal, searchQuery);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters(activeCategory, activeSeason, filterType, searchQuery);
  };

  const handleLikePost = async (id) => {
    try {
      const res = await api.likePost(id);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: res.likes } : p));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 animate-fadeIn font-sans">
      <SEO
        title="Fashion Blog & Runway Trends — Stories & Editorial Archive"
        description="Explore the curated fashion blog archive of avant-garde haute couture, street subcultures, quiet luxury narratives, and guest critiques from global creators."
        keywords="fashion blog, runway trends 2026, street style blog, haute couture, quiet luxury articles, fashion archive, guest posts"
        canonicalUrl="/blog"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Stories & Trends', item: '/blog' }
        ]}
      />

      <div className="max-w-content mx-auto px-5 sm:px-8">
        
        {/* Header — Medium Publication Style */}
        <div className="border-b border-ink-200 pb-8 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-[2px] bg-brand-accent"></span>
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Explore Stories &amp; Trends
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ink-900 tracking-tight mb-3">
            Fashion Stories &amp; Runway Archives
          </h1>
          <p className="text-base sm:text-lg text-ink-500 max-w-2xl leading-relaxed">
            Discover curated dispatches, runway analyses, garment philosophy, and independent contributor guest posts.
          </p>

          {/* Search Bar & Fast Filters */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, designers, topics..."
                className="w-full pl-10 pr-4 py-2 bg-ink-100 hover:bg-ink-150 focus:bg-white border border-transparent focus:border-ink-300 rounded-full text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none transition"
              />
            </form>

            {/* Type Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => handleTypeChange('all')}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition ${
                  filterType === 'all'
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                All Blog Posts
              </button>
              <button
                onClick={() => handleTypeChange('editorial')}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition ${
                  filterType === 'editorial'
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                Staff Picks
              </button>
              <button
                onClick={() => handleTypeChange('guest')}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition ${
                  filterType === 'guest'
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                <Feather size={12} className="text-brand-accent" />
                <span>Guest Posts</span>
              </button>
            </div>
          </div>

          {/* Horizontal Topic Pills */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto scrollbar-none pt-2">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`topic-pill shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-ink-900 text-white hover:bg-ink-800'
                  : ''
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`topic-pill shrink-0 ${
                  activeCategory === cat.name
                    ? 'bg-ink-900 text-white hover:bg-ink-800'
                    : ''
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Medium Feed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="space-y-8 py-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex gap-6 py-4 border-b border-ink-100 animate-pulse">
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-ink-200 rounded w-1/4"></div>
                      <div className="h-6 bg-ink-200 rounded w-3/4"></div>
                      <div className="h-4 bg-ink-100 rounded w-full"></div>
                      <div className="h-3 bg-ink-100 rounded w-1/3"></div>
                    </div>
                    <div className="w-28 h-20 bg-ink-200 rounded-md shrink-0"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-ink-200 rounded-2xl p-8">
                <BookOpen size={36} className="text-ink-300 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">No stories found</h3>
                <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">
                  {searchQuery ? `No articles matching "${searchQuery}".` : 'No stories found matching your filter criteria.'}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setFilterType('all');
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                  className="btn-primary text-xs py-2 px-5"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-ink-200">
                {posts.map((post) => (
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
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Free Guest Post Callout Card */}
            <div className="border border-ink-200 rounded-2xl p-6 bg-gradient-to-br from-white to-ink-100 shadow-xs">
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
                Publish your fashion analysis or brand story with a permanent dofollow backlink. 100% free — reviewed in 48 hours.
              </p>
              <Link
                to="/write"
                className="btn-gold inline-flex text-sm py-2.5 px-5 w-full justify-center"
              >
                <PenLine size={14} />
                Submit Your Article
              </Link>
            </div>

            {/* Trending posts list */}
            {posts.length > 0 && (
              <div className="border-t border-ink-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-brand-accent" />
                  <h3 className="text-sm font-bold text-ink-900">Trending Now</h3>
                </div>
                <div className="space-y-4">
                  {posts.slice(0, 4).map((post, idx) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="group cursor-pointer flex items-start gap-3"
                    >
                      <span className="text-2xl font-bold text-ink-200 leading-none shrink-0 w-6 pt-0.5 group-hover:text-brand-accent transition-colors">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-ink-500 mb-0.5 truncate">{post.author_name}</p>
                        <h4 className="text-sm font-semibold text-ink-900 group-hover:text-ink-600 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <span className="text-[11px] text-ink-400 mt-1 block">
                          {post.read_time || '5 min read'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended topics */}
            {categories.length > 0 && (
              <div className="border-t border-ink-200 pt-6">
                <h3 className="text-sm font-bold text-ink-900 mb-3">Recommended Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 10).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`topic-pill text-xs ${
                        activeCategory === cat.name ? 'bg-ink-900 text-white' : ''
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Banner placement */}
            <div className="pt-2">
              
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
