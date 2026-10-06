import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Feather, Sparkles, Compass,
  ArrowRight, BookOpen, Layers, Filter, Check
} from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import AdBanner from '../components/AdBanner';
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
    <div className="min-h-screen bg-[#fafaf8] py-8 sm:py-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Page Hero Header */}
        <div className="border-b border-luxury-300 pb-8 mb-8">
          <div className="flex items-center gap-2 text-[10px] tracking-luxury uppercase font-bold text-gold-600 mb-2">
            <Compass size={13} />
            <span>THE EDITORIAL REPERTORY • FASHION BLOG & TREND ARCHIVES</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-luxury-950 mb-3">
            Fashion Blog & Runway Trends
          </h1>
          <p className="font-cormorant text-base sm:text-xl text-luxury-600 max-w-2xl leading-relaxed italic">
            Explore our curated fashion blog catalog of avant-garde haute couture, street subcultures, quiet luxury narratives, and independent guest critiques from global ateliers.
          </p>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="bg-white border border-luxury-200 p-4 sm:p-6 shadow-sm mb-10 space-y-4">
          
          {/* Top Row: Search input & Season selector */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trends, designers, fabrics, silhouettes..."
                className="w-full pl-10 pr-4 py-2.5 bg-luxury-50 border border-luxury-300 text-xs text-luxury-900 placeholder-luxury-400 focus:outline-none focus:border-gold-500 focus:bg-white transition"
              />
              <Search size={15} className="absolute left-3.5 top-3 text-luxury-400" />
            </form>

            {/* Filter Pills / Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Type Switcher */}
              <div className="flex border border-luxury-300 text-[11px] uppercase tracking-wider font-semibold">
                <button
                  onClick={() => handleTypeChange('all')}
                  className={`px-3 py-2 transition ${filterType === 'all' ? 'bg-luxury-950 text-gold-400' : 'bg-white text-luxury-600 hover:text-luxury-950'}`}
                >
                  All Sources
                </button>
                <button
                  onClick={() => handleTypeChange('editorial')}
                  className={`px-3 py-2 transition ${filterType === 'editorial' ? 'bg-luxury-950 text-gold-400' : 'bg-white text-luxury-600 hover:text-luxury-950'}`}
                >
                  Staff Atelier
                </button>
                <button
                  onClick={() => handleTypeChange('guest')}
                  className={`px-3 py-2 flex items-center gap-1 transition ${filterType === 'guest' ? 'bg-luxury-950 text-gold-400' : 'bg-white text-luxury-600 hover:text-luxury-950'}`}
                >
                  <Feather size={11} />
                  <span>Guest Posts</span>
                </button>
              </div>

              {/* Season Selector */}
              <select
                value={activeSeason}
                onChange={(e) => handleSeasonChange(e.target.value)}
                className="px-3.5 py-2 bg-white border border-luxury-300 text-xs uppercase tracking-wider font-medium text-luxury-800 focus:outline-none focus:border-gold-500"
              >
                <option value="all">All Fashion Seasons</option>
                <option value="Spring / Summer 2026">Spring / Summer 2026</option>
                <option value="Fall / Winter 2026">Fall / Winter 2026</option>
                <option value="Resort 2026">Resort 2026</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Horizontal Tabs */}
          <div className="pt-3 border-t border-luxury-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-gold-500 text-luxury-950'
                  : 'bg-luxury-100/70 text-luxury-700 hover:bg-luxury-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition shrink-0 ${
                  activeCategory === cat.name
                    ? 'bg-gold-500 text-luxury-950'
                    : 'bg-luxury-100/70 text-luxury-700 hover:bg-luxury-200'
                }`}
              >
                {cat.name}
                {cat.post_count > 0 && <span className="ml-1 text-[10px] opacity-75">({cat.post_count})</span>}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter & Active Query indicator */}
        <div className="flex items-center justify-between text-xs text-luxury-500 mb-6 uppercase tracking-wider">
          <div>
            Showing <span className="font-bold text-luxury-950">{posts.length}</span> runway stories
            {activeCategory !== 'all' && <span> in <span className="text-gold-700 font-semibold">{activeCategory}</span></span>}
            {activeSeason !== 'all' && <span> • <span className="text-luxury-800 font-medium">{activeSeason}</span></span>}
          </div>
          {(activeCategory !== 'all' || activeSeason !== 'all' || filterType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveSeason('all');
                setFilterType('all');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-gold-700 hover:text-gold-900 font-semibold underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Grid of Articles */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs tracking-luxury uppercase text-luxury-500">Unveiling Trend Dispatches...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 2).map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                onLikePost={handleLikePost}
              />
            ))}

            {/* Injected Native Sponsored Editorial Card */}
            <AdBanner type="native-card" />

            {posts.slice(2).map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                onSelectPost={(slug) => navigate(`/blog/${slug}`)}
                onLikePost={handleLikePost}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-luxury-200 p-12 text-center my-8">
            <h3 className="font-editorial text-xl font-bold text-luxury-900 mb-2">
              No Trend Stories Found
            </h3>
            <p className="text-xs text-luxury-500 max-w-md mx-auto mb-6">
              We couldn't find any articles matching your search criteria. Try choosing a different category, season, or reset your filters.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveSeason('all');
                  setFilterType('all');
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="px-5 py-2.5 bg-luxury-950 text-gold-400 font-bold text-xs uppercase tracking-luxury hover:bg-gold-500 hover:text-luxury-950 transition"
              >
                Clear All Filters
              </button>
              <Link
                to="/write-for-us"
                className="px-5 py-2.5 bg-gold-500 text-luxury-950 font-bold text-xs uppercase tracking-luxury hover:bg-gold-400 transition"
              >
                Submit This Trend
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Banner: Contributor Invitation */}
        <div className="mt-16 bg-luxury-950 text-white p-8 sm:p-12 border border-gold-500/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-gold-400 text-[10px] uppercase tracking-luxury font-bold">
              <Feather size={12} />
              <span>CONTRIBUTOR VOICES WELCOME</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
              Write a Guest Post on Your Favorite Trend
            </h3>
            <p className="text-xs text-luxury-300 max-w-xl font-light leading-relaxed">
              Have an analysis of current runway collections, a breakdown of quiet luxury silhouettes, or a deep dive into sustainable fashion? Share it with our global readership.
            </p>
          </div>
          <Link
            to="/write-for-us"
            className="px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-luxury transition shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>Submit Your Pitch</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
}
