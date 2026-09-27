import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  LayoutGrid, 
  ShieldCheck, 
  Lock, 
  Heart,
  MessageSquare
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
    wishlist,
    setIsAdminLoginModalOpen 
  } = useStore();
  const { isAdmin } = useAuth();

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-1 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Home Tab */}
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
            currentView === 'home'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
          {currentView === 'home' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
          )}
        </button>

        {/* 2. Catalog Tab */}
        <button
          onClick={() => setCurrentView('catalog')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
            currentView === 'catalog'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${currentView === 'catalog' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Catalog</span>
          {currentView === 'catalog' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
          )}
        </button>

        {/* 3. Orders / Live Tracking Tab */}
        <button
          onClick={() => setCurrentView('orders')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
            currentView === 'orders'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Package className={`w-5 h-5 ${currentView === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Orders</span>
          {currentView === 'orders' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-500" />
          )}
        </button>

        {/* 4. Cart Tab with Drawer trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Cart</span>
        </button>

        {/* 5. Wishlist Tab */}
        <button
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
            currentView === 'wishlist'
              ? 'text-amber-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Saved</span>
        </button>

        {/* 6. Admin Portal Tab */}
        {isAdmin ? (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
              currentView === 'admin'
                ? 'text-amber-700 font-extrabold'
                : 'text-amber-600 font-semibold'
            }`}
          >
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] tracking-tight mt-0.5">Admin</span>
            {currentView === 'admin' && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-600" />
            )}
          </button>
        ) : (
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1.5 text-slate-400 hover:text-slate-600 font-medium transition-colors"
          >
            <Lock className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Owner</span>
          </button>
        )}

      </div>
    </nav>
  );
};
