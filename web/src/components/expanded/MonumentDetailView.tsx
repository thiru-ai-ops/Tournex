import React from 'react';
import { Landmark, Clock, Ticket, AlertCircle, Compass, ShieldAlert, Sparkles, BookOpen, Star } from 'lucide-react';

interface MonumentDetailViewProps {
  monumentName: string;
  cityName: string;
  image: string;
  onBack: () => void;
  onBookTicket: () => void;
}

export default function MonumentDetailView({ monumentName, cityName, image, onBack, onBookTicket }: MonumentDetailViewProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-left" id="monument-detail-root">
      {/* Hero Banner */}
      <div className="relative h-72 bg-slate-900 text-white flex items-end">
        <img 
          src={image || 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80&w=800'} 
          alt={monumentName} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 transition cursor-pointer text-xs font-bold"
        >
          ← Back
        </button>

        <div className="relative p-8 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-amber-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider py-0.5 px-2.5 rounded-full">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Archaeological Survey of India (ASI) Protected Monument</span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">{monumentName}</h2>
          <p className="text-slate-300 text-xs font-semibold">Location: {cityName}, Rajasthan</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Historical Legacy & Architectural Marvel</span>
            </h3>
            <p className="text-slate-650 text-xs leading-relaxed text-slate-600">
              Built in 1799 by Maharaja Sawai Pratap Singh, this monument stands as a unique five-story structure resembling the crown of Lord Krishna. Constructed with red and pink sandstone, it features 953 small windows (jharokhas) designed to allow royal women to observe daily street life without being seen, while creating a natural breeze system (Venturi effect) that cools the interior.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block font-mono font-bold">Standard Timings</span>
                <p className="text-slate-800 mt-1">9:00 AM — 5:00 PM</p>
                <span className="text-[8px] text-emerald-600 block mt-0.5">Open All Days</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start space-x-3">
              <Ticket className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block font-mono font-bold">Ticket Fares</span>
                <p className="text-slate-800 mt-1">₹50 (Indian Citizen)</p>
                <span className="text-[8px] text-slate-500 block mt-0.5">₹200 (Foreign Nationals)</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block font-mono font-bold">Dress Code</span>
                <p className="text-slate-800 mt-1">Smart Casuals</p>
                <span className="text-[8px] text-rose-500 block mt-0.5">No footwear inside shrines</span>
              </div>
            </div>
          </div>

          {/* Crowd density details */}
          <div className="bg-blue-50 border border-blue-150 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Star className="h-4 w-4 text-blue-600 fill-current" />
              <span>Smart Crowd Alert & Avoidance Advisory</span>
            </h4>
            <p className="text-xs text-slate-650 leading-relaxed text-slate-600">
              According to current tourist statistics, peak density occurs between 11:30 AM and 3:30 PM. The ideal time for peaceful exploration is immediately after opening at 9:00 AM, or during sunset. Average queues at the main ticket gate take 20–35 minutes; we recommend pre-booking e-tickets below.
            </p>
          </div>
        </div>

        {/* Sidebar Reservation Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4">
            <div>
              <span className="text-[9px] text-blue-400 font-mono font-bold block uppercase">E-Pass Reservation</span>
              <h4 className="font-display font-extrabold text-base mt-1">Fast-Track Entry Pass</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                Skip standard ticket counter queues and receive instant confirmation vouchers direct to your profile dashboard.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
              <span>Standard Fare:</span>
              <strong className="text-blue-400 font-mono text-sm">₹50 / head</strong>
            </div>

            <button 
              onClick={onBookTicket}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-md"
            >
              Book Entry Pass Now
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-xs text-slate-500 leading-normal flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Please keep your original Government Identification Card (Aadhaar, Passport, etc.) handy during entry validation checks at the primary monument gate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
