import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Zap, 
  CheckCircle2,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setCurrentView,
    setIsCartOpen
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProduct) return null;

  const images = selectedProduct.gallery && selectedProduct.gallery.length > 0 
    ? selectedProduct.gallery 
    : [selectedProduct.image];

  const isFavorited = isInWishlist(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Media */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
              <img
                src={images[activeImageIndex] || selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-500 hover:text-rose-500 transition-colors shadow-sm"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-amber-500 scale-95 shadow-md' 
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurances */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto" />
                <p className="font-bold text-slate-900">100% Genuine</p>
                <p className="text-[10px] text-slate-500">Official Brand Seal</p>
              </div>
              <div className="space-y-1">
                <Truck className="w-5 h-5 text-amber-600 mx-auto" />
                <p className="font-bold text-slate-900">Express Delivery</p>
                <p className="text-[10px] text-slate-500">Carefully Packed</p>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-5 h-5 text-amber-600 mx-auto" />
                <p className="font-bold text-slate-900">7 Days Return</p>
                <p className="text-[10px] text-slate-500">Hassle Free</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
                <span>{selectedProduct.brand}</span>
                <span>•</span>
                <span className="text-slate-500">{selectedProduct.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display leading-snug">
                {selectedProduct.name}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 text-amber-800 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{selectedProduct.rating} / 5.0</span>
              </div>
              <span className="text-slate-500">
                ({selectedProduct.reviewCount} customer ratings)
              </span>
              <div className="ml-auto">
                {selectedProduct.inStock ? (
                  <span className="inline-flex items-center text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    In Stock ({selectedProduct.stockCount} units)
                  </span>
                ) : (
                  <span className="text-rose-800 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      Save {selectedProduct.discountPercent}% (₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')})
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Price includes 18% Electrical GST • Free standard delivery on orders above ₹1,999
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Highlights */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Highlights</h4>
                <div className="space-y-1">
                  {selectedProduct.features.map((feat, i) => (
                    <div key={i} className="flex items-start text-xs text-slate-700">
                      <Zap className="w-3.5 h-3.5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specs Table */}
            {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical Specifications</h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden divide-y divide-slate-200 text-xs">
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    val ? (
                      <div key={key} className="grid grid-cols-3 px-3 py-2">
                        <span className="text-slate-500 capitalize font-medium">{key}</span>
                        <span className="col-span-2 text-slate-800 font-bold">{val}</span>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-black text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stockCount || 99, quantity + 1))}
                    className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
                  className={`py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all border ${
                    selectedProduct.inStock
                      ? justAdded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!selectedProduct.inStock}
                  className={`py-3.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-md ${
                    selectedProduct.inStock
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white active:scale-98'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Instant Buy Now</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
