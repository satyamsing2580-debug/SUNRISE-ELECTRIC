import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Award, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setCurrentView, setFilter, categories } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setFilter('category', categoryName);
    setCurrentView('catalog');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-slate-50 pt-8 pb-14 border-b border-slate-200/80">
      {/* Subtle modern warm radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-b from-amber-200/25 via-orange-100/20 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>OFFICIAL WHOLESALE & ARCHITECTURAL ELECTRICAL STORE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] font-display">
              Smart & Luxury Power with <br />
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                Sunrise Electricals
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              India’s premier authorized supplier of high-conductivity electrolytic copper wiring, 
              tempered glass modular plates, architectural track lights, and 28W energy-saving BLDC fans.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => {
                  setFilter('category', 'All');
                  setCurrentView('catalog');
                }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md shadow-amber-500/25 active:scale-98"
              >
                <span>Explore Complete Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setFilter('category', 'Architectural & Luxury Lighting');
                  setCurrentView('catalog');
                }}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-300 hover:border-amber-400 transition-all shadow-sm flex items-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Designer Lighting</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Genuine ISI</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Fast Express Dispatch</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>10-Yr Brand Warranty</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>Real-Time Tracking</span>
              </div>
            </div>

          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-amber-200 via-slate-100 to-amber-100 shadow-xl border border-amber-200/60">
              <div className="bg-white rounded-[22px] overflow-hidden p-6 relative">
                
                {/* Top Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Editor’s Choice Collection
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    In Stock
                  </span>
                </div>

                {/* Hero Showcase Image */}
                <div 
                  className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 group cursor-pointer border border-slate-200 shadow-inner"
                  onClick={() => {
                    setFilter('category', 'Modular Switches & Plates');
                    setCurrentView('catalog');
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80"
                    alt="Luxury Modular Switches"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">Legrand & Havells</p>
                    <h3 className="text-lg font-bold leading-tight">French Mirror Glass Plates & Tactile Switches</h3>
                    <p className="text-xs text-slate-200 mt-1">Starting from ₹1,890 • 100,000 Operations Tested</p>
                  </div>
                </div>

                {/* 3 Quick Pillar Cards */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div 
                    onClick={() => handleCategoryClick('Wires & Flexible Cables')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 cursor-pointer transition-colors"
                  >
                    <p className="font-extrabold text-amber-700">Polycab Copper</p>
                    <p className="text-[10px] text-slate-500">Flame Retardant</p>
                  </div>
                  <div 
                    onClick={() => handleCategoryClick('Architectural & Luxury Lighting')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 cursor-pointer transition-colors"
                  >
                    <p className="font-extrabold text-amber-700">Magnetic Tracks</p>
                    <p className="text-[10px] text-slate-500">Anti-Glare 48V</p>
                  </div>
                  <div 
                    onClick={() => handleCategoryClick('BLDC Smart Fans & Ventilation')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 cursor-pointer transition-colors"
                  >
                    <p className="font-extrabold text-amber-700">BLDC Fans 28W</p>
                    <p className="text-[10px] text-slate-500">Save 65% Power</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Categories Strip */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                Explore Electrical Categories
              </h2>
              <p className="text-xs text-slate-500">
                Residential, commercial and industrial components with official ISI mark
              </p>
            </div>
            <button
              onClick={() => {
                setFilter('category', 'All');
                setCurrentView('catalog');
              }}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-400 p-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-slate-100 relative border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {cat.badge && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authorized Brands Bar */}
        <div className="mt-12 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Direct Authorized Brand Partnerships
              </h4>
              <p className="text-[11px] text-slate-500">
                100% factory sealed hardware with official company serial numbers & GST invoice.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-extrabold text-xs uppercase tracking-wider">
            <span className="hover:text-amber-600 transition-colors">HAVELLS</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-amber-600 transition-colors">POLYCAB</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-amber-600 transition-colors">PHILIPS</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-amber-600 transition-colors">LEGRAND</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-amber-600 transition-colors">SCHNEIDER</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-amber-600 transition-colors">ATOMBERG</span>
          </div>
        </div>

      </div>
    </div>
  );
};
