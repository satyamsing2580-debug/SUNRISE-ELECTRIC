import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Check 
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, toggleWishlist, isInWishlist } = useStore();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative rounded-2xl glass-card p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] select-none touch-manipulation cursor-pointer overflow-hidden text-slate-100 shadow-xl border border-white/20 hover:border-amber-400/60"
    >
      {/* Top Media */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950/40 mb-3 border border-white/20">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.isBestSeller && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md shadow-md">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md shadow-md">
              New Arrival
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-md shadow-md">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          title="Save to Wishlist"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full glass-panel-heavy border border-white/20 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:scale-110 transition-all z-10 shadow-lg"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-400 fill-rose-400' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-black uppercase tracking-wider bg-rose-500 text-white px-3 py-1 rounded-md shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Middle Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-extrabold uppercase tracking-wider text-amber-400">
              {product.brand}
            </span>
            <span className="text-slate-400 font-medium truncate max-w-[120px]">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-2 font-display">
            {product.name}
          </h3>

          {/* Rating & Highlight */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1 glass-panel-subtle px-1.5 py-0.5 rounded-md border border-white/20 text-amber-300 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.reviewCount})
            </span>
            {product.specs?.warranty && (
              <span className="text-[10px] text-slate-400 hidden sm:inline-block truncate">
                • {product.specs.warranty}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-white/20 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Inclusive of GST
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md ${
              product.inStock
                ? addedAnimation
                  ? 'bg-emerald-500 text-white font-extrabold'
                  : 'glass-btn-primary text-white active:scale-95'
                : 'glass-panel-subtle text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
