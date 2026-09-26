import React from 'react';
import { 
  Sun, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  MapPin, 
  Phone, 
  Mail, 
  Award,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setFilter, setIsAdminLoginModalOpen, setIsContactModalOpen } = useStore();
  const { isAdmin } = useAuth();

  const handleCategoryNav = (catName: string) => {
    setFilter('category', catName);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto">
      
      {/* 4 Feature Pillars */}
      <div className="border-b border-slate-200/80 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">100% Genuine ISI</h4>
              <p className="text-[11px] text-slate-500">Direct factory warranty seals</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Express Delivery</h4>
              <p className="text-[11px] text-slate-500">Free on orders above ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">10-Yr Guarantee</h4>
              <p className="text-[11px] text-slate-500">Manufacturer backed cover</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Contractor Support</h4>
              <p className="text-[11px] text-slate-500">Free site electrical estimates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-display">
                SUNRISE ELECTRICALS
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Sunrise Electricals is an authorized dealer of luxury modular switches, copper wiring, architectural magnetic track lighting, and energy-saving BLDC fans.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Gopalganj</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Customer Care & WhatsApp: +91 7488623614</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Sales: sales@sunriseelectricals.com</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Departments</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button 
                  onClick={() => handleCategoryNav('Modular Switches & Plates')}
                  className="hover:text-amber-600 transition-colors"
                >
                  Modular Switches & Plates
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('Wires & Flexible Cables')}
                  className="hover:text-amber-600 transition-colors"
                >
                  Polycab & Havells Wires
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('Architectural & Luxury Lighting')}
                  className="hover:text-amber-600 transition-colors"
                >
                  Architectural Track Lights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('BLDC Smart Fans & Ventilation')}
                  className="hover:text-amber-600 transition-colors"
                >
                  BLDC Energy Saving Fans
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryNav('Switchgear & Power Protection')}
                  className="hover:text-amber-600 transition-colors"
                >
                  MCBs & Industrial RCCB
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Quick Links</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button 
                  onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-600 transition-colors"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-600 transition-colors"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-600 transition-colors"
                >
                  Track Live Orders
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="hover:text-amber-600 transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                {isAdmin ? (
                  <button 
                    onClick={() => { setCurrentView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Super Admin Dashboard
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsAdminLoginModalOpen(true)}
                    className="hover:text-amber-600 transition-colors flex items-center"
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    <span>Admin Portal</span>
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* WhatsApp Order & Contractor Quotations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Direct Orders</h4>
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 leading-normal">
                Direct WhatsApp ordering available for contractors, electricians, and homeowners.
              </p>
              <a
                href="https://wa.me/917488623614?text=Hello%20Sunrise%20Electricals%2C%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center shadow-sm flex items-center justify-center space-x-1.5"
              >
                <span>WhatsApp Order: +91 7488623614</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Sunrise Electricals. Authorized Dealer. Gopalganj.</p>
          <div className="flex items-center space-x-4">
            <span className="font-bold text-slate-800">Owner: Ashish Singh</span>
            <span>•</span>
            <button 
              onClick={() => setIsAdminLoginModalOpen(true)} 
              className="text-slate-500 hover:text-amber-600 flex items-center"
            >
              <Lock className="w-3 h-3 mr-1" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
