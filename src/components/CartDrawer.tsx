import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    taxGst, 
    shippingFee, 
    discountAmount, 
    total, 
    coupon, 
    applyCoupon, 
    removeCoupon,
    setCurrentView 
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    setPromoStatus(res);
    if (res.success) setPromoInput('');
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const freeDeliveryThreshold = 1999;
  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Frosted Glass Drawer */}
      <div className="relative w-full max-w-md glass-panel-heavy border-l border-white/20 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300 text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-white font-display">
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg glass-btn text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar in Frosted Glass */}
        <div className="glass-panel-subtle px-5 py-3 border-b border-white/10 text-xs">
          {remainingForFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span className="flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Add ₹{remainingForFreeShipping.toLocaleString('en-IN')} for <strong className="text-amber-300 ml-1">FREE Shipping</strong>
                </span>
                <span className="text-amber-400 font-black">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center text-emerald-400 font-bold space-x-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Great news! You qualify for FREE Express Delivery.</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-white/10">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-white">Your shopping cart is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Browse our selection of modular switches, Polycab copper wires, and LED fixtures.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('catalog');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl glass-btn-primary text-white font-bold text-xs shadow-md"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`cart-${item.product.id || idx}-${item.selectedColor || ''}-${idx}`} className="py-4 flex gap-3.5 items-start">
                <img
                  src={item.product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={item.product.name}
                  className="w-18 h-18 rounded-xl object-cover bg-slate-950/40 border border-white/10 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    {item.product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate leading-snug">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-black text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (₹{item.product.price.toLocaleString('en-IN')} each)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-white/15 rounded-lg overflow-hidden glass-panel-subtle">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs text-slate-300 hover:bg-white/10 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs text-slate-300 hover:bg-white/10 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-white/20 glass-panel-subtle space-y-3">
            
            {/* Promo Code Input */}
            <div>
              {coupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Applied: {coupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-400 text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. SUNRISE10)..."
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 glass-input rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 glass-btn text-white text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoStatus && !coupon && (
                <p className={`text-[11px] mt-1 flex items-center space-x-1 ${
                  promoStatus.success ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {promoStatus.success ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                  <span>{promoStatus.message}</span>
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-white/20">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount Less:</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (18% inclusive):</span>
                <span>₹{taxGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping:</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/20">
                <span>Final Total:</span>
                <span className="text-base font-black text-amber-400">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 rounded-xl glass-btn-primary text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl active:scale-95"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
