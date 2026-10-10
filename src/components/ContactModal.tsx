import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsContactModalOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg glass-panel-heavy border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsContactModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full glass-btn text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl glass-panel-subtle border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-display">
              Contact Sunrise Electricals
            </h2>
            <p className="text-xs text-slate-400">
              Direct hotline for wholesale inquiries, site quotations & support.
            </p>
          </div>
        </div>

        {/* Quick Contact Numbers Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="tel:+917488623614"
            className="p-3.5 rounded-2xl glass-card flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-xl glass-btn-primary flex items-center justify-center font-bold text-white shadow-md">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Call</p>
              <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                +91 7488623614
              </p>
            </div>
          </a>

          <a
            href="https://wa.me/917488623614?text=Hi%20Sunrise%20Electricals,%20I%20have%20an%20inquiry%20regarding%20electrical%20supplies"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl glass-card flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold shadow-md">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">WhatsApp Order</p>
              <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                +91 7488623614
              </p>
            </div>
          </a>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="p-6 bg-emerald-500/15 border border-emerald-400/30 rounded-2xl text-center space-y-2 text-emerald-300 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold">Inquiry Transmitted Successfully!</h4>
            <p className="text-xs text-slate-300">
              Our store team will contact you at <strong>{phone}</strong> shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="Contractor / Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-white text-xs placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 7488623614"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-white text-xs placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Message / Requirements</label>
              <textarea
                rows={3}
                placeholder="Tell us about your electrical wiring, modular switches, or lighting project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-white text-xs placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 glass-btn-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center space-x-2 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message to Electrical Engineers</span>
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Mon-Sat: 9:00 AM - 8:30 PM
          </span>
          <span className="flex items-center text-slate-300 font-bold">
            <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" />
            LAKHAPATIYA MORE, GOPALGANJ
          </span>
        </div>

      </div>
    </div>
  );
};
