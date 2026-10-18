import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductCatalog } from './components/ProductCatalog';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracking } from './components/OrderTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { WishlistPage } from './components/WishlistPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallAppPrompt } from './components/InstallAppPrompt';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';
import { DeliveryNoticeBanner } from './components/DeliveryNoticeBanner';
import { NewOrderAlarmModal } from './components/NewOrderAlarmModal';
import { Product } from './types';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Star,
  Zap,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    products, 
    setFilter 
  } = useStore();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const featuredProducts = React.useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      if (p.isFeatured && !map.has(p.id)) {
        map.set(p.id, p);
      }
    }
    return Array.from(map.values()).slice(0, 8);
  }, [products]);

  const bestSellers = React.useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      if (p.isBestSeller && !map.has(p.id)) {
        map.set(p.id, p);
      }
    }
    return Array.from(map.values()).slice(0, 4);
  }, [products]);

  return (
    <div className="relative min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white pb-24 lg:pb-0 overflow-x-hidden">
      
      {/* Soft Multi-Colored Neon Gradient Glowing Background Blobs (Frosted Canvas Underlay) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blob 1: Vibrant Golden-Amber Orb */}
        <div className="absolute -top-32 -left-32 w-[580px] h-[580px] bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-yellow-500/10 rounded-full blur-[120px] animate-blob-1" />
        
        {/* Blob 2: Neon Cyan / Electric Sky Orb */}
        <div className="absolute top-[20%] -right-32 w-[620px] h-[620px] bg-gradient-to-bl from-cyan-400/25 via-sky-500/20 to-blue-600/15 rounded-full blur-[130px] animate-blob-2" />
        
        {/* Blob 3: Deep Royal Purple / Magenta Orb */}
        <div className="absolute top-[50%] -left-20 w-[640px] h-[640px] bg-gradient-to-tr from-fuchsia-600/25 via-purple-600/20 to-indigo-700/15 rounded-full blur-[140px] animate-blob-3" />
        
        {/* Blob 4: Emerald / Electric Teal Accent Orb */}
        <div className="absolute -bottom-32 right-[10%] w-[550px] h-[550px] bg-gradient-to-t from-emerald-400/20 via-teal-500/15 to-cyan-600/10 rounded-full blur-[125px] animate-blob-1" />

        {/* Blob 5: Ambient Center Amber/Violet Glow */}
        <div className="absolute top-[42%] right-[25%] w-[480px] h-[480px] bg-gradient-to-r from-amber-500/15 to-violet-600/15 rounded-full blur-[140px] animate-blob-2" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Network Status Banner */}
        <NetworkStatusIndicator />

        {/* Frosted Glass Navbar */}
        <Navbar />

        <main className="flex-1">
          {currentView === 'home' && (
            <div>
              {/* Delivery Notice Banner */}
              <DeliveryNoticeBanner />

              {/* Dynamic Glassmorphic Hero Section */}
              <HeroBanner />

              {/* Featured Products Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Curated Glass Architecture</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
                      Featured Electrical Innovations
                    </h2>
                    <p className="text-sm text-slate-300 mt-1">
                      Touch glass modular switches, flame-retardant wiring, and luxury magnetic fixtures.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFilter('category', 'All');
                      setCurrentView('catalog');
                    }}
                    className="glass-btn px-4 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:text-white flex items-center space-x-2 self-start sm:self-auto transition-all"
                  >
                    <span>Explore Full Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>

                {/* Grid of Frosted Glass Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {featuredProducts.map((prod, idx) => (
                    <ProductCard key={`feat-${prod.id}-${idx}`} product={prod} />
                  ))}
                </div>
              </section>

              {/* Frosted Glass BLDC Feature Spotlight */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-white/20 shadow-2xl">
                  {/* Subtle ambient internal glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel-subtle border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>BLDC Energy Revolution</span>
                      </div>
                      
                      <h3 className="text-2xl sm:text-4xl font-black text-white font-display leading-tight">
                        Save Up to 65% on Electricity with Smart 28W BLDC Fans
                      </h3>
                      
                      <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                        Upgrade standard 75W ceiling fans to brushless direct-current technology. 
                        Atomberg & Crompton BLDC models run 3x longer on home inverters, deliver 
                        whisper-quiet 52dB aerodynamics, and come with a 3-year warranty.
                      </p>

                      <div className="pt-2 flex flex-wrap gap-4 items-center">
                        <button
                          onClick={() => {
                            setFilter('category', 'BLDC Smart Fans & Ventilation');
                            setCurrentView('catalog');
                          }}
                          className="glass-btn-primary px-6 py-3.5 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95"
                        >
                          <span>View BLDC Fans Range</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Runs on Solar & Inverters</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex justify-center">
                      <div className="relative rounded-2xl overflow-hidden aspect-square w-64 glass-panel border border-white/20 shadow-2xl group">
                        <img
                          src="/src/assets/images/bldc_fan_1792312935371.jpg"
                          alt="BLDC Smart Fan"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-center">
                          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                            28 Watt High-Torque BLDC
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Best Sellers Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Contractor Favorites</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
                      Best-Selling Electrical Hardware
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setFilter('category', 'All');
                      setCurrentView('catalog');
                    }}
                    className="glass-btn px-4 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-white flex items-center space-x-1"
                  >
                    <span>See More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {bestSellers.map((prod, idx) => (
                    <ProductCard key={`best-${prod.id}-${idx}`} product={prod} />
                  ))}
                </div>
              </section>

              {/* Authentic Electrical Showroom Credentials & Standards (No Fake Reviews) */}
              <section className="relative py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Authorized Wholesale & Retail Showroom • Gopalganj, Bihar
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white font-display">
                      Electrical Trade & Safety Standards
                    </h2>
                    <p className="text-xs text-slate-300">
                      Supplying certified electrical infrastructure for residential, commercial & government projects.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl glass-card space-y-3 border border-white/20">
                      <div className="w-12 h-12 rounded-xl glass-panel-subtle border border-amber-400/30 flex items-center justify-center text-amber-400">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white">100% Genuine ISI & BIS Certified</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Every wire coil, circuit breaker, and modular plate is sourced directly from certified manufacturers with verified laboratory test certificates. No grey market or counterfeit items.
                      </p>
                      <div className="pt-2 text-[11px] font-bold text-amber-300">
                        Polycab • Havells • Legrand • Schneider
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl glass-card space-y-3 border border-white/20">
                      <div className="w-12 h-12 rounded-xl glass-panel-subtle border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white">GST Invoicing & Contractor Billing</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Instant GST compliant invoices with itemized HSN codes for seamless input tax credit (ITC) on all builder, architect, and commercial electrical contract purchases.
                      </p>
                      <div className="pt-2 text-[11px] font-bold text-emerald-400">
                        Full GST Input Credit Supported
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl glass-card space-y-3 border border-white/20">
                      <div className="w-12 h-12 rounded-xl glass-panel-subtle border border-sky-400/30 flex items-center justify-center text-sky-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white">Showroom & On-Site Replacement</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Physical authorized store located at Lakhapatiya More, Gopalganj. Instant exchange for manufacturing defects and direct brand warranty registration assistance.
                      </p>
                      <div className="pt-2 text-[11px] font-bold text-sky-300">
                        Proprietor: Ashish Singh • +91 7488623614
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentView === 'catalog' && <ProductCatalog />}
          {currentView === 'orders' && <OrderTracking />}
          {currentView === 'admin' && <AdminDashboard />}
          {currentView === 'wishlist' && <WishlistPage />}
          {currentView === 'checkout' && <CheckoutModal />}
        </main>

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <ProductModal />
        <NewOrderAlarmModal />
        <AdminLoginModal />
        <ContactModal />
        <Footer />

        {/* PWA Install Banner & Native Floating Mobile Dock */}
        <InstallAppPrompt />
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainContent />
      </StoreProvider>
    </AuthProvider>
  );
}
