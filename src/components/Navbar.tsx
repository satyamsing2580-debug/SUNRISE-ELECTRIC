import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Menu, 
  X, 
  Sun, 
  Package, 
  LayoutDashboard, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    currentView, 
    setCurrentView,
    filters,
    setFilter,
    setIsAdminLoginModalOpen
  } = useStore();
  
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(filters.searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter('searchQuery', searchVal);
    if (currentView !== 'catalog') {
      setCurrentView('catalog');
    }
  };

  const handleNavClick = (view: 'home' | 'catalog' | 'orders' | 'admin' | 'wishlist') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-950/75 border-b border-white/20 shadow-2xl text-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950/90 backdrop-blur-md rounded-[14px] flex items-center justify-center border border-white/10">
                <Sun className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-display">
                  SUNRISE
                </span>
                <span className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold glass-panel-subtle px-2 py-0.5 rounded-md border border-amber-400/30">
                  Electricals
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Premium Electrical Store & Supplies
              </p>
            </div>
          </div>

          {/* Frosted Glass Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative items-center mx-4"
          >
            <input
              type="text"
              placeholder="Search modular switches, Polycab wires, BLDC fans..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full glass-input rounded-full py-2.5 pl-11 pr-24 text-sm placeholder-slate-400 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 glass-btn-primary text-white text-xs font-bold rounded-full transition-all active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-all py-1 relative ${
                currentView === 'home' 
                  ? 'text-amber-400 font-bold' 
                  : 'hover:text-white'
              }`}
            >
              Home
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}
            </button>
            
            <button
              onClick={() => handleNavClick('catalog')}
              className={`transition-all py-1 relative ${
                currentView === 'catalog' 
                  ? 'text-amber-400 font-bold' 
                  : 'hover:text-white'
              }`}
            >
              Catalog
              {currentView === 'catalog' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}
            </button>
            
            <button
              onClick={() => handleNavClick('orders')}
              className={`transition-all py-1 flex items-center space-x-1.5 relative ${
                currentView === 'orders' 
                  ? 'text-amber-400 font-bold' 
                  : 'hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Track Orders</span>
              {currentView === 'orders' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`transition-all py-1 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold glass-panel border ${
                  currentView === 'admin' 
                    ? 'border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'border-white/15 text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Visible WhatsApp Order Button */}
          <div className="flex items-center space-x-3 sm:space-x-3.5">
            
            {/* Prominent Frosted WhatsApp Order Button */}
            <a
              href="https://wa.me/917488623614?text=Hello%20Sunrise%20Electricals%2C%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-emerald-300 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all group active:scale-95"
              title="Click to place order on WhatsApp: +91 7488623614"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">WhatsApp:</span>
              <span className="text-white font-extrabold">+91 7488623614</span>
            </a>

            {/* Frosted Wishlist Button */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2.5 rounded-full glass-btn text-slate-300 hover:text-rose-400 transition-colors"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Frosted Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 glass-btn-primary text-white font-black px-4 py-2 rounded-xl transition-all active:scale-95 shadow-[0_4px_20px_rgba(245,158,11,0.35)]"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="hidden md:inline text-xs uppercase tracking-wider font-extrabold">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-white text-slate-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Key Icon */}
            {!isAdmin ? (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="p-2 rounded-xl glass-btn text-slate-400 hover:text-amber-400 transition-colors"
                title="Super Admin Login"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl glass-btn text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Input */}
        <form 
          onSubmit={handleSearchSubmit}
          className="md:hidden pb-3.5 pt-1 relative flex items-center"
        >
          <input
            type="text"
            placeholder="Search electrical items..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full glass-input rounded-xl py-2 pl-9 pr-20 text-xs placeholder-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1.5 top-2.5 bottom-2 px-3 glass-btn-primary text-white text-[11px] font-bold rounded-lg"
          >
            Search
          </button>
        </form>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentView === 'home' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentView === 'catalog' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center space-x-2 ${
                currentView === 'orders' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Track Orders</span>
            </button>
            <button
              onClick={() => handleNavClick('wishlist')}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center space-x-2 ${
                currentView === 'wishlist' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Saved Wishlist ({wishlist.length})</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-amber-300 bg-amber-500/20 border border-amber-400/30 flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
