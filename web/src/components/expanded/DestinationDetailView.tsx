import React, { useState } from 'react';
import { Destination } from '../../types';
import { MapPin, Calendar, Compass, Sun, ShieldCheck, Heart, ArrowLeft, Star, Coffee, AlertTriangle } from 'lucide-react';

interface DestinationDetailViewProps {
  destination: Destination;
  onBack: () => void;
  onBook: () => void;
  onDiscussAI: () => void;
  onSelectMonument?: (name: string, city: string, image: string) => void;
}

export default function DestinationDetailView({ destination, onBack, onBook, onDiscussAI, onSelectMonument }: DestinationDetailViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'culinary' | 'guides'>('overview');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-left" id="destination-detail-root">
      {/* Banner */}
      <div className="relative h-80 bg-slate-900 text-white flex items-end">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/10 transition cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore</span>
        </button>

        <div className="relative p-8 space-y-3 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full">
              {destination.category}
            </span>
            <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase tracking-wider py-0.5 px-2.5 rounded-full flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{destination.rating} Verified Rating</span>
            </span>
            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] uppercase tracking-wider py-0.5 px-2.5 rounded-full">
              {destination.hotness}
            </span>
          </div>

          <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight">{destination.name}</h2>
          <p className="text-slate-300 text-xs font-semibold flex items-center gap-1">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>{destination.state}, India</span>
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-8 py-3 flex gap-4 text-sm font-semibold">
        {(['overview', 'culinary', 'guides'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2 capitalize cursor-pointer transition ${
              activeSubTab === tab 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h3 className="font-display font-bold text-lg text-slate-900">Destination Overview</h3>
                <p className="text-slate-650 text-sm leading-relaxed text-slate-600">{destination.description}</p>
              </div>

              {/* Climate Index card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-100 p-4.5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Best Visit Period</span>
                  <strong className="text-slate-900 text-sm block mt-2">October — March</strong>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4.5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">Current Temp</span>
                  <strong className="text-slate-900 text-sm block mt-2">28°C (Pleasant)</strong>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-4.5 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Safety Rating</span>
                  <strong className="text-slate-900 text-sm block mt-2">High (Secure Hub)</strong>
                </div>
              </div>

              {/* Sights */}
              <div className="space-y-3.5">
                <h4 className="font-display font-bold text-base text-slate-900">Iconic Landmarks & Sightseeing Places</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destination.touristSpots?.map((spot, idx) => (
                    <div 
                      key={idx} 
                      id={`sight-card-${spot.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => onSelectMonument && onSelectMonument(spot.name, destination.name, spot.image)}
                      className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden flex flex-col hover:border-slate-350 transition cursor-pointer"
                    >
                      <div className="h-32 bg-slate-100 w-full relative">
                        <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h5 className="font-display font-bold text-xs text-slate-900 uppercase tracking-tight">{spot.name}</h5>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-3">{spot.description}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-2 text-center text-slate-400 py-6">No custom sights currently registered.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'culinary' && (
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h3 className="font-display font-bold text-lg text-slate-900">Culinary Passport & Delicacies</h3>
                <p className="text-slate-650 text-sm leading-relaxed text-slate-600">
                  Savor the authentic taste of {destination.name}. Here are the regional gastronomy details recommended by locals.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl bg-amber-100 p-2 rounded-xl">🥘</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Famous Local Plate</h4>
                    <p className="text-xs text-slate-500">Must try local culinary selection during your visits</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every street kitchen and local dining hall serves hand-picked spices unique to {destination.name}. Do not miss trying authentic recipes tempered with royal spices and local clarify butter.
                </p>
              </div>
            </div>
          )}

          {activeSubTab === 'guides' && (
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h3 className="font-display font-bold text-lg text-slate-900">Government-Accredited Tour Guides</h3>
                <p className="text-slate-650 text-sm leading-relaxed text-slate-600">
                  Book verified local guides fluent in multiple languages to unlock rich heritage stories.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Rajesh Mishra', lang: 'English, Hindi', rating: 4.9, experience: '12 Years', badge: 'Elite Guide' },
                  { name: 'Sujata Nair', lang: 'English, Malayalam, Tamil', rating: 4.8, experience: '8 Years', badge: 'Certified Guide' }
                ].map((guide, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl flex items-start space-x-3.5 hover:shadow-xs transition">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                      {guide.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{guide.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Exp: {guide.experience} • Languages: {guide.lang}</p>
                      <span className="inline-block mt-2 bg-blue-50 text-blue-600 font-bold text-[9px] px-2 py-0.5 rounded">
                        {guide.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column / Sidebar Booking details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-5">
            <div>
              <span className="text-[9px] text-blue-400 uppercase tracking-widest font-mono font-bold block">Expedition Package</span>
              <h4 className="font-display font-bold text-lg mt-1">Book Custom Trip</h4>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Configure stays, heritage entry cards, and local travel guides for {destination.name} in a single lock.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/30 text-center font-mono">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Budget</span>
              <strong className="text-xl text-blue-400 block mt-1">₹{destination.estMinBudget.toLocaleString()} — ₹{destination.estMaxBudget.toLocaleString()}</strong>
              <span className="text-[9px] text-slate-500 block mt-0.5">per person basis estimate</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button 
                onClick={onBook}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold transition duration-200 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Confirm Booking Details</span>
              </button>
              
              <button 
                onClick={onDiscussAI}
                className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>💬 Talk with AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
