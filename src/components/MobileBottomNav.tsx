import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  LayoutGrid, 
  Heart 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    setIsCartOpen,
    orders,
    wishlist 
  } = useStore();
  const { isAdmin } = useAuth();

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto">
      <nav className="glass-panel-heavy rounded-full px-3 py-2 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="flex items-center justify-around">
          
          {/* 1. Home Tab */}
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              currentView === 'home'
                ? 'text-amber-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-white font-medium'
            }`}
          >
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">Home</span>
            {currentView === 'home' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
            )}
          </button>

          {/* 2. Catalog Tab */}
          <button
            onClick={() => setCurrentView('catalog')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              currentView === 'catalog'
                ? 'text-amber-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-white font-medium'
            }`}
          >
            <LayoutGrid className={`w-5 h-5 ${currentView === 'catalog' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">Catalog</span>
            {currentView === 'catalog' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
            )}
          </button>

          {/* 3. Orders / Live Tracking Tab */}
          <button
            onClick={() => setCurrentView('orders')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              currentView === 'orders'
                ? 'text-amber-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-white font-medium'
            }`}
          >
            <div className="relative">
              <Package className={`w-5 h-5 ${currentView === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Orders</span>
            {currentView === 'orders' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
            )}
          </button>

          {/* 4. Wishlist Tab */}
          <button
            onClick={() => setCurrentView('wishlist')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              currentView === 'wishlist'
                ? 'text-rose-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-white font-medium'
            }`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'stroke-[2.5] fill-rose-400' : 'stroke-2'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Saved</span>
            {currentView === 'wishlist' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,1)]" />
            )}
          </button>

          {/* 5. Cart Tab with Drawer trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-white font-medium transition-all relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-2" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Cart</span>
          </button>

        </div>
      </nav>
    </div>
  );
};
