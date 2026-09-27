import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Banknote, 
  MapPin, 
  ArrowLeft, 
  Truck,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    subtotal, 
    taxGst, 
    shippingFee, 
    discountAmount, 
    total, 
    placeOrder, 
    setCurrentView 
  } = useStore();
  
  const { currentUser, userProfile } = useAuth();

  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [selectedGroup, setSelectedGroup] = useState<'gopalganj-store' | 'bihar-contractors'>('gopalganj-store');
  const [upiId, setUpiId] = useState('');
  
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: userProfile?.displayName || currentUser?.displayName || 'Ashish Singh',
    phone: userProfile?.phoneNumber || '+91 7488623614',
    addressLine1: 'Main Market Road',
    addressLine2: 'Near Commercial Complex',
    city: 'Gopalganj',
    state: 'Bihar',
    pincode: '841428',
    landmark: 'Central Electrical Plaza',
    type: 'home'
  });

  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  if (cart.length === 0 && !placedOrderNumber) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your shopping cart is empty</h2>
        <button
          onClick={() => setCurrentView('catalog')}
          className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.pincode) {
      alert('Please fill out all required address fields.');
      return;
    }
    setStep('payment');
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder(address, paymentMethod, selectedGroup);
      setPlacedOrderNumber(order.orderNumber);
    } catch (err: any) {
      alert(err.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrderNumber) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-extrabold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Order Confirmed & Logged to Firestore
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-display">
            Thank You for Shopping at Sunrise Electricals!
          </h2>
          <p className="text-sm text-slate-600">
            Order Reference: <strong className="text-slate-900 font-mono text-base">{placedOrderNumber}</strong>
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your electrical components have been allocated from our warehouse. The store admin has been alerted via audio chime!
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto shadow-sm">
          <div className="flex justify-between text-slate-500">
            <span>Delivering to:</span>
            <span className="text-slate-900 font-bold">{address.fullName}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Address:</span>
            <span className="text-slate-900 text-right font-medium max-w-[200px] truncate">
              {address.addressLine1}, {address.city}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Payment Mode:</span>
            <span className="text-amber-700 font-extrabold uppercase">{paymentMethod}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Total Billed:</span>
            <span className="text-slate-900 font-black text-sm">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentView('orders')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status Live</span>
          </button>
          <button
            onClick={() => {
              setPlacedOrderNumber(null);
              setCurrentView('catalog');
            }}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-800">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="text-xs text-slate-500 hover:text-amber-600 font-bold flex items-center space-x-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            Secure Checkout
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 font-bold">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Delivery Notice for Gopalganj, Bihar */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center space-x-2.5 text-xs text-amber-900 font-bold">
            <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Delivery Notice: Delivery is exclusively available within Gopalganj, Bihar.</span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-100">
            <button
              onClick={() => setStep('address')}
              className={`flex items-center space-x-2 font-bold ${
                step === 'address' ? 'text-amber-600' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'address' ? 'bg-amber-500 text-white font-bold' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </span>
              <span>Delivery Details</span>
            </button>

            <span className="text-slate-300">————</span>

            <button
              onClick={() => setStep('payment')}
              className={`flex items-center space-x-2 font-bold ${
                step === 'payment' ? 'text-amber-600' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'payment' ? 'bg-amber-500 text-white font-bold' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </span>
              <span>Payment Option</span>
            </button>
          </div>

          {step === 'address' ? (
            <form onSubmit={handleAddressSubmit} className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <MapPin className="w-4 h-4 text-amber-600 mr-2" />
                Shipping & Site Installation Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Recipient / Contractor name"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Address (House/Flat/Plot/Street) *</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Plot/Flat number, building name, street"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Continue to Payment Selection
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                  <CreditCard className="w-4 h-4 text-amber-600 mr-2" />
                  Select Payment Method
                </h3>
                <button
                  onClick={() => setStep('address')}
                  className="text-xs text-amber-600 hover:underline font-bold"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                {/* UPI */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <QrCode className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Instant UPI / QR / Google Pay / PhonePe</h4>
                        <p className="text-[11px] text-slate-500">Fastest processing & priority warehouse allocation</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Zero Fee
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2">
                      <label className="block text-[11px] text-slate-600 font-medium">Enter UPI ID</label>
                      <input
                        type="text"
                        placeholder="e.g. 9876543210@paytm or contractor@okhdfc"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Credit / Debit Card</h4>
                      <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Amex</p>
                    </div>
                  </div>
                </div>

                {/* COD */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-slate-500">Pay cash or UPI upon package inspection at your delivery site</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setStep('address')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order in Firestore...' : `Confirm & Pay ₹${total.toLocaleString('en-IN')}`}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Order Items ({cart.length})
          </h3>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.map((item, idx) => (
              <div key={`checkout-${item.product.id || idx}-${idx}`} className="py-2.5 flex items-center space-x-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 font-bold truncate">{item.product.name}</p>
                  <p className="text-[10px] text-slate-400">
                    Qty: {item.quantity} • ₹{item.product.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="font-extrabold text-slate-900">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-slate-600 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>18% Electrical GST</span>
              <span>₹{taxGst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>Grand Total</span>
              <span className="text-amber-600 text-base">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
