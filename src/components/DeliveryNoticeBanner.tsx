import React from 'react';
import { MapPin, Truck, Phone, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DeliveryNoticeBanner: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div className="relative overflow-hidden rounded-2xl glass-panel p-3.5 sm:p-4 border border-amber-400/30 shadow-[0_8px_32px_rgba(245,158,11,0.15)]">
        
        {/* Subtle background glow effect */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          
          {/* Main Delivery Notice */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl glass-panel-subtle border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-md">
              <Truck className="w-5 h-5 animate-bounce-subtle" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="glass-panel-subtle text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-amber-400/30">
                  Regional Service Notice
                </span>
                <span className="flex items-center text-xs text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-0.5 text-amber-400 flex-shrink-0" />
                  Gopalganj District
                </span>
              </div>
              
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white mt-0.5 font-display">
                Delivery Available in Gopalganj, Bihar Only
              </h2>
              
              <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                Orders delivered directly to your doorstep or site within 24-48 hours. Free express shipping on orders over ₹1,999!
              </p>
            </div>
          </div>

          {/* Action / Contact buttons */}
          <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
            <a
              href="tel:7488623614"
              className="px-3.5 py-1.5 rounded-xl glass-btn text-white font-bold text-xs flex items-center space-x-1.5 active:scale-95 transition-transform"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Hub</span>
            </a>
            
            <a
              href="https://wa.me/917488623614?text=Hello%20Sunrise%20Electricals%2C%20I%20have%20a%20delivery%20inquiry%20for%20Gopalganj."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-black text-xs flex items-center space-x-1.5 shadow-[0_0_12px_rgba(16,185,129,0.25)] active:scale-95 transition-transform"
            >
              <span>WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
