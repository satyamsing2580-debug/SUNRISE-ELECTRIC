import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck, 
  ShieldCheck
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
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    total,
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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300 text-slate-800">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-extrabold text-slate-900 font-display">
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Bar */}
        <div className="bg-amber-50/60 px-5 py-3 border-b border-amber-200/80 text-xs">
          {remainingForFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 font-semibold">
                <span className="flex items-center">
                  <Truck className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  Add ₹{remainingForFreeShipping.toLocaleString('en-IN')} for <strong className="text-amber-700 ml-1">FREE Express Shipping</strong>
                </span>
                <span className="text-amber-700 font-black">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center text-emerald-700 font-bold space-x-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Great news! You qualify for FREE Express Delivery.</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your shopping cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Browse our selection of modular switches, Polycab copper wires, and LED fixtures.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('catalog');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-sm"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`cart-${item.product.id || idx}-${item.selectedColor || ''}-${idx}`} className="py-4 flex gap-3.5 items-start">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 rounded-xl object-cover bg-slate-50 border border-slate-200 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                    {item.product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-black text-slate-900">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (₹{item.product.price.toLocaleString('en-IN')} each)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-black text-slate-900 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            
            {/* Promo code */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-xs">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-amber-900">{appliedCoupon}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">(-₹{discountAmount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. SUNRISE10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {promoStatus && (
                    <p className={`text-[10px] font-bold ${promoStatus.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {promoStatus.message}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>18% Electrical GST</span>
                <span>₹{taxGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-amber-600 text-base">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/25 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/917488623614?text=${encodeURIComponent(
                  `Hello Sunrise Electricals, I want to place an order:\n\n` +
                  cart.map((item, i) => `${i + 1}. ${item.product.name} (${item.quantity}x) - ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`).join('\n') +
                  `\n\nTotal: ₹${total.toLocaleString('en-IN')}\nAddress: Gopalganj\nPlease confirm delivery.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <span>Order via WhatsApp (+91 7488623614)</span>
              </a>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Safe 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
