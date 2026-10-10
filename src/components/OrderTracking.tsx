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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/20">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Live Order Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
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
            className="w-full glass-input rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {loadingOrders ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto shadow-md" />
          <p className="text-xs text-slate-400">Checking Firestore for orders...</p>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-white/20 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full glass-panel-subtle flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">No orders found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't placed an order yet, or no orders matched your search criteria.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-5 py-2.5 glass-btn-primary text-white font-bold text-xs rounded-xl shadow-lg"
          >
            Browse Products & Place Order
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
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
                        ? 'bg-amber-500/20 border-amber-400 shadow-xl ring-1 ring-amber-400'
                        : 'glass-card border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-white">
                        {ord.orderNumber}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      }`}>
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-300 truncate">
                      {ord.items.map((i) => i.name).join(', ')}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-[11px] text-slate-400">
                      <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      <span className="font-black text-amber-400">
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
            <div className="lg:col-span-8 glass-panel border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              {/* Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/20 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Order ID:</span>
                    <span className="text-base font-black font-mono text-white">
                      {activeOrder.orderNumber}
                    </span>
                    <span className="text-[10px] font-bold glass-panel-subtle text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 uppercase">
                      {activeOrder.groupId === 'gopalganj-store' ? 'Gopalganj Hub' : activeOrder.groupId || 'Direct Store'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Placed on {new Date(activeOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    alert(`Sunrise Electricals Tax Receipt\nOrder: ${activeOrder.orderNumber}\nCustomer: ${activeOrder.customerName}\nAmount: ₹${activeOrder.totalAmount}\nGST 18% included (₹${activeOrder.taxGst})\nGSTIN: 07AAACS9821P1ZT`);
                  }}
                  className="px-3.5 py-2 glass-btn text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-white/15"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download GST Bill</span>
                </button>
              </div>

              {/* Progress Tracker */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">
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
                                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/40 shadow-lg'
                                  : 'bg-emerald-500 text-white'
                                : 'glass-panel-subtle text-slate-500'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                            {st.label}
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">
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
                <div className="p-4 rounded-2xl glass-panel-subtle border border-white/10 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    Real-time Transit Log
                  </h4>
                  <div className="space-y-2 divide-y divide-white/10">
                    {activeOrder.trackingUpdates.map((upd, i) => (
                      <div key={i} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{upd.title}</p>
                          <p className="text-[11px] text-slate-400">{upd.description}</p>
                          {upd.location && (
                            <span className="text-[10px] text-slate-400 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1 text-amber-400" />
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

              {/* Items & Address in Frosted Glass */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Items in Shipment
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {activeOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-xl glass-panel-subtle border border-white/5">
                        <span className="truncate pr-2 font-medium text-white">{it.name} × {it.quantity}</span>
                        <span className="font-bold text-amber-400 flex-shrink-0">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Delivery Destination & Receiver
                  </h4>
                  <div className="p-3.5 rounded-2xl glass-panel-subtle border border-white/10 space-y-1.5 text-xs text-slate-300">
                    <p className="font-bold text-white">{activeOrder.shippingAddress?.fullName || activeOrder.customerName}</p>
                    <p>{activeOrder.shippingAddress?.addressLine1}</p>
                    <p>{activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.state} - {activeOrder.shippingAddress?.pincode}</p>
                    <p className="text-slate-400 font-mono text-[11px] pt-1">
                      Phone: {activeOrder.customerPhone}
                    </p>
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
