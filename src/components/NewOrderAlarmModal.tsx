import React from 'react';
import { BellRing, Phone, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NewOrderAlarmModal: React.FC = () => {
  const { newOrderAlert, isOrderAlarmActive, acknowledgeOrderAlarm, setCurrentView } = useStore();

  if (!isOrderAlarmActive && !newOrderAlert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-heavy rounded-3xl border-2 border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.35)] p-6 sm:p-8 text-slate-100 space-y-5 animate-pulse-subtle">
        
        {/* Pulsing Strobe Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/40">
                🚨 LOUD ALARM ACTIVE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-0.5">
                New Order Received!
              </h2>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 animate-bounce shadow-lg">
            <BellRing className="w-7 h-7" />
          </div>
        </div>

        {/* Order Details Banner */}
        {newOrderAlert && (
          <div className="glass-panel border border-red-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Reference</p>
                <p className="font-mono text-base font-black text-white">{newOrderAlert.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                <p className="text-lg font-black text-amber-400">₹{newOrderAlert.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-3 glass-panel-subtle rounded-xl border border-white/10 flex items-center justify-between text-xs">
              <div>
                <p className="font-black text-white">{newOrderAlert.customerName}</p>
                <p className="text-slate-400 text-[11px]">{newOrderAlert.shippingAddress?.addressLine1}, {newOrderAlert.shippingAddress?.city}</p>
              </div>
              {newOrderAlert.customerPhone && (
                <a
                  href={`tel:${newOrderAlert.customerPhone}`}
                  className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 rounded-lg font-bold text-[11px] flex items-center space-x-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              )}
            </div>

            {/* Items count */}
            <div className="text-xs text-slate-300 flex items-center justify-between">
              <span>Items: <strong className="text-white">{newOrderAlert.items?.length || 0} component(s)</strong></span>
              <span className="font-mono text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold uppercase">
                {newOrderAlert.paymentMethod}
              </span>
            </div>
          </div>
        )}

        {/* Alarm Notice */}
        <p className="text-xs text-center text-red-400 font-bold animate-pulse">
          ⚠️ Siren will keep looping loudly until acknowledged!
        </p>

        {/* PRIMARY ACTION: "I KNOW ORDER" (STOP ALARM) */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              acknowledgeOrderAlarm();
              setCurrentView('admin');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-2xl shadow-red-600/40 flex items-center justify-center space-x-3 active:scale-95 transition-all transform border border-red-400/50 cursor-pointer"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>I KNOW ORDER</span>
          </button>

          <button
            onClick={acknowledgeOrderAlarm}
            className="w-full py-2.5 text-center text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Mute Alarm & Stay on Screen
          </button>
        </div>

      </div>
    </div>
  );
};
