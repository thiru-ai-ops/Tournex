import React, { useState } from 'react';
import { Hotel } from '../../types';
import { Star, MapPin, Coffee, Wifi, Dumbbell, ShieldCheck, Heart, ArrowLeft, Calendar, ShieldAlert } from 'lucide-react';

interface HotelDetailViewProps {
  hotel: Hotel;
  onBack: () => void;
  onBook: () => void;
}

export default function HotelDetailView({ hotel, onBack, onBook }: HotelDetailViewProps) {
  const [activeSuite, setActiveSuite] = useState<'deluxe' | 'royal'>('deluxe');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-left" id="hotel-detail-root">
      {/* Banner */}
      <div className="relative h-72 bg-slate-900 text-white flex items-end">
        <img 
          src={hotel.image} 
          alt={hotel.name} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/10 transition cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stays</span>
        </button>

        <div className="relative p-6 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider py-0.5 px-2 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>TourNex Eco-Certified Sustainable Stay</span>
          </div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight">{hotel.name}</h2>
          <p className="text-slate-350 text-xs font-semibold flex items-center gap-1">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>{hotel.location}</span>
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-base text-slate-900">About the Resort</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Nestled in the prime landscape of {hotel.location.split(',')[0]}, this boutique resort offers an unparalleled blend of traditional architecture and state-of-the-art sustainable amenities. Guests can experience authentic local dining, relaxing spa therapies, and beautiful views of the historic surroundings.
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-slate-900">Amenities & Offerings</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2">
                <Wifi className="h-4 w-4 text-blue-600" />
                <span>Free High-speed Wi-Fi</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-500" />
                <span>Organic Breakfast</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-indigo-500" />
                <span>Fitness Club</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Infinity Pool</span>
              </div>
            </div>
          </div>

          {/* Room Categories */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm text-slate-900">Configured Room Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setActiveSuite('deluxe')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                  activeSuite === 'deluxe' 
                    ? 'bg-blue-50/50 border-blue-600 shadow-xs' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <h5 className="font-bold text-xs uppercase text-slate-800">Deluxe Garden Balcony View</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Spacious 350 sq ft suite featuring premium king bed, attached garden balcony, and stone bathtub.
                </p>
                <span className="inline-block mt-3 text-xs font-mono font-bold text-blue-600">₹{hotel.price.toLocaleString()} / night</span>
              </div>

              <div 
                onClick={() => setActiveSuite('royal')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                  activeSuite === 'royal' 
                    ? 'bg-blue-50/50 border-blue-600 shadow-xs' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <h5 className="font-bold text-xs uppercase text-slate-800">Royal Heritage Suite</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Opulent 550 sq ft suite detailed with Rajasthani mirror work, separate dining salon, and butler service.
                </p>
                <span className="inline-block mt-3 text-xs font-mono font-bold text-blue-600">₹{(hotel.price * 1.5).toLocaleString()} / night</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Reservation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4">
            <div>
              <span className="text-[9px] text-blue-400 font-mono font-bold block uppercase">Lodging Desk</span>
              <h4 className="font-display font-extrabold text-base mt-1">Book Your Room</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                Reserve your stay at {hotel.name} with instant email notification confirmation.
              </p>
            </div>

            <div className="bg-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[9px] text-slate-500 uppercase font-mono block">Selected Suite Rate</span>
              <strong className="text-lg text-emerald-400 block font-mono mt-0.5">
                ₹{(activeSuite === 'deluxe' ? hotel.price : hotel.price * 1.5).toLocaleString()} / night
              </strong>
            </div>

            <button 
              onClick={onBook}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-md"
            >
              Secure Stay Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
