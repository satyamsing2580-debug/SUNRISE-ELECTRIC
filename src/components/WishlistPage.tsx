import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setCurrentView } = useStore();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-white/20">
        <div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs text-slate-400 hover:text-amber-400 font-bold flex items-center space-x-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Saved Wishlist ({favoriteProducts.length})
            </h1>
          </div>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl glass-panel border border-white/20 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full glass-panel-subtle flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-8 h-8 fill-rose-400/20" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">Your wishlist is currently empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Save modular switches, wires, or luxury lighting items to your wishlist while browsing.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-6 py-2.5 glass-btn-primary text-white font-bold text-xs rounded-xl shadow-lg"
          >
            Browse Electrical Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {favoriteProducts.map((prod, idx) => (
            <ProductCard key={`wish-${prod.id || idx}`} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
