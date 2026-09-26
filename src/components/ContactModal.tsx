import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2,
  Zap
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsContactModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 font-display">
              Contact Sunrise Electricals
            </h2>
            <p className="text-xs text-slate-500">
              Direct hotline for wholesale inquiries, site quotations & support.
            </p>
          </div>
        </div>

        {/* Quick Contact Numbers Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="tel:+917488623614"
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Call</p>
              <p className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                +91 7488623614
              </p>
            </div>
          </a>

          <a
            href="https://wa.me/917488623614?text=Hi%20Sunrise%20Electricals,%20I%20have%20an%20inquiry%20regarding%20electrical%20supplies"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 transition-colors flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">WhatsApp Order</p>
              <p className="text-xs font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                +91 7488623614
              </p>
            </div>
          </a>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-900 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold">Inquiry Transmitted Successfully!</h4>
            <p className="text-xs text-emerald-700">
              Our store team will contact you at <strong>{phone}</strong> shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="Contractor / Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 7488623614"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Message / Requirements</label>
              <textarea
                rows={3}
                placeholder="Tell us about your electrical wiring, modular switches, or lighting project..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message to Electrical Engineers</span>
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Mon-Sat: 9:00 AM - 8:30 PM
          </span>
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            Gopalganj
          </span>
        </div>

      </div>
    </div>
  );
};
