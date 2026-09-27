import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Check, 
  Zap, 
  ShieldCheck
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
      className="group relative rounded-2xl bg-white border border-slate-200 hover:border-amber-400 p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] select-none touch-manipulation cursor-pointer overflow-hidden text-slate-800 shadow-xs"
    >
      {/* Top Media */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-3.5 border border-slate-100">
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
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded shadow-sm">
              New Arrival
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          title="Save to Wishlist"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:scale-110 transition-all z-10 shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-black uppercase tracking-wider bg-rose-600 text-white px-3 py-1 rounded-md shadow">
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
            <span className="font-extrabold uppercase tracking-wider text-amber-700">
              {product.brand}
            </span>
            <span className="text-slate-400 font-medium truncate max-w-[120px]">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Rating & Highlight */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-amber-700 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.reviewCount})
            </span>
            {product.specs?.warranty && (
              <span className="text-[10px] text-slate-500 hidden sm:inline-block truncate">
                • {product.specs.warranty}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-slate-900">
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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
              product.inStock
                ? addedAnimation
                  ? 'bg-emerald-600 text-white font-extrabold'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
