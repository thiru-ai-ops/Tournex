import React, { useState, useMemo } from 'react';
import { Destination, Hotel, TabType, Booking } from '../types';
import { POPULAR_HOTELS } from '../data';
import TournexNotificationGateway from './TournexNotificationGateway';
import { 
  Search, MapPin, Compass, Landmark, ArrowRight, ShieldCheck, Heart, Sparkles, 
  Star, Moon, CheckCircle, ChevronRight, MessageCircle, X, Users, Calendar, 
  Building, Phone, Mail, User, Info, Globe, Map
} from 'lucide-react';

interface ExploreViewProps {
  onSelectDestination: (destName: string) => void;
  onAddBooking: (booking: Booking) => void;
  setActiveTab: (tab: TabType) => void;
  destinations: Destination[];
  onAddDestination: (dest: Destination) => void;
}

export default function ExploreView({ onSelectDestination, onAddBooking, setActiveTab, destinations, onAddDestination }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<Hotel | null>(null);

  // Expanded Explore states for Festivals and Gastronomy
  const [activeFestivalIndex, setActiveFestivalIndex] = useState<number>(0);
  const [customFestivalSearch, setCustomFestivalSearch] = useState<string>('');
  const [selectedCuisineCategory, setSelectedCuisineCategory] = useState<string>('All');
  const [savedGastronomyList, setSavedGastronomyList] = useState<string[]>([]);

  // Advanced Interactive Spots & Custom Package Stay states
  const [activeDetailsDest, setActiveDetailsDest] = useState<Destination | null>(null);
  const [numTravelers, setNumTravelers] = useState(1);
  const [numDays, setNumDays] = useState(4);
  const [travelerDetails, setTravelerDetails] = useState<Array<{ name: string; age: string; gender: string }>>([
    { name: '', age: '', gender: 'Male' }
  ]);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [numRooms, setNumRooms] = useState(1);
  
  const [nationalSpotSearch, setNationalSpotSearch] = useState('');
  const [validationError, setValidationError] = useState('');
  const [bookingCompletedPackage, setBookingCompletedPackage] = useState<Booking | null>(null);

  // States for individual hotel-only booking with mandatory guest details and room count
  const [hotelToBook, setHotelToBook] = useState<Hotel | null>(null);
  const [hotelCustomerName, setHotelCustomerName] = useState('');
  const [hotelCustomerEmail, setHotelCustomerEmail] = useState('');
  const [hotelCustomerPhone, setHotelCustomerPhone] = useState('');
  const [hotelNumRooms, setHotelNumRooms] = useState(1);
  const [hotelNumNights, setHotelNumNights] = useState(4);
  const [hotelValidationError, setHotelValidationError] = useState('');
  const [hotelBookingSuccess, setHotelBookingSuccess] = useState<Booking | null>(null);

  // TourNex Notification Gateway states for SMS/Gmail and pamphlet sending
  const [activeGatewayBooking, setActiveGatewayBooking] = useState<Booking | null>(null);
  const [gatewayPhone, setGatewayPhone] = useState('');
  const [gatewayEmail, setGatewayEmail] = useState('');

  const handleTravelersChange = (count: number) => {
    setNumTravelers(count);
    setTravelerDetails((prev) => {
      const newDetails = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          newDetails.push({ name: '', age: '', gender: 'Male' });
        }
      } else if (count < prev.length) {
        return newDetails.slice(0, count);
      }
      return newDetails;
    });
  };

  // Compile all spots across India for searchable nationwide overview
  const allTouristSpotsAcrossIndia = useMemo(() => {
    const list: Array<{ name: string; description: string; image: string; sourceCity: string; sourceState: string }> = [];
    destinations.forEach(dest => {
      if (dest.touristSpots) {
        dest.touristSpots.forEach(spot => {
          list.push({
            ...spot,
            sourceCity: dest.name,
            sourceState: dest.state
          });
        });
      }
    });
    return list;
  }, [destinations]);

  const openBookingPortal = (dest: Destination) => {
    setActiveDetailsDest(dest);
    setValidationError('');
    setBookingCompletedPackage(null);
    setNumTravelers(1);
    setNumDays(4);
    setTravelerDetails([{ name: '', age: '', gender: 'Male' }]);
    setSelectedHotelIndex(0);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setNumRooms(1);
  };

  const handleConfirmPackageAndHotelBooking = () => {
    if (!activeDetailsDest) return;
    
    // Validate travelers names are provided
    const missingName = travelerDetails.some(t => !t.name.trim());
    if (missingName) {
      setValidationError('Please provide full names for all travelers in your tour list.');
      return;
    }

    // Validate stay customer details are provided
    if (!customerName.trim()) {
      setValidationError('Please enter the primary guest contact name for the hotel stay.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setValidationError('Please enter a valid guest email for reservations confirmation.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setValidationError('Please enter a valid guest contact phone number.');
      return;
    }

    // Validate number of rooms
    if (numRooms <= 0) {
      setValidationError('Please specify at least 1 room for the stay booking confirmation.');
      return;
    }

    const localHotels = activeDetailsDest.hotels && activeDetailsDest.hotels.length > 0 ? activeDetailsDest.hotels : POPULAR_HOTELS;
    const selectedHotel = localHotels[selectedHotelIndex] || localHotels[0];

    const randomId = `TNX-PKHST-${Math.floor(100000 + Math.random() * 900000)}`;
    const packagePrice = numTravelers * numDays * 3500;
    const hotelPrice = numRooms * numDays * selectedHotel.price;
    const grandTotalPrice = packagePrice + hotelPrice;

    const spotNames = activeDetailsDest.touristSpots?.map(s => s.name) || [];

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      name: `Premium Package Tour in ${activeDetailsDest.name} + Stay at ${selectedHotel.name}`,
      status: 'UPCOMING',
      dates: `Next Week • ${numDays} Days & ${numDays} Nights (${numRooms} Room${numRooms > 1 ? 's' : ''})`,
      price: grandTotalPrice,
      bookingId: randomId,
      image: selectedHotel.image || activeDetailsDest.image,
      spotsIncluded: spotNames,
      hotelName: selectedHotel.name,
      hotelImage: selectedHotel.image,
      nightsCount: numDays,
      roomsCount: numRooms,
      isPackage: true
    };

    onAddBooking(newBooking);
    setBookingCompletedPackage(newBooking);
    setActiveGatewayBooking(newBooking);
    setGatewayPhone(customerPhone);
    setGatewayEmail(customerEmail);
    setValidationError('');
  };

  const categories = [
    { label: 'All', icon: Compass },
    { label: 'Heritage', icon: Landmark },
    { label: 'Coastal', icon: Heart },
    { label: 'Adventure', icon: Compass },
    { label: 'Spiritual', icon: Sparkles },
    { label: 'Relaxing', icon: ShieldCheck }
  ];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const cleanQuery = searchQuery.trim().toLowerCase();
    const matched = destinations.find(
      (dest) => dest.name.toLowerCase() === cleanQuery || 
                dest.name.toLowerCase().includes(cleanQuery) ||
                dest.state.toLowerCase() === cleanQuery ||
                dest.state.toLowerCase().includes(cleanQuery)
    );

    if (matched) {
      onSelectDestination(matched.name);
      setActiveTab('gateway');
    } else {
      const capitalizedQuery = searchQuery.trim().replace(/\b\w/g, c => c.toUpperCase());
      
      let category = 'Relaxing';
      if (cleanQuery.includes('beach') || cleanQuery.includes('coastal') || cleanQuery.includes('island') || cleanQuery.includes('sea') || cleanQuery.includes('marine')) {
        category = 'Coastal';
      } else if (cleanQuery.includes('fort') || cleanQuery.includes('temple') || cleanQuery.includes('palace') || cleanQuery.includes('heritage') || cleanQuery.includes('history') || cleanQuery.includes('ruins')) {
        category = 'Heritage';
      } else if (cleanQuery.includes('mountain') || cleanQuery.includes('trek') || cleanQuery.includes('raft') || cleanQuery.includes('valley') || cleanQuery.includes('adventure') || cleanQuery.includes('hills')) {
        category = 'Adventure';
      } else if (cleanQuery.includes('yoga') || cleanQuery.includes('meditation') || cleanQuery.includes('spiritual') || cleanQuery.includes('ashram')) {
        category = 'Spiritual';
      }

      let image = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800';
      if (category === 'Coastal') {
        image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800';
      } else if (category === 'Heritage') {
        image = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800';
      } else if (category === 'Adventure') {
        image = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800';
      } else if (category === 'Spiritual') {
        image = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800';
      }

      const id = capitalizedQuery.toLowerCase().replace(/\s+/g, '-');
      const newCustomDest: Destination = {
        id,
        name: capitalizedQuery,
        state: 'Custom Indian Hub',
        category,
        description: `Explore customizable tours, nearby accommodations, local cuisine delicacies, and ASI guides in gorgeous ${capitalizedQuery}.`,
        rating: 4.8,
        estMinBudget: 5000,
        estMaxBudget: 15000,
        image,
        hotness: 'Trending',
        coords: {
          x: 35 + Math.floor(Math.random() * 25),
          y: 40 + Math.floor(Math.random() * 35),
        }
      };

      onAddDestination(newCustomDest);
      onSelectDestination(newCustomDest.name);
      setActiveTab('gateway');
    }
  };

  const handleBookHotel = (hotel: Hotel) => {
    setHotelToBook(hotel);
    setHotelCustomerName('');
    setHotelCustomerEmail('');
    setHotelCustomerPhone('');
    setHotelNumRooms(1);
    setHotelNumNights(3);
    setHotelValidationError('');
    setHotelBookingSuccess(null);
  };

  const handleConfirmHotelOnlyBooking = () => {
    if (!hotelToBook) return;

    if (!hotelCustomerName.trim()) {
      setHotelValidationError('Please enter the primary guest contact name.');
      return;
    }
    if (!hotelCustomerEmail.trim() || !hotelCustomerEmail.includes('@')) {
      setHotelValidationError('Please enter a valid guest email for confirmation.');
      return;
    }
    if (!hotelCustomerPhone.trim() || hotelCustomerPhone.length < 8) {
      setHotelValidationError('Please enter a valid guest phone number.');
      return;
    }
    if (hotelNumRooms <= 0) {
      setHotelValidationError('Please specify at least 1 room.');
      return;
    }
    if (hotelNumNights <= 0) {
      setHotelValidationError('Please specify at least 1 night.');
      return;
    }

    const randomId = `TNX-STAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalCost = hotelNumRooms * hotelNumNights * hotelToBook.price;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      name: `Luxury Stay at ${hotelToBook.name}`,
      status: 'UPCOMING',
      dates: `Next Week • ${hotelNumNights} Nights (${hotelNumRooms} Room${hotelNumRooms > 1 ? 's' : ''})`,
      price: totalCost,
      bookingId: randomId,
      image: hotelToBook.image
    };

    onAddBooking(newBooking);
    setHotelBookingSuccess(newBooking);
    setActiveGatewayBooking(newBooking);
    setGatewayPhone(hotelCustomerPhone);
    setGatewayEmail(hotelCustomerEmail);
    setHotelValidationError('');
  };

  return (
    <div className="space-y-12 pb-16" id="explore-view-root">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl" id="hero-section">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 bg-cover bg-center blend-multiply opacity-55 transition-all duration-700 hover:scale-105" 
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1400')` }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20"></div>

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:px-12 sm:py-28 lg:px-16">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 border border-blue-500/20 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span>Introducing Intelligent Indian Expeditions</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4 text-balance">
            Serenity in God's <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
              Own Country & Beyond
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-300 mb-8 leading-relaxed">
            Experience the lush backwaters of Kerala and decode ancient trails with conversational AI guidance.
          </p>

          {/* Majestic Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="mx-auto max-w-2xl bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200"
          >
            <div className="relative flex-1 w-full flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Where would you like to explore? (e.g. Kerala, Jaipur...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-slate-800 placeholder-slate-400 focus:outline-none py-2 text-sm font-medium"
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 text-center flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Explore Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Decorative Category Picker */}
      <section className="-mt-6 relative z-10 mx-auto max-w-5xl px-4" id="categories-picker">
        <div className="flex flex-wrap justify-center gap-3 bg-white border border-slate-100 rounded-2xl shadow-lg p-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending Spots Grid */}
      <section className="space-y-4" id="trending-destinations">
        <div className="flex items-end justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Trending Destinations</h2>
            <p className="text-slate-500 text-sm">Finest curation of historic and scenic locations based on real-time spikes</p>
          </div>
          <button 
            onClick={() => setActiveTab('gateway')}
            className="flex items-center space-x-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>View Interactive Map</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 max-w-xl mx-auto px-6 shadow-sm">
            <Compass className="h-10 w-10 text-blue-500 mx-auto mb-2 animate-spin-slow" />
            <h3 className="text-slate-800 font-bold text-lg">No Match Found for "{searchQuery}"</h3>
            <p className="text-slate-500 text-xs mt-1 mb-6 leading-relaxed">
              We couldn't find a preset destination matching your query. Press the button below to dynamically build a curated AI trip and map coordinates for "{searchQuery}"!
            </p>
            <button
              onClick={() => handleSearchSubmit()}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-5 py-3 rounded-xl text-xs transition duration-200 active:scale-95 shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4 fill-current text-white animate-pulse" />
              <span>Create Dynamic AI Trip for "{searchQuery}"</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.slice(0, 6).map((dest) => (
              <div 
                key={dest.id}
                className="group relative flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Image panel */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{dest.hotness}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white shadow-sm font-mono">
                    Est. ₹{dest.estMinBudget.toLocaleString()} / person
                  </div>
                </div>

                {/* Content info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <MapPin className="h-3 w-3 text-red-500" />
                      <span>{dest.state}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 transition truncate">
                    {dest.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed flex-1 overflow-hidden line-clamp-2">
                    {dest.description}
                  </p>

                  <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => openBookingPortal(dest)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      <span>View Tourist Spots & Book Packages</span>
                    </button>

                    <div className="flex items-center justify-between gap-2.5">
                      <button 
                        onClick={() => {
                          onSelectDestination(dest.name);
                          setActiveTab('companion');
                        }}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Discuss with AI</span>
                      </button>
                      <button 
                        onClick={() => {
                          onSelectDestination(dest.name);
                          setActiveTab('gateway');
                        }}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>Explore Map</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Hotels Section */}
      <section className="space-y-4" id="popular-hotels">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 animate-pulse-once">Luxury Stays & Heritage Resorts</h2>
          <p className="text-slate-500 text-sm">Exquisite luxury and budget boutique choices optimized for maximum traveler satisfaction</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POPULAR_HOTELS.map((hotel) => (
            <div 
              key={hotel.id}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition"
            >
              <div className="relative h-44 bg-slate-100">
                <img 
                  src={hotel.image} 
                  alt={hotel.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center space-x-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                  <span>{hotel.rating}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base text-slate-900 leading-snug">
                    {hotel.name}
                  </h3>
                  <p className="text-slate-500 text-xs flex items-center space-x-1 mt-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{hotel.location}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                  <div>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block">Per Night</span>
                    <span className="font-display font-extrabold text-blue-600 text-base">₹{hotel.price.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => handleBookHotel(hotel)}
                    className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    Book Stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Heritage & Festival Calendar */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-950 shadow-xl" id="cultural-festivals-hub">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-indigo-900/60 pb-5 gap-4">
          <div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-800 px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">
              Dynamic Culture Live Map
            </span>
            <h2 className="font-display text-2xl font-black text-white mt-1.5 tracking-tight">
              India's Grand Heritage & Festival Calendar
            </h2>
            <p className="text-indigo-200/70 text-xs mt-1">
              Synchronize your travel with historical celebrations, local visual fairs, and traditional spectacles.
            </p>
          </div>
          <div className="relative shrink-0 md:w-64">
            <span className="absolute left-3 top-2 text-indigo-400">🔍</span>
            <input 
              type="text"
              placeholder="Search festivals or fair..."
              value={customFestivalSearch}
              onChange={(e) => setCustomFestivalSearch(e.target.value)}
              className="w-full bg-slate-950/60 border border-indigo-900/70 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Festival items grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
          <div className="lg:col-span-4 space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {[
              { id: 0, name: 'Lathmar Holi Carnival', city: 'Mathura (near Agra)', date: 'March 14, 2027', icon: '🎨', type: 'Spiritual & Colors', keywords: 'holi mathura agra colors' },
              { id: 1, name: 'Nehru Trophy Snake Boat Race', city: 'Alleppey Lagoons', date: 'September 5, 2026', icon: '🛶', type: 'Adventure & Sport', keywords: 'boat race kerala water alleppey' },
              { id: 2, name: 'Pushkar Camel Desert Fair', city: 'Pushkar (near Jaipur)', date: 'November 22, 2026', icon: '🐫', type: 'Heritage & Trade', keywords: 'camel fair rajasthan desert jaipur' },
              { id: 3, name: 'Ganga Deepotsav Dev Deepawali', city: 'Varanasi Ancient Ghats', date: 'November 24, 2026', icon: '🕯️', type: 'Spiritual Ceremony', keywords: 'ganga deepavali varanasi lights ghats' }
            ].filter(f => {
              if (!customFestivalSearch) return true;
              return f.name.toLowerCase().includes(customFestivalSearch.toLowerCase()) || 
                     f.city.toLowerCase().includes(customFestivalSearch.toLowerCase()) ||
                     f.keywords.toLowerCase().includes(customFestivalSearch.toLowerCase());
            }).map((fest) => (
              <div 
                key={fest.id}
                onClick={() => setActiveFestivalIndex(fest.id)}
                className={`p-3.5 rounded-xl cursor-pointer transition border text-left flex items-center space-x-3 ${
                  activeFestivalIndex === fest.id 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md' 
                    : 'bg-slate-950/50 border-indigo-950 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="h-10 w-10 shrink-0 bg-slate-900 rounded-lg flex items-center justify-center text-xl border border-indigo-900/30">
                  {fest.icon}
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-xs leading-snug truncate">{fest.name}</h4>
                  <span className="text-[10px] text-indigo-300 block font-mono mt-0.5">{fest.city}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed dynamic view for the active festival */}
          <div className="lg:col-span-8 bg-slate-950/50 border border-indigo-900/40 p-5 rounded-2xl flex flex-col md:flex-row gap-5">
            {[
              {
                id: 0,
                name: 'Lathmar Holi Carnival',
                city: 'Mathura (near Agra)',
                date: 'March 14, 2027',
                countdown: '285 Days remaining',
                description: 'Experience the world-famous festival where women of Barsana playfully challenge men with bamboo sticks. Colored water showers from temple towers, casting grand spectrums of gulal clouds over thousands of unified devotees.',
                bestViewingSpot: 'Radha Rani Temple Courtyard, Barsana',
                heritageFact: 'This style of celebration dates back over 500 years, commemorating Lord Krishna visiting Radha’s village and playful teasing.',
                tip: 'Wear organic white cotton linen and carry specialized zip locks to safeguard phone monitors from wet paint splashes.',
                plannerCity: 'Agra'
              },
              {
                id: 1,
                name: 'Nehru Trophy Snake Boat Race',
                city: 'Alleppey Lagoons',
                date: 'September 5, 2026',
                countdown: '95 Days remaining',
                description: 'Witness over 100 synchronized oarsmen rowing massive 100-foot-long wooden snake boats (Chundan Vallams) through placid backwaters. Powerful percussion beats echo off the palms as water is carved in high-speed, heart-pounding racing.',
                bestViewingSpot: 'Punnamada Lake Pavilions, Alleppey',
                heritageFact: 'Instituted by India’s first Prime Minister Jawaharlal Nehru in 1952, who was mesmerized by the fierce rhythm of local water craftsmanship.',
                tip: 'Arrive at the jetty by 10 AM to secure frontline terrace tickets away from high-density crowd points.',
                plannerCity: 'Alleppey'
              },
              {
                id: 2,
                name: 'Pushkar Camel Desert Fair',
                city: 'Pushkar (near Jaipur)',
                date: 'November 22, 2026',
                countdown: '175 Days remaining',
                description: 'A spectacular assembly of 50,000 camels, horses, and cattle, transforming the glowing desert sands of Pushkar. Tribal musicians, traditional snake-charmers, and kaleidoscope desert bazaars bring Rajasthan’s soul to life.',
                bestViewingSpot: 'Pushkar Stadium Arena grounds',
                heritageFact: 'One of the world’s last remaining authentic pastoral barter trades, celebrated on the auspicious Kartik Purnima full moon.',
                tip: 'Book desert safaris during dusk for unmatched photographic silhouettes against deep crimson dunes.',
                plannerCity: 'Jaipur'
              },
              {
                id: 3,
                name: 'Ganga Deepotsav Dev Deepawali',
                city: 'Varanasi Ancient Ghats',
                date: 'November 24, 2026',
                countdown: '177 Days remaining',
                description: 'A mind-blowing spiritual illumination where over 1,000,000 floating oil lamps (diyas) light up the entire crescent sweep of Varanasi’s ghats. Massive fire-worship prayers (Aarti) echo through the ancient smoke-filled temples.',
                bestViewingSpot: 'Mid-stream private row boat overlooking Dashashwamedh Ghat',
                heritageFact: 'Celebrated exactly 15 days after Diwali, honoring the day Lord Shiva vanquished the demon Tripurasura to save the gods.',
                tip: 'Book double-decker wooden boats three months in advance as river cruise capacity gets heavily constrained.',
                plannerCity: 'Varanasi'
              }
            ].map((f) => {
              if (f.id !== activeFestivalIndex) return null;
              return (
                <React.Fragment key={f.id}>
                  <div className="flex-1 space-y-4 text-left">
                    <div className="flex items-center justify-between border-b border-indigo-900/40 pb-2">
                      <div>
                        <h3 className="font-display font-black text-white text-base leading-none">{f.name}</h3>
                        <span className="text-[10px] text-indigo-400 font-mono mt-1 block">{f.city}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-550 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold shrink-0 animate-pulse">
                        ⏱️ {f.countdown}
                      </span>
                    </div>

                    <p className="text-slate-250 text-xs leading-relaxed text-indigo-100">
                      {f.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-indigo-950">
                        <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold block">Best Vantage Spot</span>
                        <p className="font-semibold text-slate-100 mt-0.5 leading-snug">{f.bestViewingSpot}</p>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-indigo-950">
                        <span className="text-[9px] font-mono text-amber-400 uppercase font-bold block">Local Heritage Fact</span>
                        <p className="text-slate-300 mt-0.5 leading-snug text-[11px]">{f.heritageFact}</p>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-3 rounded-xl text-[11px] leading-relaxed flex items-start gap-2.5">
                      <span className="text-sm">💡</span>
                      <div>
                        <strong className="text-[9px] font-mono text-amber-400 uppercase block font-bold">Safety & Gear Advisory</strong>
                        <p className="mt-0.5 text-slate-200">{f.tip}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-44 shrink-0 flex flex-col justify-between bg-indigo-900/20 p-4 rounded-xl border border-indigo-950 text-center space-y-3">
                    <div>
                      <span className="text-[9px] text-indigo-400 uppercase font-mono font-bold block">EXPERIENCE DESIGN</span>
                      <p className="text-xs text-slate-300 mt-1 leading-normal">
                        Instantly construct a dynamic 4-Day local travel checklist matching this celebration.
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        onSelectDestination(f.plannerCity);
                        setActiveTab('companion');
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-550 hover:bg-indigo-550 hover:bg-indigo-550 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition duration-150 shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-500 active:scale-95"
                    >
                      <Compass className="h-4 w-4" />
                      <span>Discuss on AI Planner</span>
                    </button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gourmet Food Specialties Hub (Gastronomy) */}
      <section className="space-y-4" id="cuisine-specialties-section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 text-left">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Culinary Specialties & Authentic Food Guide</h2>
            <p className="text-slate-500 text-xs mt-1">Discover native spices, secret dishes, and local hygiene verified spots of India.</p>
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 self-start text-xs font-semibold">
            {['All', 'Curries', 'Sweets & Snacks', 'Seafood'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCuisineCategory(cat)}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  selectedCuisineCategory === cat 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-450 hover:text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="gastronomy-grid">
          {[
            { name: 'Karimeen Pollichathu', group: 'Seafood', city: 'Alleppey (Kerala)', detail: 'Pearl Spot fish heavily marinated in pure coconut oil with hand-crushed shallots, sweet curry leaves, fresh ginger garlic, then slow charcoal-grilled inside soft charred banana leaves.', rating: 4.9, location: 'Alleppey Jetty floating kitchen', cost: '₹550', icon: '🐟', recipeSecret: 'Slow-smoked on tawa for 15 minutes.' },
            { name: 'Pure Desi Ghee Dal Baati Churma', group: 'Curries', city: 'Jaipur (Rajasthan)', detail: 'Wood-fired wheat balls (Baati) immersed in hot clarified butter, served with a secret blend of five-lentil yellow dal, and sweet ground wheat dessert powder (Churma).', rating: 4.8, location: 'Chokhi Dhani Traditional Village, Jaipur', cost: '₹750', icon: '🍽️', recipeSecret: 'Dal is tempered with royal cumin & wild asafoetida.' },
            { name: 'Spicy Kashmiri Rogan Josh', group: 'Curries', city: 'Gulmarg (Kashmir)', detail: 'Fragrant tender cuts of high-altitude lamb slow-cooked in thick gravy of authentic sun-dried Kashmiri red chilies, structural cardamoms, sweet fennel powder, and rich alkanet roots.', rating: 4.9, location: 'Khyber Dining Hall, Gulmarg Gully', cost: '₹950', icon: '🍲', recipeSecret: 'True Rogan Josh never uses onions or tomatoes!' },
            { name: 'Traditional Bedai Pooris and Helical Jalebis', group: 'Sweets & Snacks', city: 'Agra (Uttar Pradesh)', detail: 'Lentil-stuffed golden puffed wheat pooris (Bedai) served alongside heavily spiced and tangy yellow potato gravy, followed immediately by warm, crystal syrup helical jalebis.', rating: 4.7, location: 'Deviram Sweets inside Pratap Pura, Agra', cost: '₹90', icon: '🧇', recipeSecret: 'Saffron is added into the sugar syrup during boil.' },
            { name: 'Traditional Palolem Beach Prawn Balchão', group: 'Seafood', city: 'South Goa Beachfront', detail: 'Tender ocean prawns stir-fried in a fiery, sweet, sour, and intensely spicy paste made from sun-dried Goan red chilies, toddy vinegar, pure black pepper, and whole ginger keys.', rating: 4.8, location: 'Azure Palms Overlook Dining terrace', cost: '₹620', icon: '🦐', recipeSecret: 'Vinegar must be naturally fermented Goan coconut toddy.' },
            { name: 'Varanasi Thandai & Malaiyyo', group: 'Sweets & Snacks', city: 'Varanasi Central', detail: 'Varanasi specialty of saffron-scented frothed milk dew drops (Malaiyyo) garnished with pistachios, or traditional thandai loaded with crushed almonds, cardamom, and fennel.', rating: 4.8, location: 'Blue Lassi shop, Varanasi Ghat alleyway', cost: '₹120', icon: '🥛', recipeSecret: 'Malaiyyo is prepared only under the winter moon dew.' }
          ].filter(item => {
            if (selectedCuisineCategory === 'All') return true;
            if (selectedCuisineCategory === 'Curries' && item.group === 'Curries') return true;
            if (selectedCuisineCategory === 'Sweets & Snacks' && item.group === 'Sweets & Snacks') return true;
            if (selectedCuisineCategory === 'Seafood' && item.group === 'Seafood') return true;
            return false;
          }).map((dish) => {
            const isSaved = savedGastronomyList.includes(dish.name);
            return (
              <div 
                key={dish.name}
                className="bg-white rounded-2xl border border-slate-200/80 p-4.5 shadow-sm text-left flex flex-col justify-between hover:border-slate-350 transition hover:shadow-md h-[275px]"
                id={`dish-card-${dish.name.replace(/\s+/g, '-')}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <span className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
                        {dish.icon}
                      </span>
                      <div className="truncate">
                        <h4 className="font-display font-bold text-xs text-slate-900 truncate tracking-tight">{dish.name}</h4>
                        <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{dish.city}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (isSaved) {
                          setSavedGastronomyList(savedGastronomyList.filter(d => d !== dish.name));
                        } else {
                          setSavedGastronomyList([...savedGastronomyList, dish.name]);
                        }
                      }}
                      className={`h-7 w-7 rounded-full border flex items-center justify-center transition active:scale-90 cursor-pointer ${
                        isSaved 
                          ? 'bg-rose-50 border-rose-200 text-rose-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                      }`}
                      title={isSaved ? 'Remove from Culinary Passport' : 'Save to Culinary Passport'}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-slate-500 text-[11px] leading-relaxed mt-2.5 line-clamp-3">
                    {dish.detail}
                  </p>

                  <div className="mt-3 bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] leading-tight text-slate-600 font-medium">
                    <span className="text-[8px] font-mono font-bold text-indigo-600 block uppercase">CHEF SECRET COOKING KEY</span>
                    <p className="mt-0.5 italic">"{dish.recipeSecret}"</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] mt-2.5 font-medium">
                  <div>
                    <span className="text-slate-400 text-[8px] uppercase tracking-wider font-bold">Standard Price</span>
                    <strong className="text-slate-800 font-mono font-bold">{dish.cost}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[8px] uppercase tracking-wider font-bold">Famous Kitchen Spot</span>
                    <span className="font-bold text-slate-700 truncate max-w-[150px] block">{dish.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose TourNex (Bento Style Features) */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/50" id="features-bento">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Discover India with Next-Gen Intelligence</h2>
          <p className="text-slate-500 text-sm mt-1">Everything you need to plan, coordinate, and experience India, in a single cohesive platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4 font-bold text-lg">
              🤖
            </div>
            <h3 className="font-display font-semibold text-base text-slate-900">AI Travel Companion</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              24/7 localized assistant to suggest hidden sights, weather warnings, and local delicacies.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4 font-bold text-lg">
              📈
            </div>
            <h3 className="font-display font-semibold text-base text-slate-900">Custom Budget Splitting</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Seamlessly handle split transactions within your group. Transparent settlements in seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4 font-bold text-lg">
              📍
            </div>
            <h3 className="font-display font-semibold text-base text-slate-900">Route Map Decoders</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Plan sequences of travel utilizing local dynamic hotbeds for ideal transit flow.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4 font-bold text-lg">
              🏰
            </div>
            <h3 className="font-display font-semibold text-base text-slate-900">Heritage Decoded</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Instant cultural background, visual guides, and audio translations on click.
            </p>
          </div>
        </div>
      </section>

      {/* Traveler Testimonials */}
      <section className="space-y-4" id="testimonials">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 text-center">Loved by India's Best Explorers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-1.5 text-amber-400 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-slate-600 text-xs italic leading-relaxed">
              "TourNex redesigned our family Rajasthan tour. The smart budget splitter computed balances instantly, and the chatbot's guide tips were stellar!"
            </p>
            <span className="block text-slate-800 text-xs font-bold mt-4 font-display">Sarah M., Bengaluru</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-1.5 text-amber-400 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-slate-600 text-xs italic leading-relaxed">
              "Exploring Ladakh was intimidating, but TourNex pointed us to lesser known passes and kept accurate tallies between Sanya and Priya."
            </p>
            <span className="block text-slate-800 text-xs font-bold mt-4 font-display">Arjun J., Mumbai</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-1.5 text-amber-400 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-slate-600 text-xs italic leading-relaxed">
              "Highly recommend the localized culinary widgets! Trying dal-baati churma based on AI reviews was an outstanding gastronomic highlight."
            </p>
            <span className="block text-slate-800 text-xs font-bold mt-4 font-display">Priya K., Delhi</span>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-lg text-center" id="ready-to-explore-banner">
        <h2 className="font-display text-3xl font-bold mb-3">Ready to Experience India Intelligently?</h2>
        <p className="text-blue-100 text-sm max-w-xl mx-auto mb-6">
          Unlock local curations, real-time context bots, and direct settlement with elite travel tools.
        </p>
        <button 
          onClick={() => setActiveTab('gateway')}
          className="bg-white hover:bg-slate-50 text-blue-600 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95"
        >
          Start Planning Your Journey
        </button>
      </section>

      {/* Booking Success Modal Banner */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" id="booking-modal">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 max-w-sm w-full text-center space-y-4 animate-scale-up">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-xl">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Booking Confirmed!</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Successfully reserved <strong>{bookingSuccessModal.name}</strong> for you on Oct 15 - Oct 19. The booking receipt has been created in your profile log under the "My Bookings" page.
            </p>
            <div className="bg-slate-50 text-[10px] font-mono text-slate-500 py-1.5 px-3 rounded-lg border border-slate-100">
              Transaction Verified • No charge to your profile
            </div>
            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={() => setBookingSuccessModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition"
              >
                Done
              </button>
              <button 
                onClick={() => {
                  setBookingSuccessModal(null);
                  setActiveTab('bookings');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
              >
                <span>View Bookings</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED OVERLAY: TOURIST SPOTS & SECURE BOOKING PORTAL */}
      {activeDetailsDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden" id="spots-booking-portal">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-150 max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-scale-up" id="modal-container-pane">
            
            {/* Header portion */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block">Interactive Expedition Portal</span>
                  <h2 className="font-display font-extrabold text-lg flex items-center gap-1.5">
                    <span>{activeDetailsDest.name} Discovery Hub</span>
                    <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded">
                      {activeDetailsDest.state}
                    </span>
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setActiveDetailsDest(null)}
                className="p-1.5 hover:bg-slate-850 rounded-xl transition text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-grow" id="modal-scroll-pane">
              
              {/* Cover Summary Banner */}
              <div className="relative rounded-2xl overflow-hidden shadow-md h-52 bg-slate-950 text-white flex items-end shrink-0">
                <img 
                  src={activeDetailsDest.image} 
                  alt={activeDetailsDest.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="relative p-6 space-y-1.5">
                  <div className="inline-flex items-center space-x-1.5 bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider py-0.5 px-2.5 rounded-full">
                    <span>★ {activeDetailsDest.rating} Rating</span>
                    <span>•</span>
                    <span>{activeDetailsDest.category}</span>
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl">{activeDetailsDest.name}, {activeDetailsDest.state}</h3>
                  <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">{activeDetailsDest.description}</p>
                </div>
              </div>

              {/* SECTION I: SIGHTSEEING SPOTS IN THIS CITY */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="font-display font-extrabold text-slate-900 text-base flex items-center space-x-2">
                    <span className="p-1 bg-yellow-500/10 text-yellow-600 rounded">📍</span>
                    <span>Famous Tourist Spots in {activeDetailsDest.name}</span>
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">Explore local landmark highlights and iconic monuments registered under regional catalogs.</p>
                </div>

                {activeDetailsDest.touristSpots && activeDetailsDest.touristSpots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {activeDetailsDest.touristSpots.map((spot, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden flex flex-col hover:border-slate-350 transition">
                        <div className="relative h-28 bg-slate-100 w-full shrink-0">
                          <img 
                            src={spot.image} 
                            alt={spot.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <h5 className="font-display font-bold text-xs text-slate-900 uppercase tracking-tight">{spot.name}</h5>
                          <p className="text-[10px] text-slate-500 mt-1 lines-clamp-3 leading-relaxed flex-grow">{spot.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 p-6 rounded-2xl text-center text-xs text-slate-500">
                    No custom tourist spots cataloged for this destination yet. Our system catalog auto-populates live data packages.
                  </div>
                )}
              </div>

              {/* SECTION II: ADVANCED LOOKUP - INCREDIBLE TOURIST SPOTS ACROSS INDIA */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                      <Globe className="h-4 w-4 text-indigo-600" />
                      <span>Scenic Tourist Spots Network across India</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug">Browse other breathtaking highlights to customize or link your regional expedition plans.</p>
                  </div>
                  <div className="relative max-w-xs w-full shrink-0">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search spots across India (e.g. Taj, Hawa, Beach...)"
                      value={nationalSpotSearch}
                      onChange={(e) => setNationalSpotSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 snap-x select-none">
                  {(nationalSpotSearch 
                    ? allTouristSpotsAcrossIndia.filter(s => 
                        s.name.toLowerCase().includes(nationalSpotSearch.toLowerCase()) || 
                        s.sourceCity.toLowerCase().includes(nationalSpotSearch.toLowerCase())
                      )
                    : allTouristSpotsAcrossIndia
                  ).slice(0, 10).map((spot, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-60 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs flex flex-col snap-start"
                    >
                      <div className="relative h-24 w-full">
                        <img 
                          src={spot.image} 
                          alt={spot.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1.5 left-2 bg-slate-950/80 text-white text-[9px] font-mono font-bold py-0.5 px-1.5 rounded">
                          {spot.sourceCity}, {spot.sourceState}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h5 className="text-[11px] font-bold text-slate-900 uppercase truncate">{spot.name}</h5>
                        <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 h-7">{spot.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESERVATION SYSTEM CONTAINER */}
              {bookingCompletedPackage ? (
                <div className="bg-emerald-55/40 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 animate-scale-up" id="success-voucher">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-2xl">
                    ✓
                  </div>
                  <h4 className="font-display font-black text-slate-900 text-lg">Indie Tour Package Locked & Verified!</h4>
                  <div className="max-w-md mx-auto bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-left font-sans space-y-3.5 relative">
                    <div className="absolute top-4 right-4 text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-black">ACTIVE TICKET</div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">VOUCHER IDENTITY RECORD</span>
                      <strong className="text-sm text-blue-600 block">{bookingCompletedPackage.bookingId}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">Destination Base:</span>
                        <p className="font-bold text-slate-800">{activeDetailsDest.name}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium font-bold text-indigo-600">Stay Duration:</span>
                        <p className="font-bold text-indigo-700">{numDays} Days & {numDays} Nights</p>
                      </div>
                    </div>

                    {/* Accommodation details with Image */}
                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <span className="text-[10px] text-slate-400 font-mono block font-bold uppercase">SECURED RESORT LODGING</span>
                      <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <img 
                          src={((activeDetailsDest.hotels && activeDetailsDest.hotels.length > 0 ? activeDetailsDest.hotels : POPULAR_HOTELS)[selectedHotelIndex] || POPULAR_HOTELS[0]).image} 
                          alt="Hotel stay visual"
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="truncate">
                          <h5 className="font-bold text-xs text-slate-800 truncate">
                            {((activeDetailsDest.hotels && activeDetailsDest.hotels.length > 0 ? activeDetailsDest.hotels : POPULAR_HOTELS)[selectedHotelIndex] || POPULAR_HOTELS[0]).name}
                          </h5>
                          <p className="text-[10px] text-slate-500">
                            Rooms Configured: {numRooms} Room{numRooms > 1 ? 's' : ''} • {numDays} Nights stay
                          </p>
                          <span className="inline-block mt-0.5 text-[9px] text-emerald-600 bg-emerald-50 font-bold px-1.5 py-0.5 rounded">
                            ★ {((activeDetailsDest.hotels && activeDetailsDest.hotels.length > 0 ? activeDetailsDest.hotels : POPULAR_HOTELS)[selectedHotelIndex] || POPULAR_HOTELS[0]).rating} Verified Stay
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tourist spots they are going to see */}
                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <span className="text-[10px] text-slate-400 font-mono block font-bold uppercase">SIGHTSEEING ITINERARY ({activeDetailsDest.touristSpots?.length || 0} SPOTS INCLUDED)</span>
                      <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
                        {(activeDetailsDest.touristSpots || []).map((spot, idx) => (
                          <div key={idx} className="flex items-center space-x-1 bg-blue-50/70 border border-blue-105 px-2 py-1 rounded-lg text-[9px] text-blue-700 font-bold">
                            <span>🗺️ {spot.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-mono block font-bold uppercase font-medium">REGISTERED EXPEDITIONERS ({numTravelers})</span>
                      <div className="space-y-1">
                        {travelerDetails.map((t, index) => (
                          <div key={index} className="flex justify-between items-center bg-slate-50 p-1.5 rounded border border-slate-100 text-[10px] text-slate-600 font-medium">
                            <strong>{t.name}</strong>
                            <span>{t.age} yrs • {t.gender}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-mono font-medium">LODGING + PACKAGE INVOICE:</span>
                        <strong className="text-[10px] text-slate-600 font-medium font-mono">Completed Transaction</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block">Grand Price</span>
                        <strong className="text-lg text-slate-900 font-mono">₹{bookingCompletedPackage.price.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Your dynamic Indian travel vouchers are active. This booking has been created in your profile log under the "My Bookings" page.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button 
                      onClick={() => {
                        setActiveGatewayBooking(bookingCompletedPackage);
                        setGatewayPhone(customerPhone);
                        setGatewayEmail(customerEmail);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 font-bold active:scale-95 text-slate-900 px-5 py-2.5 rounded-xl text-xs transition duration-250 shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <span>📨 Dispatch Mobilizer & Brochure</span>
                    </button>
                    <button 
                      onClick={() => {
                        setActiveDetailsDest(null);
                        setActiveTab('bookings');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition duration-200"
                    >
                      View on Bookings Page
                    </button>
                    <button 
                      onClick={() => setActiveDetailsDest(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-705 font-semibold px-5 py-2.5 rounded-xl text-xs transition duration-200"
                    >
                      Back to Explorer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-display font-extrabold text-slate-900 text-base flex items-center space-x-2">
                      <span className="p-1 bg-blue-500/10 text-blue-600 rounded">🎟</span>
                      <span>Unified Dynamic Reservation Desk</span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">Customize your Indian travel package and link active hotel room accommodations in a single synchronized click.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    
                    {/* LEFT COLUMN: TOUR PACKAGE COMPOSITION */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-4">
                      <div className="flex border-b border-slate-100 pb-2.5 items-center justify-between">
                        <h5 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Part A: Curated Tour Package</h5>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">₹3,500 / traveler / day</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 tracking-widest mb-1.5">No. of Persons</label>
                          <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <select
                              value={numTravelers}
                              onChange={(e) => handleTravelersChange(parseInt(e.target.value) || 1)}
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1} Person{i > 0 && 's'}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 tracking-widest mb-1.5">No. of Days</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input 
                              type="number"
                              min="2"
                              max="30"
                              value={numDays}
                              onChange={(e) => setNumDays(Math.max(2, parseInt(e.target.value) || 2))}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Traveler dynamically rendered detailed forms */}
                      <div className="space-y-3.5 pt-2">
                        <span className="block text-[10px] font-mono font-bold uppercase text-slate-500 tracking-widest">Travelers Detailed Register</span>
                        
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                          {travelerDetails.map((t, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs relative">
                              <div className="absolute top-2.5 right-3 text-[9px] font-mono text-slate-400">Traveler #{idx + 1}</div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div className="sm:col-span-2">
                                  <label className="block text-[8px] font-mono uppercase text-slate-500">Full Name</label>
                                  <input 
                                    type="text"
                                    placeholder="Enter Name"
                                    value={t.name}
                                    onChange={(e) => {
                                      const updatedList = [...travelerDetails];
                                      updatedList[idx].name = e.target.value;
                                      setTravelerDetails(updatedList);
                                      setValidationError('');
                                    }}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono uppercase text-slate-500">Age</label>
                                  <input 
                                    type="number"
                                    placeholder="Age"
                                    value={t.age}
                                    onChange={(e) => {
                                      const updatedList = [...travelerDetails];
                                      updatedList[idx].age = e.target.value;
                                      setTravelerDetails(updatedList);
                                    }}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <span className="text-[8px] font-mono uppercase text-slate-500 mt-1 block">Gender:</span>
                                {['Male', 'Female', 'Other'].map(g => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => {
                                      const updatedList = [...travelerDetails];
                                      updatedList[idx].gender = g;
                                      setTravelerDetails(updatedList);
                                    }}
                                    className={`text-[9px] px-2.5 py-1 rounded-md border font-semibold transition ${
                                      t.gender === g 
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    {g}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: HOTEL ACCOMMODATIONS SETUP */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-4">
                      <div className="flex border-b border-slate-100 pb-2.5 items-center justify-between">
                        <h5 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Part B: Stay & Lodging</h5>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">hotel Image included</span>
                      </div>

                      {/* Hotel choice selector with image */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 tracking-widest">Select Luxury Resort</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {(activeDetailsDest.hotels && activeDetailsDest.hotels.length > 0 ? activeDetailsDest.hotels : POPULAR_HOTELS).map((hotel, index) => {
                            const isSelected = selectedHotelIndex === index;
                            return (
                              <button
                                type="button"
                                key={hotel.id}
                                onClick={() => setSelectedHotelIndex(index)}
                                className={`rounded-xl border p-2 text-left transition flex space-x-2.5 items-center cursor-pointer ${
                                  isSelected 
                                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs' 
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                              >
                                <img 
                                  src={hotel.image} 
                                  alt={hotel.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-150"
                                />
                                <div className="truncate flex-1">
                                  <span className="block font-bold text-[11px] text-slate-900 truncate leading-snug">{hotel.name}</span>
                                  <span className="block text-[9px] text-slate-500 font-mono">₹{hotel.price.toLocaleString()} / Night</span>
                                  <span className="block text-[9px] text-amber-500 font-bold leading-none">★ {hotel.rating} Rating</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Guest Stay Contact information */}
                      <div className="space-y-3.5 pt-1.5">
                        <span className="block text-[10px] font-mono font-bold uppercase text-slate-500 tracking-widest">Staying Customer Details Register</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[8px] font-mono uppercase text-slate-500 mb-1">Stay Holder Full Name</label>
                            <input 
                              type="text"
                              required
                              placeholder="e.g. Satyajit Ray"
                              value={customerName}
                              onChange={(e) => {
                                setCustomerName(e.target.value);
                                setValidationError('');
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-mono uppercase text-slate-500 mb-1">No. of Rooms</label>
                            <div className="relative">
                              <Building className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                              <input 
                                type="number"
                                required
                                min="1"
                                max="10"
                                value={numRooms}
                                onChange={(e) => setNumRooms(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[8px] font-mono uppercase text-slate-500 mb-1">Customer Email ID</label>
                            <input 
                              type="email"
                              required
                              placeholder="satyajit@gmail.com"
                              value={customerEmail}
                              onChange={(e) => {
                                setCustomerEmail(e.target.value);
                                setValidationError('');
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-mono uppercase text-slate-500 mb-1">Customer Phone Number</label>
                            <input 
                              type="tel"
                              required
                              placeholder="+91 XXXXX XXXXX"
                              value={customerPhone}
                              onChange={(e) => {
                                setCustomerPhone(e.target.value);
                                setValidationError('');
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* BOTTOM DESK INVOICE CHECKOUT CALCULATION */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block mb-1">A: Package Price</span>
                        <div className="flex items-baseline justify-center sm:justify-start space-x-1">
                          <strong className="text-lg font-mono">₹{(numTravelers * numDays * 3500).toLocaleString()}</strong>
                          <span className="text-[10px] text-slate-400">({numTravelers} Travelers × {numDays} Days)</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block mb-1">B: Resort Lodging</span>
                        <div className="flex items-baseline justify-center sm:justify-start space-x-1">
                          <strong className="text-lg font-mono">
                            ₹{(numRooms * numDays * ((activeDetailsDest.hotels && activeDetailsDest.hotels.length > 0 ? activeDetailsDest.hotels : POPULAR_HOTELS)[selectedHotelIndex]?.price || 5000)).toLocaleString()}
                          </strong>
                          <span className="text-[10px] text-slate-400">({numRooms} Rooms × {numDays} Nights)</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gradient-to-r from-blue-600/30 to-emerald-600/30 rounded-xl border border-blue-500/20">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-300 block mb-1">Est. Grand Amount (Tax incl.)</span>
                        <div className="flex items-baseline justify-center sm:justify-start space-x-1">
                          <strong className="text-xl font-mono text-emerald-400">
                            ₹{(
                              (numTravelers * numDays * 3500) + 
                              (numRooms * numDays * ((activeDetailsDest.hotels && activeDetailsDest.hotels.length > 0 ? activeDetailsDest.hotels : POPULAR_HOTELS)[selectedHotelIndex]?.price || 5000))
                            ).toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {validationError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-xs p-3 rounded-xl flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                        <span>{validationError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
                      <p className="text-[10px] text-slate-400 leading-normal max-w-md text-center sm:text-left">
                        By confirming, TourNex will instantly block room inventories and allocate priority sightseeing passes. You can review all invoices anytime under "My Bookings".
                      </p>
                      <button
                        onClick={handleConfirmPackageAndHotelBooking}
                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirm Premium Package & Hotel Booking</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom auxiliary bar indicator */}
            <div className="bg-slate-50 border-t border-slate-150 px-6 py-3.5 text-center text-[10px] text-slate-400 shrink-0">
              Verified by Incredible India Campaign • Standard local sandbox currency estimates
            </div>

          </div>
        </div>
      )}

      {/* SECURE INDIVIDUAL HOTEL BOOKING MODAL */}
      {hotelToBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fade-in" id="hotel-booking-modal-overlay">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-150 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]" id="hotel-modal-container">
            
            {/* Header portion */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-400 block">Verified Accommodation Desk</span>
                  <h2 className="font-display font-extrabold text-base flex items-center gap-1.5 leading-tight">
                    <span>Reserve stay on TourNex</span>
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setHotelToBook(null)}
                className="p-1.5 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto p-6 space-y-6 flex-grow">
              
              {hotelBookingSuccess ? (
                <div className="text-center space-y-4 py-4" id="hotel-success-view">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-2xl">
                    ✓
                  </div>
                  <h3 className="font-display font-black text-slate-900 text-lg">Hotel Stay Confirmed!</h3>
                  
                  {/* Voucher Card containing correct Image */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden text-left shadow-xs">
                    <div className="h-40 relative">
                      <img 
                        src={hotelToBook.image} 
                        alt={hotelToBook.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                      <span className="absolute bottom-3 left-4 bg-emerald-500 text-white text-[9px] font-mono font-bold py-0.5 px-2 rounded-full">
                        RESERVATION PAID
                      </span>
                    </div>
                    <div className="p-5 space-y-3.5">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase">CONFIRMATION VOUCHER</span>
                        <strong className="text-sm text-blue-600 block">{hotelBookingSuccess.bookingId}</strong>
                        <h4 className="font-display font-bold text-slate-900 text-sm mt-1">{hotelToBook.name}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                          <span>{hotelToBook.location}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono block">PRIMARY GUEST:</span>
                          <strong className="text-slate-800">{hotelCustomerName}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono block">STAY DURATION:</span>
                          <strong className="text-slate-800">{hotelNumNights} Nights • {hotelNumRooms} Room{hotelNumRooms > 1 ? 's' : ''}</strong>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
                        <div>
                          <span className="text-[9px] text-slate-400 font-mono block">CONTACT REGISTERED:</span>
                          <p className="text-[10px] text-slate-600 font-medium truncate">{hotelCustomerEmail}</p>
                          <p className="text-[10px] text-slate-600">{hotelCustomerPhone}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-slate-400 font-mono block">INVOICE PAID:</span>
                          <strong className="text-lg text-slate-900 font-mono">₹{hotelBookingSuccess.price.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs">
                    Your reservations have been dispatched. This booking record is securely logged under "My Bookings" in your dashboard navigation.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2 justify-center">
                    <button 
                      onClick={() => {
                        setActiveGatewayBooking(hotelBookingSuccess);
                        setGatewayPhone(hotelCustomerPhone);
                        setGatewayEmail(hotelCustomerEmail);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 font-bold active:scale-95 text-slate-900 px-5 py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer shrink-0"
                    >
                      📨 Dispatch Brochure & Receipt
                    </button>
                    <button 
                      onClick={() => {
                        setHotelToBook(null);
                        setActiveTab('bookings');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer"
                    >
                      View in Bookings Page
                    </button>
                    <button 
                      onClick={() => setHotelToBook(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs transition active:scale-95 cursor-pointer"
                    >
                      Close Portal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5" id="hotel-form-view">
                  {/* Hotel showcase with clear image display */}
                  <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl shadow-xs">
                    <img 
                      src={hotelToBook.image} 
                      alt={hotelToBook.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-150 shrink-0"
                    />
                    <div className="truncate flex-1">
                      <div className="flex items-center space-x-1 font-semibold text-amber-500 text-[11px] leading-tight mb-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{hotelToBook.rating} Rating</span>
                      </div>
                      <h4 className="font-display font-black text-slate-900 text-sm truncate leading-snug">{hotelToBook.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate flex items-center space-x-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                        <span>{hotelToBook.location}</span>
                      </p>
                      <p className="text-[11px] font-mono font-bold text-blue-600 mt-1">₹{hotelToBook.price.toLocaleString()} / night</p>
                    </div>
                  </div>

                  {/* FORM ENTRIES */}
                  <div className="space-y-4">
                    <span className="block text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">Stay Holder Credentials</span>
                    
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Primary Guest Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Satyajit Ray"
                            value={hotelCustomerName}
                            onChange={(e) => {
                              setHotelCustomerName(e.target.value);
                              setHotelValidationError('');
                            }}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Stay Contact Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                            <input 
                              type="email"
                              required
                              placeholder="e.g. guest@domain.com"
                              value={hotelCustomerEmail}
                              onChange={(e) => {
                                setHotelCustomerEmail(e.target.value);
                                setHotelValidationError('');
                              }}
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Contact Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                            <input 
                              type="tel"
                              required
                              placeholder="+91 XXXXX-XXXXX"
                              value={hotelCustomerPhone}
                              onChange={(e) => {
                                setHotelCustomerPhone(e.target.value);
                                setHotelValidationError('');
                              }}
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">No. of Rooms</label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                            <input 
                              type="number"
                              required
                              min="1"
                              max="10"
                              value={hotelNumRooms}
                              onChange={(e) => {
                                setHotelNumRooms(Math.max(1, parseInt(e.target.value) || 1));
                                setHotelValidationError('');
                              }}
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">No. of Nights</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                            <input 
                              type="number"
                              required
                              min="1"
                              max="30"
                              value={hotelNumNights}
                              onChange={(e) => {
                                setHotelNumNights(Math.max(1, parseInt(e.target.value) || 1));
                                setHotelValidationError('');
                              }}
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing total section */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Lodging Tariff Estimation:</span>
                      <strong className="font-mono text-slate-200">₹{hotelToBook.price.toLocaleString()} × {hotelNumRooms} Room(s) × {hotelNumNights} Night(s)</strong>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-slate-800 pt-3">
                      <span className="text-xs font-bold text-emerald-400 font-sans">Estimated Grand Total (Tax incl.):</span>
                      <strong className="text-xl font-mono text-emerald-400">₹{(hotelNumRooms * hotelNumNights * hotelToBook.price).toLocaleString()}</strong>
                    </div>

                    {hotelValidationError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-2.5 rounded-xl flex items-center space-x-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                        <span>{hotelValidationError}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex pt-2 flex-col sm:flex-row gap-3">
                    <button 
                      type="button"
                      onClick={() => setHotelToBook(null)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleConfirmHotelOnlyBooking}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3.5 rounded-xl text-xs font-black transition active:scale-95 hover:shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm & Lock Hotel Booking</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
            
            {/* Fine print footer */}
            <div className="bg-slate-50 border-t border-slate-150 px-6 py-3 text-center text-[10px] text-slate-400 shrink-0">
              Direct inventory channel lock • Fully refundable 24 hrs prior to arrival
            </div>

          </div>
        </div>
      )}

      {/* TourNex Automated Instant SMS/Gmail Dispatcher and Pamphlet Generator */}
      <TournexNotificationGateway 
        booking={activeGatewayBooking}
        defaultPhone={gatewayPhone}
        defaultEmail={gatewayEmail}
        isOpen={activeGatewayBooking !== null}
        onClose={() => setActiveGatewayBooking(null)}
      />

    </div>
  );
}
