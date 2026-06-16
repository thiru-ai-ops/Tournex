import React, { useState, useMemo } from 'react';
import { Destination, TabType } from '../types';
import { Star, MapPin, ArrowRight, ShieldAlert, Sparkles, Sliders, DollarSign, Heart, Compass, Settings, Info, Check } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

const DESTINATION_LAT_LNG: Record<string, { lat: number; lng: number }> = {
  agra: { lat: 27.1751, lng: 78.0421 },
  goa: { lat: 15.2993, lng: 74.1240 },
  ladakh: { lat: 34.1526, lng: 77.5771 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  alleppey: { lat: 9.4981, lng: 76.3388 },
  gulmarg: { lat: 34.0484, lng: 74.3805 },
  rishikesh: { lat: 30.0869, lng: 78.2676 },
  hampi: { lat: 15.3350, lng: 76.4600 },
  andaman: { lat: 11.7401, lng: 92.6586 },
  munnar: { lat: 10.0889, lng: 77.0595 },
  jaisalmer: { lat: 26.9157, lng: 70.9083 },
  ooty: { lat: 11.4102, lng: 76.6950 },
};

interface GatewayViewProps {
  selectedDestination: string;
  onSelectDestination: (destName: string) => void;
  setActiveTab: (tab: TabType) => void;
  destinations: Destination[];
}

export default function GatewayView({ selectedDestination, onSelectDestination, setActiveTab, destinations }: GatewayViewProps) {
  const [budgetFilter, setBudgetFilter] = useState<'any' | 'low' | 'mid' | 'high'>('any');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [currentMood, setCurrentMood] = useState<'Adventurous' | 'Relaxing' | 'Spiritual' | 'Coastal' | 'Romantic' | 'Mystical'>('Adventurous');
  const [activeTabToggle, setActiveTabToggle] = useState<'value' | 'near'>('value');
  const [hoveredMapSpot, setHoveredMapSpot] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [ratingSortOrder, setRatingSortOrder] = useState<'none' | 'desc' | 'asc'>('none');
  const [mapMode, setMapMode] = useState<'real' | 'fallback'>(hasValidKey ? 'real' : 'fallback');
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  // Stateful Multi-Point Router states
  const [routeStations, setRouteStations] = useState<string[]>(['Agra', 'Jaipur', 'Varanasi']);
  const [chosenTransit, setChosenTransit] = useState<'Vande Bharat Train' | 'Sleeper Bus' | 'Private Cab' | 'Flight'>('Vande Bharat Train');

  const activeDest = useMemo(() => {
    return destinations.find(d => d.name === selectedDestination);
  }, [destinations, selectedDestination]);

  const activeLatLng = useMemo(() => {
    if (!activeDest) return { lat: 20.5937, lng: 78.9629 }; // India default center
    return DESTINATION_LAT_LNG[activeDest.id] || { lat: 20.5937, lng: 78.9629 };
  }, [activeDest]);

  // Filter recommendations
  const recommendedDestinations = useMemo(() => {
    let filtered = destinations.filter((dest) => {
      // Mood matching (adventure mood matches adventure categories and others)
      const matchesCategory = categoryFilter === 'All' || dest.category === categoryFilter;
      
      let matchesBudget = true;
      if (budgetFilter === 'low') matchesBudget = dest.estMaxBudget <= 10000;
      else if (budgetFilter === 'mid') matchesBudget = dest.estMinBudget > 4000 && dest.estMaxBudget <= 20000;
      else if (budgetFilter === 'high') matchesBudget = dest.estMinBudget >= 12000;

      const matchesRating = dest.rating >= minRating;

      return matchesCategory && matchesBudget && matchesRating;
    });

    if (ratingSortOrder === 'desc') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (ratingSortOrder === 'asc') {
      filtered = [...filtered].sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  }, [categoryFilter, budgetFilter, minRating, ratingSortOrder, destinations]);

  // Handpicked mood match cards
  const moodMatchedCards = useMemo(() => {
    if (currentMood === 'Adventurous') {
      return destinations.filter(d => d.category === 'Adventure' || d.category === 'Heritage');
    } else if (currentMood === 'Relaxing') {
      return destinations.filter(d => d.category === 'Relaxing' || d.category === 'Coastal');
    } else if (currentMood === 'Spiritual') {
      return destinations.filter(d => d.category === 'Spiritual');
    } else if (currentMood === 'Romantic') {
      return destinations.filter(d => d.category === 'Coastal' || d.id === 'agra' || d.id === 'ooty' || d.id === 'munnar' || d.id === 'srinagar');
    } else if (currentMood === 'Mystical') {
      return destinations.filter(d => d.id === 'hampi' || d.id === 'varanasi' || d.id === 'jaisalmer' || d.category === 'Spiritual');
    } else {
      return destinations.filter(d => d.category === 'Coastal' || d.category === 'Relaxing');
    }
  }, [currentMood, destinations]);

  const moodColor = {
    Adventurous: 'bg-orange-500 hover:bg-orange-600 ring-orange-500/20',
    Relaxing: 'bg-emerald-500 hover:bg-emerald-600 ring-emerald-500/20',
    Spiritual: 'bg-purple-500 hover:bg-purple-600 ring-purple-500/20',
    Coastal: 'bg-blue-500 hover:bg-blue-600 ring-blue-500/20',
    Romantic: 'bg-rose-500 hover:bg-rose-600 ring-rose-500/20',
    Mystical: 'bg-indigo-600 hover:bg-indigo-700 ring-indigo-600/20'
  };

  const handleSpotClick = (destName: string) => {
    onSelectDestination(destName);
  };

  return (
    <div className="space-y-8 pb-16" id="gateway-view-root">
      
      {/* Gateway Search Controls Container */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm" id="gateway-controls">
        <h1 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <span>Find Your Perfect Indian Gateway</span>
          <Sparkles className="h-5 w-5 text-blue-500 fill-current animate-pulse-slow" />
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Adjust preferences dynamically to sync custom itineraries and map highlights
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {/* Budget Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Budget (Est)</label>
            <select 
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="any">Any Budget</option>
              <option value="low">Budget Friendly (Under ₹10k)</option>
              <option value="mid">Mid Range (₹10k - ₹20k)</option>
              <option value="high">Elite Luxury (Above ₹20k)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Category</label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Heritage">Heritage & History</option>
              <option value="Coastal">Coastal & Beaches</option>
              <option value="Adventure">Adventure & Skiing</option>
              <option value="Spiritual">Spiritual & Devotional</option>
              <option value="Relaxing">Quiet & Relaxing</option>
            </select>
          </div>

          {/* Mood Selector */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Current Mood</label>
            <div className="flex gap-1.5">
              <select 
                value={currentMood}
                onChange={(e) => setCurrentMood(e.target.value as any)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Adventurous">Adventurous</option>
                <option value="Relaxing">Relaxing</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Coastal">Coastal Vibe</option>
                <option value="Romantic">Romantic Getaway</option>
                <option value="Mystical">Mystical Ruins</option>
              </select>
              <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white font-bold leading-none shadow-md ${
                currentMood === 'Adventurous' ? 'bg-orange-500' :
                currentMood === 'Relaxing' ? 'bg-emerald-500' :
                currentMood === 'Spiritual' ? 'bg-purple-500' :
                currentMood === 'Coastal' ? 'bg-blue-500' :
                currentMood === 'Romantic' ? 'bg-rose-500' : 'bg-indigo-600'
              }`}>
                {currentMood === 'Adventurous' ? '🧗' :
                 currentMood === 'Relaxing' ? '🧘' :
                 currentMood === 'Spiritual' ? '🕉️' :
                 currentMood === 'Coastal' ? '🏖️' :
                 currentMood === 'Romantic' ? '💖' : '🔮'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mood Recommendation Row */}
      <section className="space-y-3" id="mood-match-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`h-2.5 w-2.5 rounded-full animate-ping ${
              currentMood === 'Adventurous' ? 'bg-orange-500' :
              currentMood === 'Relaxing' ? 'bg-emerald-500' :
              currentMood === 'Spiritual' ? 'bg-purple-500' :
              currentMood === 'Coastal' ? 'bg-blue-500' :
              currentMood === 'Romantic' ? 'bg-rose-500' : 'bg-indigo-600'
            }`}></div>
            <h2 className="font-display text-lg font-bold text-slate-900 leading-none">
              Personalized for your Vibe: <span className="text-blue-600">{currentMood}</span>
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-widest bg-slate-100 py-1 px-2.5 rounded-lg border border-slate-200/50">
            Handpicked Matches
          </span>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x" id="mood-row">
          {moodMatchedCards.map((dest) => (
            <div 
              key={dest.id}
              onClick={() => handleSpotClick(dest.name)}
              className={`flex-none w-72 bg-gradient-to-tr from-slate-950 to-slate-900 text-white rounded-2xl overflow-hidden shadow-md cursor-pointer snap-start hover:ring-2 p-1.5 transition ${
                selectedDestination === dest.name ? 'ring-2 ring-blue-500 scale-[0.98]' : 'hover:scale-[1.01]'
              }`}
            >
              <div className="relative h-32 rounded-xl overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold font-mono">
                  {dest.category}
                </div>
              </div>
              <div className="px-3.5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-white">{dest.name}</h3>
                  <div className="flex items-center space-x-1 font-mono text-[11px] font-bold text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{dest.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1 truncate leading-relaxed">
                  {dest.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-none block">Est. Range</span>
                  <span className="font-mono text-emerald-400 text-xs font-bold leading-none">
                    ₹{dest.estMinBudget.toLocaleString()} - ₹{dest.estMaxBudget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Split Hub */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="gateway-splitter-pane">
        {/* Left Side: Interactive Map container (Supports Google Maps & Fallback SVG) */}
        <div className="lg:col-span-12 xl:col-span-5 bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white shadow-xl flex flex-col justify-between min-h-[500px]" id="map-containment">
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-red-500/25 text-red-500 border border-red-500/30 px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-bold tracking-widest font-mono flex items-center space-x-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>{mapMode === 'real' ? 'Live Google Map' : 'Art SVG Map'}</span>
              </span>
              
              {/* Map switcher options */}
              <div className="bg-slate-950 p-0.5 rounded-lg flex space-x-0.5 border border-slate-800 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setMapMode('real')}
                  className={`px-2 py-1 rounded transition-all font-bold cursor-pointer ${
                    mapMode === 'real' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('fallback')}
                  className={`px-2 py-1 rounded transition-all font-bold cursor-pointer ${
                    mapMode === 'fallback' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SVG Art
                </button>
              </div>
            </div>
            
            <h3 className="font-display text-base font-bold text-white mt-3 truncate leading-none">
              {selectedDestination ? `Spotlight: ${selectedDestination}` : 'Interactive Spot Mapper'}
            </h3>
            <p className="text-[11px] text-slate-300 font-medium mt-1.5 flex items-center space-x-1 leading-none">
              <MapPin className="h-3.5 w-3.5 text-red-400 animate-bounce" />
              <span>Click markers to load conversational intelligence</span>
            </p>
          </div>

          {/* Interactive Map Graphics Canvas */}
          <div className="relative w-full h-[320px] mt-4 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
            {mapMode === 'real' ? (
              hasValidKey ? (
                <APIProvider apiKey={API_KEY} version="weekly">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <Map
                      defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
                      center={activeLatLng}
                      defaultZoom={5}
                      zoom={selectedDestination ? 7 : 5}
                      mapId="DEMO_MAP_ID"
                      gestureHandling="cooperative"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {destinations.map((dest) => {
                        const isSelected = selectedDestination === dest.name;
                        const latLng = DESTINATION_LAT_LNG[dest.id];
                        if (!latLng) return null;

                        const isRatingSortedActive = ratingSortOrder !== 'none';
                        const isTopTierRating = dest.rating >= 4.8;

                        let pinColor = '#3b82f6'; // blue
                        let pinScale = 1.0;

                        if (isSelected) {
                          pinColor = '#ef4444'; // red
                          pinScale = 1.35;
                        } else if (isRatingSortedActive) {
                          if (isTopTierRating) {
                            pinColor = '#f59e0b'; // amber/gold
                            pinScale = 1.25;
                          } else {
                            pinColor = '#64748b'; // slate/dim
                            pinScale = 0.75;
                          }
                        }

                        return (
                          <AdvancedMarker
                            key={dest.id}
                            position={latLng}
                            onClick={() => handleSpotClick(dest.name)}
                            title={`${dest.name} (${dest.state}) - ★${dest.rating}`}
                          >
                            <Pin
                              background={pinColor}
                              borderColor="#ffffff"
                              glyphColor="#ffffff"
                              scale={pinScale}
                            />
                          </AdvancedMarker>
                        );
                      })}
                    </Map>

                    {/* Google Map indicator watermark */}
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-slate-800/80 px-2 py-0.5 rounded text-[8.5px] font-mono font-bold text-emerald-400 z-10 flex items-center gap-1.5 backdrop-blur-xs select-none shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Google API Map Active</span>
                    </div>
                  </div>
                </APIProvider>
              ) : (
                /* Google Maps Config Splash Screen - Constitution C */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                  <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3 animate-pulse">
                    <Settings className="h-5 w-5" />
                  </div>
                  <h4 className="font-display font-black text-xs text-slate-100 uppercase tracking-wider">Google Maps Key Required</h4>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-[280px] leading-relaxed">
                    Set up your Google Maps credentials to load live, interactive maps of heritage sites.
                  </p>
                  
                  {showConfigHelp ? (
                    <div className="mt-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-left text-[9px] text-slate-300 font-sans max-h-[140px] overflow-y-auto space-y-2 leading-relaxed">
                      <p className="font-bold text-amber-400 font-mono">STEPS FOR SETUP:</p>
                      <p><strong>1. Acquire Key:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Click here to register a key</a></p>
                      <p><strong>2. Record Secret:</strong> Open Settings (⚙️ top-right gear icon) → Secrets → Type <code>GOOGLE_MAPS_PLATFORM_KEY</code> → paste your key & hit enter.</p>
                      <p className="text-slate-400">The application rebuilds automatically after setup to initialize GPS mapping.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4 w-full max-w-[240px]">
                      <button 
                        type="button"
                        onClick={() => setShowConfigHelp(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] font-mono rounded-lg py-2 px-3 transition active:scale-95 cursor-pointer shadow-md inline-flex items-center justify-center gap-1"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span>View Setup Steps</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setMapMode('fallback')}
                        className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-[10px] rounded-lg py-1.5 transition cursor-pointer"
                      >
                        Use Fallback SVG map
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* Fallback beautiful Interactive SVG Map */
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background State Outline or Grid representation */}
                <svg 
                  className="absolute inset-0 w-full h-full text-slate-800 opacity-25" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5"
                >
                  {/* Artistic Grid */}
                  <circle cx="50" cy="50" r="45" strokeDasharray="1 3" />
                  <circle cx="50" cy="50" r="30" strokeDasharray="1 4" />
                  <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="1 2" />
                  <line x1="5" y1="50" x2="95" y2="50" strokeDasharray="1 2" />

                  {/* Artistic outline drawing mimicking India's coastline & borders */}
                  <path d="M40,10 L45,15 L43,20 L48,22 L45,28 L38,25 L35,22 Z" /> {/* Northern area */}
                  <path d="M30,30 L40,32 L48,30 L55,35 L62,38 L72,40 L65,48 L58,45 L50,55 L42,50 L35,46 L30,42 Z" /> {/* Middle belt */}
                  <path d="M30,45 L35,55 L38,65 L37,75 L38,85 L44,92 L47,85 L45,75 L50,68 L48,58 Z" strokeWidth="0.75" /> {/* Coastline peninsular */}
                </svg>

                {/* Glowing Map Hotspots */}
                {destinations.map((dest) => {
                  const isSelected = selectedDestination === dest.name;
                  const isHovered = hoveredMapSpot === dest.id;
                  
                  // Calculate dynamic rating prominence when rating sort is active
                  const isRatingSortedActive = ratingSortOrder !== 'none';
                  const isTopTierRating = dest.rating >= 4.8;
                  
                  let pulseClass = isSelected ? 'bg-red-400 animate-ping' : 'bg-blue-400 animate-pulse-slow';
                  let dotClass = isSelected ? 'h-3.5 w-3.5 bg-red-500 scale-125 shadow-lg shadow-red-500/50' : 'h-2.5 w-2.5 bg-blue-500 group-hover:scale-125';
                  let markerClass = "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-300";
                  
                  if (isRatingSortedActive) {
                    if (isTopTierRating) {
                      // Highly rated items glow gold/amber with extra large size and bounce
                      pulseClass = isSelected 
                        ? 'bg-amber-400 animate-ping h-8 w-8' 
                        : 'bg-amber-500/60 animate-ping h-7 w-7 opacity-90';
                      dotClass = isSelected 
                        ? 'h-4.5 w-4.5 bg-gradient-to-r from-amber-400 to-yellow-500 scale-130 shadow-xl ring-2 ring-white shadow-amber-500/80 z-30' 
                        : 'h-3.5 w-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 ring-1 ring-yellow-300 shadow-md shadow-amber-500/60 group-hover:scale-125';
                      markerClass += " scale-110 z-30";
                    } else {
                      // Dim non-top rated ones to provide ultimate visual hierarchy
                      pulseClass = isSelected ? 'bg-red-400 animate-ping' : 'bg-blue-300/10 h-4 w-4';
                      dotClass = isSelected 
                        ? 'h-3 w-3 bg-red-400' 
                        : 'h-1.5 w-1.5 bg-slate-500 opacity-40 group-hover:opacity-100 group-hover:scale-110';
                      markerClass += " opacity-50";
                    }
                  }

                  return (
                    <div
                      key={dest.id}
                      style={{ left: `${dest.coords.x}%`, top: `${dest.coords.y}%` }}
                      onMouseEnter={() => setHoveredMapSpot(dest.id)}
                      onMouseLeave={() => setHoveredMapSpot(null)}
                      onClick={() => handleSpotClick(dest.name)}
                      className={markerClass}
                      id={`map-spot-${dest.id}`}
                    >
                      {/* Outer waves */}
                      <span className={`absolute inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 transition-all duration-300 ${pulseClass}`} />
                      
                      {/* Inner dot */}
                      <span className={`relative block rounded-full transition-all duration-300 ${dotClass}`} />

                      {/* Rating Flag Indicator when sort is active */}
                      {isRatingSortedActive && isTopTierRating && (
                        <span className="absolute left-3 -top-3 bg-slate-900 border border-amber-400 text-amber-400 font-mono text-[8.5px] font-black px-1.5 py-0.5 rounded shadow-lg flex items-center gap-0.5 scale-90 whitespace-nowrap z-40 pointer-events-none select-none">
                          <span>★</span>
                          <span>{dest.rating}</span>
                        </span>
                      )}

                      {/* Bubble tooltip on hover */}
                      {(isHovered || isSelected) && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700 whitespace-nowrap shadow-xl z-30">
                          <span>{dest.name}</span>
                          <span className="text-slate-400 ml-1">({dest.state})</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active spot focus bar */}
          {selectedDestination ? (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 flex items-center justify-between gap-3 mt-4">
              <div className="flex-1 overflow-hidden">
                <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-widest block leading-none">Map Spotlight</span>
                <span className="font-display font-black text-sm text-white mt-1 leading-none block truncate">
                  {selectedDestination}
                </span>
              </div>
              <button 
                onClick={() => setActiveTab('companion')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold font-mono transition flex items-center space-x-1 shrink-0"
              >
                <span>Select & Discuss</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 text-center text-xs text-slate-500 mt-4 leading-normal">
              Highlight hotspots to lock companion chat logs
            </div>
          )}
        </div>

        {/* Right Side: Recommendations List Panel */}
        <div className="lg:col-span-7 space-y-4" id="recommendations-panel">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-slate-900 text-base">Top Recommendations</h3>
              
              {/* Value/Near Toggles */}
              <div className="bg-slate-100 p-1 rounded-lg flex space-x-1 border border-slate-200">
                <button 
                  onClick={() => setActiveTabToggle('value')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${
                    activeTabToggle === 'value' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Best Value
                </button>
                <button 
                  onClick={() => setActiveTabToggle('near')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${
                    activeTabToggle === 'near' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Near You
                </button>
              </div>
            </div>

            {/* Interactive Rating Filters & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-xs shadow-xs" id="interactive-rating-filters">
              {/* Min Rating Buttons */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-500 font-mono text-[10px] uppercase">Min Rating Score:</span>
                <div className="flex items-center space-x-1">
                  {[0, 4.5, 4.7, 4.8].map((score) => (
                    <button
                      key={score}
                      onClick={() => setMinRating(score)}
                      className={`px-2 py-0.5 rounded-lg font-extrabold text-[10px] flex items-center space-x-0.5 transition active:scale-95 cursor-pointer ${
                        minRating === score 
                          ? 'bg-amber-500 text-white shadow-xs' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{score === 0 ? 'All' : `${score}+`}</span>
                      <Star className={`h-2.5 w-2.5 ${minRating === score ? 'fill-current text-white' : 'text-amber-500 fill-current'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort by rating */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-500 font-mono text-[10px] uppercase">Sort by Rating:</span>
                <select
                  value={ratingSortOrder}
                  onChange={(e) => setRatingSortOrder(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-705 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="none">No Sort (Default)</option>
                  <option value="desc">Highest Rating first</option>
                  <option value="asc">Lowest Rating first</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[390px] overflow-y-auto pr-1.5 scrollbar-thin" id="gateway-scrollable-list">
            {recommendedDestinations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/50">
                <Sliders className="h-9 w-9 text-slate-300 mx-auto mb-2 animate-spin-slow" />
                <h4 className="font-bold text-slate-800 text-sm">No Recommendations Match</h4>
                <p className="text-slate-500 text-xs mt-1">Try broadening your category or budget thresholds.</p>
              </div>
            ) : (
              recommendedDestinations.map((dest) => {
                const isSelected = selectedDestination === dest.name;
                return (
                  <div 
                    key={dest.id}
                    onClick={() => handleSpotClick(dest.name)}
                    className={`bg-white border rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-blue-400 group transition duration-200 ${
                      isSelected ? 'border-2 border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'border-slate-150'
                    }`}
                  >
                    {/* Tiny thumbnail card image */}
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src={dest.image} 
                        alt={dest.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Meta labels */}
                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div>
                        {/* Area ratings row */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold font-mono tracking-wider text-blue-600 bg-blue-50 border border-blue-100/50 rounded-md px-2 py-0.5 uppercase">
                            {dest.category}
                          </span>
                          <div className="flex items-center space-x-1 font-mono text-[11px] font-black text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{dest.rating}</span>
                          </div>
                        </div>

                        <h4 className="font-display font-extrabold text-[#0f172a] text-base group-hover:text-blue-600 truncate mt-1">
                          {dest.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 truncate leading-tight leading-relaxed">
                          {dest.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-50 gap-2">
                        <div>
                          <span className="text-[8px] text-slate-400 font-bold uppercase block leading-none">Est Budget / Head</span>
                          <span className="font-mono text-slate-700 text-xs font-extrabold mt-0.5 block leading-none">
                            ₹{dest.estMinBudget.toLocaleString()} - ₹{dest.estMaxBudget.toLocaleString()}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDestination(dest.name);
                            setActiveTab('companion');
                          }}
                          className="bg-blue-50 hover:bg-blue-600 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-lg p-1.5 transition shrink-0 active:scale-95"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </section>

      {/* Advanced Multi-Point Router & Sequencer Section */}
      <section className="bg-white border border-slate-200/95 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left" id="multi-point-router">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles className="h-5 w-5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5">
                Indian Corridor Scheduler
              </span>
            </div>
            <h2 className="font-display text-xl font-extrabold text-slate-900 mt-1">
              Dynamic Route Sequencer & Multi-Point Transit Optimizer
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 leading-normal">
              Select multiple destinations to calculate the optimal geographical sequence, travel times, and recommended transport formats.
            </p>
          </div>

          {/* Transit Format Toggle Selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs font-semibold self-start" id="transit-selectors">
            {['Vande Bharat Train', 'Sleeper Bus', 'Private Cab', 'Flight'].map((mode) => (
              <button
                key={mode}
                onClick={() => setChosenTransit(mode as any)}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  chosenTransit === mode 
                    ? 'bg-white text-slate-905 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {mode === 'Vande Bharat Train' ? '🚄 Train' : mode === 'Sleeper Bus' ? '🚌 Bus' : mode === 'Private Cab' ? '🚗 Cab' : '✈️ Flight'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Checkboxes List of Hotspots */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200/50 p-4.5 p-5 rounded-2xl" id="hotspots-selector-column">
            <h4 className="text-xs font-bold text-slate-902 font-mono uppercase tracking-wider mb-3">
              📍 Select Route Stations
            </h4>
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {['Agra', 'Goa', 'Ladakh', 'Varanasi', 'Jaipur', 'Alleppey', 'Gulmarg', 'Rishikesh', 'Hampi', 'Andaman'].map((station) => {
                const isChecked = routeStations.includes(station);
                return (
                  <label 
                    key={station}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition select-none ${
                      isChecked 
                        ? 'bg-white border-blue-400 font-bold text-blue-900 shadow-xs' 
                        : 'bg-slate-100/50 border-slate-200 text-slate-600 hover:bg-slate-200/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            // Don't go below 1 selected for display purposes
                            if (routeStations.length > 1) {
                              setRouteStations(routeStations.filter(s => s !== station));
                            }
                          } else {
                            setRouteStations([...routeStations, station]);
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="text-xs">{station}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      {(DESTINATION_LAT_LNG[station.toLowerCase()]?.lat.toFixed(1)) || 'N/A'}° N
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Selected Stations:</span>
              <strong className="text-blue-600 font-mono font-bold text-xs">{routeStations.length} hotspots</strong>
            </div>
          </div>

          {/* Route Sequence Solver Panel */}
          <div className="lg:col-span-8 bg-slate-900 hover:bg-slate-900 text-white rounded-2xl p-5 border border-slate-950 flex flex-col justify-between" id="route-sequence-column">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
                  <span>● Calculated Optimal Sequence</span>
                  <span className="text-[10px] text-slate-400 font-light">(Ordered North to South)</span>
                </span>
                
                <span className="text-[9px] bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded text-slate-300">
                  ⚡ Latitude Decoded Routing
                </span>
              </div>

              {/* Graphical horizontal / vertical sequence flow charts */}
              <div className="mt-5 space-y-4">
                {(() => {
                  // Sorted by Latitude (North to South optimization)
                  const sortedStations = [...routeStations].sort((a, b) => {
                    const latA = DESTINATION_LAT_LNG[a.toLowerCase()]?.lat || 0;
                    const latB = DESTINATION_LAT_LNG[b.toLowerCase()]?.lat || 0;
                    return latB - latA;
                  });

                  // Calculate estimated travel stats
                  const travelUnitDays = chosenTransit === 'Flight' ? 0.2 : chosenTransit === 'Vande Bharat Train' ? 0.5 : chosenTransit === 'Private Cab' ? 0.7 : 0.9;
                  const estAvgHours = chosenTransit === 'Flight' ? 1.5 : chosenTransit === 'Vande Bharat Train' ? 4.5 : chosenTransit === 'Private Cab' ? 6.5 : 9.0;
                  const estimatedTotalDays = Math.max(1, Math.round(sortedStations.length * travelUnitDays * 10) / 10);
                  const estimatedInterHours = Math.round(estAvgHours * (sortedStations.length - 1 || 1));
                  const estimatedBudget = (sortedStations.length - 1 || 1) * (chosenTransit === 'Flight' ? 5800 : chosenTransit === 'Vande Bharat Train' ? 1800 : chosenTransit === 'Private Cab' ? 3200 : 1200);

                  return (
                    <div className="space-y-4">
                      
                      {/* Interactive Connected Nodes */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {sortedStations.map((station, sIdx) => {
                          const isLast = sIdx === sortedStations.length - 1;
                          return (
                            <React.Fragment key={station}>
                              <div className="bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-left shrink-0 shadow-lg min-w-[110px]">
                                <span className="text-[8px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
                                  Stop 0{sIdx + 1}
                                </span>
                                <h5 className="font-bold text-xs text-white mt-0.5">{station}</h5>
                                <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">
                                  {DESTINATION_LAT_LNG[station.toLowerCase()] ? `${DESTINATION_LAT_LNG[station.toLowerCase()].lat.toFixed(1)}°N` : 'India'}
                                </span>
                              </div>
                              
                              {!isLast && (
                                <div className="flex flex-col items-center justify-center text-slate-500 font-mono font-extrabold text-sm shrink-0 px-1">
                                  <span className="text-xl">➡️</span>
                                  <span className="text-[8px] text-emerald-400">{estAvgHours} hrs</span>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Logistical Insights Summary Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850 text-left mt-5">
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-[#94a3b8] uppercase block">Estimated Transit Time</span>
                          <strong className="text-emerald-400 font-mono text-base font-extrabold block mt-1 hover:text-emerald-300">
                            ~{estimatedInterHours} hrs total
                          </strong>
                          <span className="text-[9px] text-slate-400 block font-light mt-0.5">Sector-to-Sector avg duration</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-[#94a3b8] uppercase block">Route Complexity Rate</span>
                          <strong className="text-indigo-400 text-sm font-extrabold block mt-1">
                            {sortedStations.length <= 2 ? 'Low (Direct)' : sortedStations.length <= 4 ? 'Moderate (Optimal)' : 'High density'}
                          </strong>
                          <span className="text-[9px] text-slate-400 block font-light mt-0.5">Geographical spread load</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono tracking-widest text-[#94a3b8] uppercase block">Est Transit Expenses</span>
                          <strong className="text-blue-400 font-mono text-base font-extrabold block mt-1">
                            ₹{estimatedBudget.toLocaleString()} / head
                          </strong>
                          <span className="text-[9px] text-slate-405 block font-light mt-0.5">Computed for {chosenTransit}</span>
                        </div>
                      </div>

                      {/* Regional Transit Tips */}
                      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3 text-[11px] leading-relaxed text-blue-200 flex items-start gap-2.5">
                        <span className="text-sm">💡</span>
                        <div>
                          <strong className="font-mono text-[9px] text-blue-450 uppercase block font-bold">ROUTE INSPECTION ADVISORY</strong>
                          <p className="mt-0.5 text-slate-200">
                            {chosenTransit === 'Vande Bharat Train' 
                              ? 'Vande Bharat routes are semi-high-speed but mandate pre-booking 15 days in advance via IRCTC portal to lock executive AC coach seating.'
                              : chosenTransit === 'Flight'
                              ? 'Flights require security check-in buffers. Verify internal baggage weight allowances for smaller regional aircrafts.'
                              : 'Ensure road drivers are licensed for commercial multi-state permits before crossing dry state borders.'}
                          </p>
                        </div>
                      </div>

                      {/* AI integration action launcher */}
                      <div className="pt-2 flex justify-end">
                        <button 
                          onClick={() => {
                            // Automatically pass selected sequence to companion
                            const routeNameStr = sortedStations.join(' to ');
                            onSelectDestination(`${routeNameStr} route sequence with ${chosenTransit}`);
                            setActiveTab('companion');
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-3 px-5 rounded-xl transition duration-150 shadow-md flex items-center space-x-2 cursor-pointer active:scale-95"
                        >
                          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse shrink-0" />
                          <span>Generate Route Plan under AI Companion</span>
                        </button>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
