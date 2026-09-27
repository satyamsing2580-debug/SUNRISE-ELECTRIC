import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Download, 
  Calendar
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus } from '../types';

export const OrderTracking: React.FC = () => {
  const { orders, loadingOrders, setCurrentView } = useStore();
  const { currentUser, userProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const displayedOrders = orders.filter((order) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.customerPhone.includes(q)
      );
    }
    return true;
  });

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || displayedOrders[0] || null;

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Order received & logged' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Warehouse inventory reserved' },
    { key: 'dispatched', label: 'Dispatched', desc: 'In transit via Express Logistics' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier rider on the route' },
    { key: 'delivered', label: 'Delivered', desc: 'Verified delivery to customer' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.key === status);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Live Order Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates synced with Firestore • Instant GST invoices & courier tracking.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search Order Number (e.g. SUN-123456)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {loadingOrders ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Checking Firestore for orders...</p>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed an order yet, or no orders matched your search criteria.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
          >
            Browse Products & Place Order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Orders History ({displayedOrders.length})
            </span>

            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {displayedOrders.map((ord, idx) => {
                const isSelected = activeOrder?.id === ord.id;
                return (
                  <div
                    key={`track-ord-${ord.id || ord.orderNumber || idx}`}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {ord.items.map((i) => i.name).join(', ')}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      <span className="font-black text-slate-900">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Order Details & Timeline */}
          {activeOrder && (
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Order ID:</span>
                    <span className="text-base font-black font-mono text-slate-900">
                      {activeOrder.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 uppercase">
                      {activeOrder.groupId === 'gopalganj-store' ? 'Gopalganj Hub' : activeOrder.groupId || 'Direct Store'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Placed on {new Date(activeOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    alert(`Sunrise Electricals Tax Receipt\nOrder: ${activeOrder.orderNumber}\nCustomer: ${activeOrder.customerName}\nAmount: ₹${activeOrder.totalAmount}\nGST 18% included (₹${activeOrder.taxGst})\nGSTIN: 07AAACS9821P1ZT`);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Download GST Bill</span>
                </button>
              </div>

              {/* Progress Tracker */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-6">
                  Live Dispatch & Delivery Timeline
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {steps.map((st, index) => {
                    const activeIndex = getStepIndex(activeOrder.orderStatus);
                    const isCompleted = activeIndex >= index;
                    const isCurrent = activeIndex === index;

                    return (
                      <div key={st.key} className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center sm:justify-start justify-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-amber-500 text-white ring-4 ring-amber-200 shadow-md'
                                  : 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {st.label}
                          </p>
                          <p className="text-[10px] text-slate-500 hidden sm:block">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transit Log */}
              {activeOrder.trackingUpdates && activeOrder.trackingUpdates.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                    Real-time Transit Log
                  </h4>
                  <div className="space-y-2 divide-y divide-slate-200">
                    {activeOrder.trackingUpdates.map((upd, i) => (
                      <div key={i} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{upd.title}</p>
                          <p className="text-[11px] text-slate-500">{upd.description}</p>
                          {upd.location && (
                            <span className="text-[10px] text-slate-400 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                              {upd.location}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-4">
                          {new Date(upd.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Ordered Items ({activeOrder.items.length})
                  </h4>
                  <div className="space-y-2">
                    {activeOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <img src={it.image} alt={it.name} className="w-10 h-10 rounded-lg object-cover bg-white" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{it.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {it.brand} • Qty: {it.quantity}
                          </p>
                        </div>
                        <span className="font-black text-slate-900">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Delivery Address
                  </h4>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div>
                      <p className="text-slate-400 text-[10px]">Recipient</p>
                      <p className="text-slate-900 font-bold">{activeOrder.shippingAddress.fullName}</p>
                      <p className="text-slate-600 text-[11px]">Phone: {activeOrder.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Site Address</p>
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        {activeOrder.shippingAddress.addressLine1}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between">
                      <span className="text-slate-500">Payment:</span>
                      <span className="text-amber-700 font-black uppercase">{activeOrder.paymentMethod} ({activeOrder.paymentStatus})</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
