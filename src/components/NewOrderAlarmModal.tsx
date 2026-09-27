import React from 'react';
import { BellRing, Volume2, Phone, Package, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NewOrderAlarmModal: React.FC = () => {
  const { newOrderAlert, isOrderAlarmActive, acknowledgeOrderAlarm, setCurrentView } = useStore();

  if (!isOrderAlarmActive && !newOrderAlert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-red-500 shadow-2xl p-6 sm:p-8 text-slate-800 space-y-5 animate-pulse-subtle">
        
        {/* Pulsing Strobe Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-red-200">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600"></span>
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-red-600 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                LOUD ALARM ACTIVE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-0.5">
                New Order Received!
              </h2>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 animate-bounce">
            <BellRing className="w-7 h-7" />
          </div>
        </div>

        {/* Order Details Banner */}
        {newOrderAlert && (
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Order Reference</p>
                <p className="font-mono text-base font-black text-slate-900">{newOrderAlert.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Amount</p>
                <p className="text-lg font-black text-emerald-700">₹{newOrderAlert.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-red-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-black text-slate-900">{newOrderAlert.customerName}</p>
                <p className="text-slate-500 text-[11px]">{newOrderAlert.shippingAddress?.addressLine1}, {newOrderAlert.shippingAddress?.city}</p>
              </div>
              {newOrderAlert.customerPhone && (
                <a
                  href={`tel:${newOrderAlert.customerPhone}`}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center space-x-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              )}
            </div>

            {/* Items count */}
            <div className="text-xs text-slate-600 flex items-center justify-between">
              <span>Items: <strong>{newOrderAlert.items?.length || 0} component(s)</strong></span>
              <span className="font-mono text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold uppercase">
                {newOrderAlert.paymentMethod}
              </span>
            </div>
          </div>
        )}

        {/* Alarm Notice */}
        <p className="text-xs text-center text-red-600 font-bold animate-pulse">
          ⚠️ Alarm will keep ringing continuously until acknowledged!
        </p>

        {/* PRIMARY ACTION: "I KNOW ORDER" (STOP ALARM) */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              acknowledgeOrderAlarm();
              setCurrentView('admin');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center space-x-3 active:scale-95 transition-all transform border-2 border-red-400 cursor-pointer"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>I KNOW ORDER</span>
          </button>

          <button
            onClick={acknowledgeOrderAlarm}
            className="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Mute Alarm & Stay on Screen
          </button>
        </div>

      </div>
    </div>
  );
};
