import React, { useState } from 'react';
import { POPULAR_HOTELS } from '../../data';
import { Hotel } from '../../types';
import { Search, MapPin, Star, Sparkles, SlidersHorizontal, Moon, ShieldCheck, Heart } from 'lucide-react';

interface StaysCatalogViewProps {
  onSelectHotel: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export default function StaysCatalogView({ onSelectHotel, onBookHotel }: StaysCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState<'All' | 'Luxury' | 'Heritage' | 'Boutique'>('All');

  const filteredHotels = POPULAR_HOTELS.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = activeTier === 'All' || 
                        (activeTier === 'Luxury' && hotel.name.toLowerCase().includes('resort')) ||
                        (activeTier === 'Heritage' && hotel.name.toLowerCase().includes('palace')) ||
                        (activeTier === 'Boutique' && !hotel.name.toLowerCase().includes('resort') && !hotel.name.toLowerCase().includes('palace'));
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 text-left" id="stays-catalog-root">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-800/40 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono font-bold">
            Eco-Luxe & Heritage Stays
          </span>
          <h2 className="font-display font-black text-2xl text-white mt-2 tracking-tight">Luxury Stays Catalog</h2>
          <p className="text-slate-400 text-xs mt-1">Browse and book accredited boutique heritage hotels and premium stays in India.</p>
        </div>
        
        {/* Filters */}
        <div className="flex bg-slate-850 p-1 rounded-xl border border-slate-800 shrink-0 text-xs font-semibold">
          {(['All', 'Luxury', 'Heritage', 'Boutique'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTier === tier 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search stays by hotel name or location..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 focus:outline-none"
        />
      </div>

      {/* Hotels list grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredHotels.map(hotel => (
          <div 
            key={hotel.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="relative h-44 bg-slate-100 shrink-0">
              <img 
                src={hotel.image} 
                alt={hotel.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                <span>{hotel.rating} Rating</span>
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 leading-snug">{hotel.name}</h3>
                <p className="text-slate-500 text-[10px] flex items-center gap-1 mt-1 font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  <span>{hotel.location}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-150">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold block">Rate Per Night</span>
                  <strong className="text-sm text-blue-600 font-mono">₹{hotel.price.toLocaleString()}</strong>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onSelectHotel(hotel)}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => onBookHotel(hotel)}
                    className="bg-slate-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
