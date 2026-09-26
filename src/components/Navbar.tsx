import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Menu, 
  X, 
  Sun, 
  PhoneCall, 
  ShieldCheck, 
  Package, 
  LayoutDashboard, 
  Lock,
  LogOut,
  Zap,
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
    setIsAdminLoginModalOpen,
    setIsContactModalOpen
  } = useStore();
  
  const { isAdmin, logout } = useAuth();
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
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm text-slate-800">
      {/* Note: NO extra banner or heading at the top of screen - starts immediately with clean navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/35 transition-all duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sun className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
                  SUNRISE
                </span>
                <span className="text-[11px] uppercase tracking-wider text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Electricals
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
                Premium Electrical Store & Supplies
              </p>
            </div>
          </div>

          {/* Search Bar - Center */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative items-center mx-4"
          >
            <input
              type="text"
              placeholder="Search modular switches, Polycab wires, BLDC fans, track lights..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-full py-2.5 pl-11 pr-24 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-full transition-all shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors py-1 ${
                currentView === 'home' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : 'hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`transition-colors py-1 ${
                currentView === 'catalog' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : 'hover:text-slate-900'
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className={`transition-colors py-1 flex items-center space-x-1.5 ${
                currentView === 'orders' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : 'hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Track Orders</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`transition-colors py-1 flex items-center space-x-1.5 px-3 py-1 rounded-xl font-bold ${
                  currentView === 'admin' 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-600" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Visible WhatsApp Order Button */}
          <div className="flex items-center space-x-3 sm:space-x-3.5">
            
            {/* Prominent WhatsApp Order Button */}
            <a
              href="https://wa.me/917488623614?text=Hello%20Sunrise%20Electricals%2C%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all group"
              title="Click to place order on WhatsApp: +91 7488623614"
            >
              <MessageSquare className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">WhatsApp Order:</span>
              <span className="text-emerald-100 font-extrabold">+91 7488623614</span>
            </a>

            {/* Wishlist Button */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2.5 rounded-full text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="hidden md:inline text-xs uppercase tracking-wider">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-white text-slate-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-black shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            {isAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 hover:bg-amber-200 transition-colors"
                title="Super Admin Active"
              >
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                title="Store Owner Admin Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search electrical items..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-20 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 text-white text-xs font-bold rounded-lg"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 shadow-xl">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Product Catalog
          </button>
          <button
            onClick={() => handleNavClick('orders')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Track Orders</span>
            <Package className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={() => handleNavClick('wishlist')}
            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
          >
            <span>Saved Wishlist</span>
            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full font-bold">{wishlist.length}</span>
          </button>

          {isAdmin ? (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200 flex items-center justify-between"
            >
              <span>Admin Dashboard</span>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAdminLoginModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 flex items-center justify-between"
            >
              <span>Owner Admin Login</span>
              <Lock className="w-4 h-4 text-slate-500" />
            </button>
          )}

          <div className="pt-2 border-t border-slate-100">
            <a
              href="https://wa.me/917488623614?text=Hello%20Sunrise%20Electricals%2C%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp Order: +91 7488623614</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
