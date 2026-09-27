import React from 'react';
import { MapPin, Truck, AlertCircle, Phone, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DeliveryNoticeBanner: React.FC = () => {
  const { setIsContactModalOpen } = useStore();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white p-3.5 sm:p-4 shadow-lg shadow-amber-500/15 border border-amber-400/40">
        
        {/* Subtle background glow effect */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          
          {/* Main Delivery Notice */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-inner">
              <Truck className="w-5 h-5 text-white animate-bounce-subtle" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-white text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                  Important Notice
                </span>
                <span className="flex items-center text-xs text-amber-100 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-0.5 text-yellow-200 flex-shrink-0" />
                  Local Service
                </span>
              </div>
              
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white mt-0.5">
                Delivery Available in Gopalganj, Bihar Only
              </h2>
              
              <p className="text-[11px] text-amber-100 font-medium hidden sm:block">
                Orders delivered directly to your doorstep or site within 24-48 hours. Free express shipping on orders over ₹1,999!
              </p>
            </div>
          </div>

          {/* Action / Contact pill */}
          <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
            <a
              href="tel:7488623614"
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs flex items-center space-x-1.5 border border-white/25 active:scale-95 transition-transform"
            >
              <Phone className="w-3 h-3 text-amber-200" />
              <span>Call Hub</span>
            </a>
            
            <a
              href="https://wa.me/917488623614?text=Hello%20Sunrise%20Electricals%2C%20I%20have%20a%20delivery%20inquiry%20for%20Gopalganj."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95 transition-transform"
            >
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
