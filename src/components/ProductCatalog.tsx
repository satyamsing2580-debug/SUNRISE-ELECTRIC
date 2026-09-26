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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {filters.category === 'All' ? 'Complete Electrical Catalog' : filters.category}
            </h1>
            <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">
              {filteredProducts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Genuine factory-direct electrical supplies with official manufacturer warranty.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filters ({filters.brands.length + (filters.category !== 'All' ? 1 : 0) + (filters.inStockOnly ? 1 : 0)})</span>
          </button>

          <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-xs text-slate-500 font-medium">Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Filter Products
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-600 hover:text-amber-800 font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Department</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                  filters.category === 'All'
                    ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>All Departments</span>
                <span className="text-[10px] text-slate-400 font-bold">{products.length}</span>
              </button>
              {categories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      filters.category === c.name
                        ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Authorized Brands</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {ELECTRICAL_BRANDS.filter(b => b !== 'All Brands').map((b) => {
                const checked = filters.brands.includes(b);
                return (
                  <label
                    key={b}
                    className="flex items-center space-x-2 text-xs text-slate-700 hover:text-slate-900 py-1 px-1 rounded cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(b)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span>{b}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500">Max Budget</span>
              <span className="font-black text-amber-600">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={500}
              max={25000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>₹500</span>
              <span>₹25,000+</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs font-semibold">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-slate-700">In-Stock Only</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilter('inStockOnly', e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-slate-700">Top Rated (4.8★ & above)</span>
              <input
                type="checkbox"
                checked={filters.minRating === 4.8}
                onChange={(e) => setFilter('minRating', e.target.checked ? 4.8 : 0)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4"
              />
            </label>
          </div>

        </aside>

        {/* Mobile Filter Slide Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 z-10 border-l border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-sm font-bold text-slate-900">Filter Products</span>
                <button 
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Departments */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Department</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      handleCategorySelect('All');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg font-bold ${
                      filters.category === 'All' ? 'bg-amber-500 text-white' : 'text-slate-700'
                    }`}
                  >
                    All Departments
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        handleCategorySelect(c.name);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-bold ${
                        filters.category === c.name ? 'bg-amber-500 text-white' : 'text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Brands</h4>
                {ELECTRICAL_BRANDS.filter(b => b !== 'All Brands').map((b) => (
                  <label key={b} className="flex items-center space-x-2 text-xs text-slate-700 py-1">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(b)}
                      onChange={() => handleBrandToggle(b)}
                      className="rounded border-slate-300 text-amber-500"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2 text-xs font-bold bg-amber-500 text-white rounded-xl"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Active Filter Chips */}
          {(filters.category !== 'All' || filters.brands.length > 0 || filters.searchQuery || filters.inStockOnly || filters.minRating > 0) && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
              <span className="text-slate-500 font-bold">Active:</span>

              {filters.category !== 'All' && (
                <span className="inline-flex items-center bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {filters.category}
                  <button onClick={() => setFilter('category', 'All')} className="ml-1 text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.brands.map((b) => (
                <span key={b} className="inline-flex items-center bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  {b}
                  <button onClick={() => handleBrandToggle(b)} className="ml-1 text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.searchQuery && (
                <span className="inline-flex items-center bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-full font-bold">
                  "{filters.searchQuery}"
                  <button onClick={() => setFilter('searchQuery', '')} className="ml-1 text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.inStockOnly && (
                <span className="inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  In Stock Only
                  <button onClick={() => setFilter('inStockOnly', false)} className="ml-1 text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-amber-600 hover:underline font-bold ml-auto text-xs"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Grid or Empty */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No electrical items found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No components matched your search or selected filters. Try broadening your criteria.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={`cat-${product.id || idx}`} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
