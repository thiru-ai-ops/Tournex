import React, { useState } from 'react';
import { UserProfile, TabType, Destination } from '../types';
import { USER_CURRENT_PROFILE } from '../data';
import { MapPin, Award, Heart, MessageCircle, Star, Sparkles, FolderHeart, Plus, Compass, Share2, LogOut } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  setActiveTab: (tab: TabType) => void;
  onSelectDestination: (destName: string) => void;
  destinations: Destination[];
  onLogout?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export default function ProfileView({ profile, setActiveTab, onSelectDestination, destinations, onLogout, onUpdateProfile }: ProfileViewProps) {
  const [profileBio, setProfileBio] = useState(profile.bio);
  const [editName, setEditName] = useState(profile.name);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [isEditing, setIsEditing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Badge list mapping
  const achievements = [
    { title: 'Peak Nomad', desc: 'Explored Ladakh mountains over 12k feet altitude', icon: '🏔️' },
    { title: 'Heritage Hero', desc: 'Visited 12+ ASI Imperial heritage monuments', icon: '🏰' },
    { title: 'Coast Pro', desc: 'Logged 40+ maritime sunset events in Konkan', icon: '🐚' }
  ];

  // Specific reviews list
  const recentReviewsList = [
    {
      place: 'The Taj Gateway, Agra',
      rating: 5,
      date: 'July 15, 2025',
      text: 'Perfect view from the rooftop restaurant. Sunrise watch was magical. Staff is incredibly skilled.'
    },
    {
      place: 'Zostel Heritage Hostel, Jodhpur',
      rating: 4.8,
      date: 'June 02, 2025',
      text: 'Unparalleled blue city rooftops. Met amazing co-travelers during the desert camp and samosa workshop.'
    }
  ];

  // Saved journeys references
  const savedJourneys = [
    { id: '1', title: 'Rajasthan Royal Loop', cost: '₹24,500', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=300' },
    { id: '2', title: 'Kerala Serene Backwaters', cost: '₹18,200', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=300' }
  ];

  // Wishlist destinations filtering (Spiritual / Beach places)
  const wishlistDestinations = destinations.slice(1, 4);

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-16 animate-fade-in" id="profile-view-root">
      
      {/* Left Column: Avatar profile details & Reviews feed */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Core Avatar Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center" id="profile-avatar-card">
          <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {isEditing ? (
            <div className="mt-4 space-y-3.5 text-left border-t border-slate-100 pt-4">
              <div>
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Location</label>
                <input 
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Biography & Travel Style</label>
                <textarea 
                  value={profileBio} 
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 text-slate-700"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    if (onUpdateProfile) {
                      onUpdateProfile({ 
                        ...profile, 
                        name: editName,
                        location: editLocation,
                        bio: profileBio 
                      });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer flex-1 text-center"
                >
                  Save Profile Settings
                </button>
                <button 
                  onClick={() => {
                    setEditName(profile.name);
                    setEditLocation(profile.location);
                    setProfileBio(profile.bio);
                    setIsEditing(false);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-display font-black text-slate-900 text-lg mt-3 leading-none">{profile.name}</h2>
              
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest mt-2.5 inline-block">
                {profile.tier}
              </span>

              {/* Location & joined date block */}
              <div className="pt-4 border-t border-slate-100 mt-4 text-xs text-slate-500 space-y-1">
                <div className="flex items-center justify-center space-x-1 font-semibold text-slate-700">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>{profile.location}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{profile.joinDate}</div>
              </div>

              {/* Biography statement */}
              <div className="mt-4 text-left border-t border-slate-100 pt-4">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Biography</label>
                <p className="text-slate-600 text-xs italic leading-relaxed">
                  "{profileBio}"
                </p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:underline text-[10px] font-bold mt-2 block"
                >
                  Edit Profile Settings
                </button>
              </div>
            </>
          )}

          {/* Sharing hub buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-5 mt-5 border-t border-slate-100">
            <button 
              onClick={handleShare}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Profile</span>
            </button>
            <button 
              onClick={() => alert(`Copied deep-link credential token for Arjun Mehta: EXPLORER-90321`)}
              className="bg-slate-900 hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition active:scale-95"
            >
              Export Stats
            </button>
          </div>

          {/* Disconnect Log-out button */}
          <div className="pt-3 mt-3 border-t border-slate-100">
            <button 
              onClick={() => {
                if (onLogout) onLogout();
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect & Logout</span>
            </button>
          </div>

          {shareSuccess && (
            <span className="text-[10px] font-mono text-emerald-600 font-bold block mt-3 select-none">
              ✓ Shareable URL clipboard copied successfully!
            </span>
          )}
        </div>

        {/* Explorer Badges Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3" id="achievements-card">
          <h3 className="font-display font-extrabold text-slate-900 text-sm flex items-center space-x-1.5 leading-none">
            <Award className="h-4 w-4 text-indigo-500" />
            <span>Travel Accomplishments</span>
          </h3>

          <div className="space-y-3 pt-1">
            {achievements.map((ach) => (
              <div key={ach.title} className="flex items-start space-x-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="h-8 w-8 rounded-lg bg-white shadow-xs border border-slate-150 flex items-center justify-center text-lg shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-slate-800 leading-none">{ach.title}</h4>
                  <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reviews list details */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3" id="recent-reviews-box">
          <h3 className="font-display font-extrabold text-slate-900 text-sm flex items-center space-x-1.5 leading-none">
            <MessageCircle className="h-4.5 w-4.5 text-blue-500" />
            <span>Recent Place Reviews</span>
          </h3>

          <div className="space-y-4 pt-1.5">
            {recentReviewsList.map((rev) => (
              <div key={rev.place} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 truncate">{rev.place}</h4>
                  <div className="flex items-center space-x-0.5 text-amber-500 text-[10px] font-bold">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{rev.date}</span>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-1.5 italic">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Statistics counters & Saved Loops wishlist */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Statistics Counters & Level Tracker Grid */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4" id="travel-statistics-block">
          <h3 className="font-display font-extrabold text-slate-900 text-sm leading-none flex items-center space-x-2">
            <span>Explorer Travel Metrics</span>
            <Sparkles className="h-4.5 w-4.5 text-blue-500 fill-current animate-pulse-slow" />
          </h3>

          {/* Numerical counters bento strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
              <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block leading-none">States Visited</span>
              <span className="font-display font-black text-2xl text-slate-900 block mt-1.5 leading-none">{profile.stats.statesVisited}</span>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
              <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block leading-none">Saved Excursions</span>
              <span className="font-display font-black text-2xl text-slate-900 block mt-1.5 leading-none">{profile.stats.savedTripsCount}</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
              <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block leading-none">Total Reviews</span>
              <span className="font-display font-black text-2xl text-slate-900 block mt-1.5 leading-none">{profile.stats.reviewsCount}</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
              <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block leading-none">Total Funds Saved</span>
              <span className="font-display font-black text-lg text-emerald-600 block mt-2.5 leading-none">₹{(profile.stats.savedTotal / 1000).toFixed(0)}K</span>
            </div>
          </div>

          {/* Level Progress meters bar layout */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs pb-1">
              <span className="font-semibold text-slate-700">Level {profile.level} Explorer Status</span>
              <span className="font-mono text-slate-400">{profile.currentXp} / {profile.maxXp} XP</span>
            </div>
            <div className="w-full bg-slate-100 border border-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                style={{ width: `${(profile.currentXp / profile.maxXp) * 100}%` }}
                className="bg-blue-600 h-full rounded-full transition"
              />
            </div>
          </div>
        </div>

        {/* Saved Journeys horizontal row list */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4" id="saved-itineraries-block">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-display font-extrabold text-slate-900 text-sm">Saved Custom Itinerary Templates</h3>
            <button 
              onClick={() => setActiveTab('explore')}
              className="bg-blue-50 hover:bg-shadow text-blue-600 rounded-lg p-1 transition flex items-center justify-center border border-blue-100 active:scale-95"
              title="Add New Trip Planner"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedJourneys.map((j) => (
              <div 
                key={j.id} 
                onClick={() => {
                  onSelectDestination(j.title.includes('Rajasthan') ? 'Jaipur Palace Loop' : 'Alleppey Backwaters');
                  setActiveTab('companion');
                }}
                className="bg-white border border-slate-150 rounded-xl overflow-hidden hover:border-blue-400 cursor-pointer flex p-2 gap-3 transition"
              >
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <img src={j.image} alt={j.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <h4 className="font-display font-bold text-xs text-slate-800 leading-tight truncate">{j.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono block leading-none">Est Price: {j.cost}</span>
                  <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider block pt-1 leading-none">Discuss with AI →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wishlist grid items */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4" id="wishlist-grid-block">
          <h3 className="font-display font-extrabold text-slate-900 text-sm flex items-center space-x-1.5 border-b border-slate-100 pb-2">
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>My Exploration Wishlist</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {wishlistDestinations.map((dest) => (
              <div 
                key={dest.id}
                onClick={() => {
                  onSelectDestination(dest.name);
                  setActiveTab('companion');
                }}
                className="bg-slate-50/50 border border-slate-150 rounded-xl overflow-hidden hover:border-red-300 transition cursor-pointer p-1.5 flex flex-col justify-between h-44"
              >
                <div className="h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-100">
                  <img src={dest.image} alt={dest.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold">
                    ❤️
                  </div>
                </div>

                <div className="pt-2 pb-1.5 px-1 flex-1 flex flex-col justify-between">
                  <div className="truncate">
                    <h4 className="font-display font-bold text-xs text-slate-800 leading-tight truncate">{dest.name}</h4>
                    <span className="text-[9px] text-slate-400 mt-0.5 leading-none block">{dest.state}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-250/50">
                    <span className="text-[9px] uppercase tracking-wider text-blue-600 font-bold block">{dest.category}</span>
                    <div className="flex items-center space-x-0.5 text-amber-500 text-[10px] font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
