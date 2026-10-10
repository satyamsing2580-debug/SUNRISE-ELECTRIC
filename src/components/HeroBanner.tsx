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
    <div className="relative overflow-hidden pt-8 pb-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Frosted Glass Hero Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Frosted Glass Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel-subtle border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL WHOLESALE & ARCHITECTURAL STORE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] font-display">
              Smart & Luxury Power with <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(245,158,11,0.4)]">
                Sunrise Electricals
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              India’s premier authorized supplier of high-conductivity electrolytic copper wiring, 
              tempered glass modular plates, architectural track lights, and 28W energy-saving BLDC fans.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  setFilter('category', 'All');
                  setCurrentView('catalog');
                }}
                className="glass-btn-primary px-7 py-3.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_4px_25px_rgba(245,158,11,0.4)] active:scale-95"
              >
                <span>Explore Complete Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setFilter('category', 'Architectural & Luxury Lighting');
                  setCurrentView('catalog');
                }}
                className="glass-btn px-6 py-3.5 rounded-xl text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Designer Lighting</span>
              </button>
            </div>

            {/* Frosted Trust Badges Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-300">
              <div className="flex items-center space-x-2 p-2.5 rounded-xl glass-panel-subtle border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Genuine ISI</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-xl glass-panel-subtle border border-white/20">
                <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Fast Express Dispatch</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-xl glass-panel-subtle border border-white/20">
                <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>10-Yr Brand Warranty</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-xl glass-panel-subtle border border-white/20">
                <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Real-Time Tracking</span>
              </div>
            </div>

          </div>

          {/* Right Showcase Glass Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-white/25 via-white/10 to-amber-500/25 shadow-2xl backdrop-blur-xl">
              <div className="glass-panel-heavy rounded-[22px] overflow-hidden p-6 relative border border-white/20">
                
                {/* Top Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 glass-panel-subtle px-3 py-1 rounded-full border border-amber-400/30 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    Editor’s Choice Collection
                  </span>
                  <span className="text-xs text-emerald-400 font-bold glass-panel-subtle px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    In Stock
                  </span>
                </div>

                {/* Hero Showcase Image with Glass Overlay */}
                <div 
                  className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 group cursor-pointer border border-white/15 shadow-xl"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">Legrand & Havells</p>
                    <h3 className="text-lg font-bold leading-tight">French Mirror Glass Plates & Tactile Switches</h3>
                    <p className="text-xs text-slate-300 mt-1">Starting from ₹1,890 • 100,000 Operations Tested</p>
                  </div>
                </div>

                {/* 3 Quick Frosted Pillar Cards */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div 
                    onClick={() => handleCategoryClick('Wires & Flexible Cables')}
                    className="p-3 rounded-xl glass-card cursor-pointer"
                  >
                    <p className="font-extrabold text-amber-400 text-xs">Polycab Copper</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Flame Retardant</p>
                  </div>
                  <div 
                    onClick={() => handleCategoryClick('Architectural & Luxury Lighting')}
                    className="p-3 rounded-xl glass-card cursor-pointer"
                  >
                    <p className="font-extrabold text-amber-400 text-xs">Magnetic Tracks</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Anti-Glare 48V</p>
                  </div>
                  <div 
                    onClick={() => handleCategoryClick('BLDC Smart Fans & Ventilation')}
                    className="p-3 rounded-xl glass-card cursor-pointer"
                  >
                    <p className="font-extrabold text-amber-400 text-xs">BLDC Fans 28W</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Save 65% Power</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Categories Strip in Frosted Glass */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white font-display">
                Explore Electrical Categories
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Residential, commercial and industrial components with official ISI mark.
              </p>
            </div>
            <button
              onClick={() => {
                setFilter('category', 'All');
                setCurrentView('catalog');
              }}
              className="glass-btn px-3 py-1.5 rounded-xl text-xs text-amber-300 hover:text-white font-bold flex items-center space-x-1"
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
                className="group relative rounded-2xl overflow-hidden glass-card p-3 cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-slate-900/50 relative border border-white/20">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {cat.badge && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-md">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authorized Brands Frosted Bar */}
        <div className="mt-14 rounded-2xl glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl glass-panel-subtle border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wide">
                Direct Authorized Brand Partnerships
              </h4>
              <p className="text-[11px] text-slate-400">
                100% factory sealed hardware with official company serial numbers & GST invoice.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-extrabold text-xs uppercase tracking-wider">
            <span className="hover:text-amber-400 transition-colors">HAVELLS</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-400 transition-colors">POLYCAB</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-400 transition-colors">PHILIPS</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-400 transition-colors">LEGRAND</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-400 transition-colors">SCHNEIDER</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-400 transition-colors">ATOMBERG</span>
          </div>
        </div>

      </div>
    </div>
  );
};
