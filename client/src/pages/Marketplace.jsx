import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { CourseCard } from '../components/common/CourseCard';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

export const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states initialized from URL parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'all');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Keep internal states synced if search params change
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category'));
    if (searchParams.get('search')) setSearch(searchParams.get('search'));
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedLevel && selectedLevel !== 'all') params.level = selectedLevel;
        if (selectedPrice && selectedPrice !== 'all') params.price = selectedPrice;
        if (search && search.trim()) params.search = search.trim();
        if (sortBy) params.sort = sortBy;

        const [cRes, catRes] = await Promise.all([
          api.courses.getAll(params),
          api.courses.getCategories()
        ]);

        if (cRes.success) setCourses(cRes.courses);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, selectedLevel, selectedPrice, search, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedPrice('all');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-800/80 text-amber-300 text-xs font-bold border border-violet-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AuraLMS Course Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Explore All Masterclasses & Courses
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Acquire deep knowledge, build comprehensive projects, take interactive quizzes, and earn prestigious credentials.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Desktop Filters Sidebar */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-violet-600" />
              <span>Filter Catalog</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-400 hover:text-violet-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Keywords, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-violet-100 text-violet-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-violet-100 text-violet-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">({cat.courseCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Difficulty</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-center transition-all ${
                    selectedLevel.toLowerCase() === lvl.toLowerCase()
                      ? 'bg-violet-600 text-white font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl === 'all' ? 'Any' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pricing</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'free', label: 'Free' },
                { id: 'paid', label: 'Paid' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrice(p.id)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold text-center transition-all ${
                    selectedPrice === p.id
                      ? 'bg-amber-500 text-white font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Course Grid & Sort Bar */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort / Counter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs sm:text-sm font-bold text-slate-700">
              Showing <span className="text-violet-700 font-extrabold">{courses.length}</span> curated courses
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl flex items-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse p-4 space-y-4">
                  <div className="aspect-[16/9] bg-slate-200 rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No courses match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your category or difficulty filters, or clear your search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
