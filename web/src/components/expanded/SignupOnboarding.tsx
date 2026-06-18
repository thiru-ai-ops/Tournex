import React, { useState } from 'react';
import { Compass, Sparkles, User, MapPin, Calendar, Check } from 'lucide-react';
import { UserProfile } from '../../types';

interface SignupOnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function SignupOnboarding({ onComplete }: SignupOnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteCategory, setFavoriteCategory] = useState('Heritage');
  const [travelTier, setTravelTier] = useState('Explorer');

  const handleNextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      const onboardedProfile: UserProfile = {
        name: name.trim() || 'Guest Explorer',
        tier: travelTier,
        bio: bio.trim() || 'Wandering the cultural trails of India in search of stories and flavors.',
        location: location.trim() || 'New Delhi, India',
        joinDate: 'Joined Today',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        stats: {
          statesVisited: 1,
          savedTripsCount: 0,
          reviewsCount: 0,
          savedTotal: 0
        },
        level: 1,
        currentXp: 100,
        maxXp: 1000
      };
      onComplete(onboardedProfile);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8 text-left space-y-6" id="onboarding-wizard-root">
      
      {/* Header and Step Indicator */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <span className="text-[9px] bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold">TRAVELER ONBOARDING</span>
          <h3 className="font-display font-black text-lg text-slate-900 mt-1 leading-none">Configure Your Traveler Profile</h3>
        </div>
        <div className="flex gap-1.5 items-center">
          {[1, 2, 3].map(s => (
            <span 
              key={s} 
              className={`h-2 w-7 rounded-full transition ${s <= step ? 'bg-blue-600' : 'bg-slate-200'}`}
              title={`Step ${s}`}
            ></span>
          ))}
        </div>
      </div>

      {/* STEP 1: PERSONAL INFORMATION */}
      {step === 1 && (
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm">Step 1: Traveler Details</h4>
            <p className="text-slate-500 text-[10px]">Provide your basic display details for custom reservation keys.</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
              <input 
                id="onboarding-name"
                type="text" 
                placeholder="e.g. Arjun Dev" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Home Location</label>
              <input 
                id="onboarding-location"
                type="text" 
                placeholder="e.g. Mumbai, India" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: TRAVEL PROFILE PREFERENCES */}
      {step === 2 && (
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm">Step 2: Expedition Style</h4>
            <p className="text-slate-500 text-[10px]">Customize suggestions by selecting your core travel category.</p>
          </div>

          <div className="space-y-3.5">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Select Favorite Category</span>
            <div className="grid grid-cols-2 gap-2.5">
              {['Heritage', 'Coastal', 'Adventure', 'Spiritual'].map(cat => (
                <button
                  key={cat}
                  id={`onboarding-pref-${cat}`}
                  onClick={() => setFavoriteCategory(cat)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    favoriteCategory === cat 
                      ? 'border-blue-600 bg-blue-50/40 font-bold text-blue-700' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <Compass className="h-4 w-4 mb-1.5" />
                  <span>{cat} Explorer</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: USER TIER SELECTION */}
      {step === 3 && (
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-display font-bold text-slate-800 text-sm">Step 3: Traveler Tier Status</h4>
            <p className="text-slate-500 text-[10px]">Select your baseline loyalty tier within the TourNex rewards hub.</p>
          </div>

          <div className="space-y-3">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Select Rewards Tier</span>
            <div className="space-y-2">
              {['Explorer', 'Elite Explorer', 'Royal Voyager'].map(t => {
                const descMap: Record<string, string> = {
                  'Explorer': 'Standard member benefits, live guides access.',
                  'Elite Explorer': 'Pre-book fast-pass checks, detailed ASI reports.',
                  'Royal Voyager': 'Free governmental lounge entry, priority concierge.'
                };
                return (
                  <div 
                    key={t}
                    id={`onboarding-tier-${t.replace(/\s+/g, '-')}`}
                    onClick={() => setTravelTier(t)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      travelTier === t 
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-slate-900">{t}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">{descMap[t]}</p>
                    </div>
                    {travelTier === t && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Button controls */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
        {step > 1 && (
          <button 
            id="onboarding-back-btn"
            onClick={() => setStep(prev => prev - 1)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition text-xs cursor-pointer"
          >
            Back
          </button>
        )}
        <button 
          id="onboarding-next-btn"
          onClick={handleNextStep}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-1 active:scale-95 shadow-md"
        >
          <span>{step === 3 ? 'Finish & Onboard' : 'Continue'}</span>
          <Compass className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
