import React, { useState } from 'react';
import { Listing, Category, ConditionGrade } from '../types';
import { Search, Sparkles, MapPin, SlidersHorizontal, Grid, Map, ShieldCheck, ArrowUpDown, Tag, Leaf } from 'lucide-react';

interface ExploreMarketplaceProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}

export const ExploreMarketplace: React.FC<ExploreMarketplaceProps> = ({ listings, onSelectListing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedCondition, setSelectedCondition] = useState<ConditionGrade | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'co2' | 'newest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const categories: (Category | 'All')[] = [
    'All',
    'Timber & Wood',
    'Metals & Alloys',
    'Brick & Masonry',
    'Glass & Acrylic',
    'Textiles & Foam',
    'Hardware'
  ];

  const conditions: (ConditionGrade | 'All')[] = ['All', 'Grade A', 'Grade B', 'Grade C'];

  // Handle AI Project Match
  const handleAiProjectMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiMatching(true);
    setAiExplanation(null);
    try {
      const res = await fetch('/api/gemini/project-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, inventory: listings })
      });
      const data = await res.json();
      if (data.matchedIds) {
        setMatchedIds(data.matchedIds);
        setAiExplanation(data.aiExplanation);
      }
    } catch (err) {
      console.error('AI match error:', err);
    } finally {
      setIsAiMatching(false);
    }
  };

  const clearAiMatch = () => {
    setMatchedIds([]);
    setAiExplanation(null);
    setSearchQuery('');
  };

  // Filter & Sort logic
  const filteredListings = listings.filter(item => {
    // If AI match mode active, restrict to matched IDs
    if (matchedIds.length > 0 && !matchedIds.includes(item.id)) {
      return false;
    }

    if (matchedIds.length === 0 && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (item.title + ' ' + item.category + ' ' + item.location + ' ' + item.conditionNotes).toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedCondition !== 'All' && item.conditionGrade !== selectedCondition) return false;
    if (item.price > maxPrice) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'co2') return b.co2SavedKg - a.co2SavedKg;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1E4D3B] text-white p-8 md:p-12 shadow-xl">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#85E3B5] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Gemini AI Project Matcher
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Intelligent Reusable Materials Marketplace
          </h1>
          <p className="text-stone-300 text-sm md:text-base">
            Source high-grade architectural salvage, reclaimed structural timber, and industrial surplus. Zero landfill waste, certified embodied carbon savings.
          </p>

          {/* AI Search Bar Form */}
          <form onSubmit={handleAiProjectMatch} className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Describe your project (e.g., 'outdoor planter box and pergola' or 'steel shelving')..."
                className="w-full bg-white text-stone-900 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-[#85E3B5]"
              />
            </div>
            <button
              type="submit"
              disabled={isAiMatching}
              className="px-6 py-4 bg-[#D96B27] hover:bg-[#c25c1f] text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiMatching ? 'Analyzing Project...' : 'AI Project Match'}</span>
            </button>
          </form>
          {matchedIds.length > 0 && (
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-3 rounded-xl text-xs text-stone-200">
              <span>Showing AI-matched materials for your project.</span>
              <button onClick={clearAiMatch} className="underline font-semibold hover:text-white">Clear Filter</button>
            </div>
          )}
        </div>
      </div>

      {/* AI Explanation Banner if active */}
      {aiExplanation && (
        <div className="bg-[#0F766E]/10 border border-[#0F766E]/30 p-5 rounded-2xl flex items-start gap-4 animate-slideDown">
          <div className="p-2.5 bg-[#0F766E] text-white rounded-xl shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#1E4D3B]">AI Upcycle & Match Analysis</h4>
            <p className="text-xs text-stone-700 leading-relaxed">{aiExplanation}</p>
          </div>
        </div>
      )}

      {/* Controls Bar: Category Pills, View Mode Toggle, Sort */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1E4D3B] text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View mode toggle & Sort */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid' ? 'bg-[#1E4D3B] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'map' ? 'bg-[#1E4D3B] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Map Split View
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-xs">
            <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="co2">Highest CO₂ Savings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar Filters + Grid / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#1E4D3B]" />
              Filter Inventory
            </h3>
            <button 
              onClick={() => { setSelectedCategory('All'); setSelectedCondition('All'); setMaxPrice(1000); }}
              className="text-xs text-[#0F766E] font-semibold hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Condition Grade */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Condition Grade</label>
            <div className="flex flex-wrap gap-2">
              {conditions.map(cond => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedCondition === cond
                      ? 'bg-[#0F766E] text-white border-[#0F766E]'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span className="uppercase tracking-wider">Max Price</span>
              <span className="text-[#D96B27] font-bold">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1E4D3B]"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>$100</span>
              <span>$1,500</span>
            </div>
          </div>

          {/* Eco Impact Summary Widget */}
          <div className="bg-[#1E4D3B]/5 border border-[#1E4D3B]/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D3B]">
              <Leaf className="w-4 h-4 text-[#0F766E]" />
              Circular Economy Standard
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Every lot diverted prevents virgin material extraction and locks in embodied carbon. Certified by ReClaim AI audit logs.
            </p>
          </div>
        </div>

        {/* Listings Grid / Map View */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            filteredListings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 space-y-3">
                <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-800">No matching materials found</h3>
                <p className="text-xs text-stone-500">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectListing(item)}
                    className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                  >
                    {/* Image Header with condition badge */}
                    <div className="relative h-56 overflow-hidden bg-stone-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold shadow-xs">
                          {item.category}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#1E4D3B] text-[#85E3B5] text-xs font-bold shadow-xs">
                          {item.conditionGrade}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-[#85E3B5]" />
                        {item.co2SavedKg} kg CO₂ saved
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
                          {item.location}
                        </div>
                        <h3 className="text-base font-bold text-stone-900 group-hover:text-[#1E4D3B] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-1">{item.estimatedDimensions}</p>
                      </div>

                      {/* Footer: Price & Seller */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <div className="text-lg font-extrabold text-[#D96B27]">${item.price}</div>
                          <div className="text-[10px] text-stone-400 line-through">Retail ${item.retailPrice}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={item.seller.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <span className="text-xs font-medium text-stone-700 truncate max-w-[100px]">{item.seller.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Interactive Map Split View */
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col h-[700px]">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600 font-semibold">
                <span>Interactive Salvage Depot Map ({filteredListings.length} Active Lots)</span>
                <span className="text-[#0F766E]">Click pins to inspect location inventory</span>
              </div>
              <div className="relative flex-1 bg-stone-900 overflow-hidden flex items-center justify-center">
                {/* Simulated Map Canvas Background */}
                <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80')` }} />
                <div className="absolute inset-0 bg-stone-950/60" />

                {/* Map Pins */}
                {filteredListings.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectListing(item)}
                    className="absolute cursor-pointer group flex flex-col items-center transition-transform hover:scale-110"
                    style={{ left: `${item.coordinates.x}%`, top: `${item.coordinates.y}%` }}
                  >
                    <div className="bg-[#D96B27] text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 border-2 border-white animate-bounce">
                      <span>${item.price}</span>
                    </div>
                    <div className="w-3 h-3 bg-[#D96B27] rotate-45 -mt-1.5 border border-white" />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-white text-stone-900 p-2.5 rounded-xl shadow-xl text-xs z-20 pointer-events-none">
                      <div className="font-bold truncate">{item.title}</div>
                      <div className="text-stone-500 text-[10px] mt-0.5">{item.location}</div>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg text-xs text-stone-800 space-y-1">
                  <div className="font-bold">National Salvage Network</div>
                  <div className="text-stone-500 text-[10px]">Real-time geolocation mapping for deconstruction hubs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
