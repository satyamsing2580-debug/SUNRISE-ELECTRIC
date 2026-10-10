import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ELECTRICAL_BRANDS } from '../data/initialProducts';

export const ProductCatalog: React.FC = () => {
  const { 
    filteredProducts, 
    products, 
    categories, 
    filters, 
    setFilter, 
    resetFilters 
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleBrandToggle = (brand: string) => {
    if (brand === 'All Brands') {
      setFilter('brands', []);
      return;
    }
    const current = [...filters.brands];
    const exists = current.includes(brand);
    if (exists) {
      setFilter('brands', current.filter((b) => b !== brand));
    } else {
      setFilter('brands', [...current, brand]);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setFilter('category', categoryName);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      
      {/* Catalog Header in Frosted Glass */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/20">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              {filters.category === 'All' ? 'Complete Electrical Catalog' : filters.category}
            </h1>
            <span className="text-xs glass-panel-subtle text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full font-bold shadow-md">
              {filteredProducts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Genuine factory-direct electrical supplies with official manufacturer warranty.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 rounded-xl glass-btn text-xs font-bold text-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Filters ({filters.brands.length + (filters.category !== 'All' ? 1 : 0) + (filters.inStockOnly ? 1 : 0)})</span>
          </button>

          <div className="flex items-center space-x-2 glass-panel rounded-xl px-3 py-1.5 border border-white/20">
            <span className="text-xs text-slate-400 font-medium">Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value as any)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-slate-900 text-white">Featured</option>
              <option value="price-low" className="bg-slate-900 text-white">Price: Low to High</option>
              <option value="price-high" className="bg-slate-900 text-white">Price: High to Low</option>
              <option value="rating" className="bg-slate-900 text-white">Customer Rating</option>
              <option value="newest" className="bg-slate-900 text-white">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar in Frosted Glass */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 glass-panel p-5 rounded-2xl border border-white/20 shadow-2xl sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Filter Products
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2.5">
              Categories
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filters.category === 'All'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                const isSelected = filters.category === c.name;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-500">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="pt-3 border-t border-white/20">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2.5">
              Authorized Brands
            </h4>
            <div className="space-y-1.5">
              {['Havells', 'Polycab', 'Philips', 'Legrand', 'Schneider', 'Atomberg'].map((brand) => {
                const isSelected = filters.brands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300 hover:text-white select-none py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded bg-white/10 border-white/20 text-amber-500 focus:ring-amber-500/50 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium">{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-3 border-t border-white/20">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-extrabold uppercase tracking-wider text-slate-300">Max Budget</span>
              <span className="font-mono font-bold text-amber-400">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="200"
              max="20000"
              step="200"
              value={filters.maxPrice}
              onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer bg-white/10"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-3 border-t border-white/20">
            <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilter('inStockOnly', e.target.checked)}
                className="rounded bg-white/10 border-white/20 text-amber-500 focus:ring-amber-500/50 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Active Filter Chips */}
          {(filters.brands.length > 0 || filters.category !== 'All' || filters.searchQuery || filters.inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2 p-3 glass-panel rounded-xl border border-white/20 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">Active Filters:</span>
              
              {filters.category !== 'All' && (
                <span className="inline-flex items-center space-x-1 glass-panel-subtle text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span>{filters.category}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-white" 
                    onClick={() => setFilter('category', 'All')}
                  />
                </span>
              )}

              {filters.brands.map((b) => (
                <span key={b} className="inline-flex items-center space-x-1 glass-panel-subtle text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span>{b}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-white" 
                    onClick={() => handleBrandToggle(b)}
                  />
                </span>
              ))}

              {filters.inStockOnly && (
                <span className="inline-flex items-center space-x-1 glass-panel-subtle text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span>In Stock Only</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-white" 
                    onClick={() => setFilter('inStockOnly', false)}
                  />
                </span>
              )}

              {filters.searchQuery && (
                <span className="inline-flex items-center space-x-1 glass-panel-subtle text-slate-200 border border-white/20 px-2.5 py-1 rounded-lg text-xs">
                  <span>Search: "{filters.searchQuery}"</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-white" 
                    onClick={() => setFilter('searchQuery', '')}
                  />
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-slate-400 hover:text-white text-xs underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Catalog Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl border border-white/20 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full glass-panel-subtle flex items-center justify-center mx-auto text-amber-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">No matching electrical products</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range, clearing brand filters, or checking back soon for new inventory.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 glass-btn-primary text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((prod, idx) => (
                <ProductCard key={`cat-${prod.id}-${idx}`} product={prod} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Drawer in Frosted Glass */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs glass-panel-heavy border-l border-white/20 h-full p-6 overflow-y-auto space-y-6 z-10 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <h3 className="text-base font-bold text-white font-display">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 glass-btn rounded-lg">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleCategorySelect('All');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                    filters.category === 'All' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-slate-300'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      handleCategorySelect(c.name);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                      filters.category === c.name ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-slate-300'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Brands */}
            <div className="pt-3 border-t border-white/10">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Brands</h4>
              <div className="space-y-2">
                {['Havells', 'Polycab', 'Philips', 'Legrand', 'Schneider', 'Atomberg'].map((brand) => (
                  <label key={brand} className="flex items-center space-x-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded bg-white/10 border-white/20 text-amber-500"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 glass-btn-primary text-white font-bold text-xs rounded-xl shadow-lg"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
