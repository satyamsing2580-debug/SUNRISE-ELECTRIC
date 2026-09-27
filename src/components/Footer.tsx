import React from 'react';
import { 
  Sun, 
  MapPin, 
  Phone, 
  Award,
  Lock,
  MessageSquare,
  Truck,
  Heart,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { setIsAdminLoginModalOpen } = useStore();
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto">
      
      {/* MOBILE-NATIVE APP FOOTER: Compact card with essential store actions */}
      <div className="md:hidden px-4 py-6 space-y-4">
        {/* App Info Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Sun className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white font-display">
                SUNRISE ELECTRICALS
              </span>
            </div>
            <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
              v2.4 App
            </span>
          </div>

          {/* Store Location */}
          <div className="flex items-center space-x-2 text-xs text-amber-200 font-bold bg-white/10 px-3 py-2 rounded-xl">
            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>LAKHAPATIYA MORE, GOPALGANJ</span>
          </div>

          {/* Front-page Delivery Notice */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-300 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
            <Truck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Delivery Available in Gopalganj, Bihar Only</span>
          </div>

          {/* Quick Action Touch Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="tel:7488623614"
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 active:scale-95 transition-transform"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Store</span>
            </a>
            <a
              href="https://wa.me/917488623614?text=Hello%20Sunrise%20Electricals%2C%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-transform"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Minimal Copyright and Admin shortcut */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-1">
          <span className="font-semibold">Sunrise Electricals • LAKHAPATIYA MORE, GOPALGANJ</span>
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="text-amber-700 font-bold hover:underline flex items-center space-x-1"
          >
            <Lock className="w-3 h-3" />
            <span>Owner Portal</span>
          </button>
        </div>

        {/* Clear Branding: BUILD BY WEBWALLA SATYAM */}
        <div className="text-center pt-2 pb-1 border-t border-slate-100">
          <p className="text-[11px] font-black tracking-widest text-slate-700 uppercase bg-slate-100/80 py-1.5 px-3 rounded-xl inline-block border border-slate-200 shadow-2xs">
            ⚡ BUILD BY WEBWALLA SATYAM ⚡
          </p>
        </div>
      </div>

      {/* DESKTOP FOOTER */}
      <div className="hidden md:block">
        <div className="border-b border-slate-200/80 bg-slate-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Award className="w-5 h-5 text-amber-600" />
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-xs">100% Genuine ISI Mark</h4>
                <p className="text-[11px] text-slate-500">Authorized Brand Warranty</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Truck className="w-5 h-5 text-amber-600" />
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-xs">Delivery in Gopalganj Only</h4>
                <p className="text-[11px] text-slate-500">Free Express on orders over ₹1,999</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-5 h-5 text-amber-600" />
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-xs">Contractor Assistance</h4>
                <p className="text-[11px] text-slate-500">Call / WhatsApp: +91 7488623614</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center font-black">
                <Sun className="w-4 h-4" />
              </div>
              <span className="font-black text-slate-800 text-sm">
                Sunrise Electricals • LAKHAPATIYA MORE, GOPALGANJ
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Delivery Available in Gopalganj, Bihar Only
              </span>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="hover:text-amber-600 font-bold flex items-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Access</span>
              </button>
            </div>
          </div>

          {/* Desktop Footer Branding */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <span>© {new Date().getFullYear()} Sunrise Electricals. All rights reserved.</span>
            <span className="font-black tracking-widest text-slate-800 uppercase bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
              BUILD BY WEBWALLA SATYAM
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};
