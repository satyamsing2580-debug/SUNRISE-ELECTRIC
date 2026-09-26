import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { Product } from './types';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Star
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    products, 
    setFilter 
  } = useStore();

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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Clean top Navbar with zero extra headings above */}
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {/* Hero Section */}
            <HeroBanner />

            {/* Featured Products Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-amber-700 text-xs font-black uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Handpicked Collection</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    Featured Electrical Innovations
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Top trending modular switches, fire-retardant wiring, and luxury magnetic fixtures
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFilter('category', 'All');
                    setCurrentView('catalog');
                  }}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((prod, idx) => (
                  <ProductCard key={`feat-${prod.id}-${idx}`} product={prod} />
                ))}
              </div>
            </section>

            {/* Premium BLDC Feature Spotlight */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-50 via-white to-amber-100/60 border border-amber-200/80 p-8 sm:p-12 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <span className="text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      BLDC Power Revolution
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">
                      Save Up to 65% on Electricity with Smart 28W BLDC Fans
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                      Upgrade standard 75W ceiling fans to brushless direct-current technology. 
                      Atomberg & Crompton BLDC models run 3x longer on home inverters, deliver 
                      whisper-quiet 52dB aerodynamics, and come with a 3-year warranty.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setFilter('category', 'BLDC Smart Fans & Ventilation');
                          setCurrentView('catalog');
                        }}
                        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md shadow-amber-500/20"
                      >
                        <span>View BLDC Fans Range</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex justify-center">
                    <div className="relative rounded-2xl overflow-hidden aspect-square w-64 border border-slate-200 shadow-xl bg-white">
                      <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                        alt="BLDC Smart Fan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Sellers Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center space-x-2 text-amber-700 text-xs font-black uppercase tracking-wider mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Contractor Favorites</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    Best-Selling Electrical Hardware
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setFilter('category', 'All');
                    setCurrentView('catalog');
                  }}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                >
                  <span>See More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((prod, idx) => (
                  <ProductCard key={`best-${prod.id}-${idx}`} product={prod} />
                ))}
              </div>
            </section>

            {/* Testimonials from Contractors & Homeowners */}
            <section className="bg-white border-t border-b border-slate-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                    Authentic Electrical Showroom • Gopalganj
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    What Contractors & Builders Say
                  </h2>
                  <p className="text-xs text-slate-500">
                    From luxury residences to commercial high-rises.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "Sunrise Electricals supplied authentic Legrand Arteor plates and Polycab FR wires for our 4-villa project. All coils came with batch test reports and GST billing. Prompt next-day delivery."
                    </p>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">Ar. Vikram Mehra</p>
                      <p className="text-[10px] text-slate-500">Principal Architect, Mehra Design Studio</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "Their real-time order tracking and warehouse stock accuracy is unmatched in the electrical sector. Never had a counterfeit switch or broken crystal fixture."
                    </p>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">Rajeev K. Sharma</p>
                      <p className="text-[10px] text-slate-500">Senior Electrical Contractor, Sector 150</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "The magnetic track lighting system by Philips is phenomenal. Sunrise's engineering team helped calculate the lumen requirements and driver wattage accurately."
                    </p>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">Pooja Singhania</p>
                      <p className="text-[10px] text-slate-500">Interior Stylist & Homeowner</p>
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
      <AdminLoginModal />
      <ContactModal />
      <Footer />
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
