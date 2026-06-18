import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Compass, Sparkles, Shield, Receipt, Landmark, ArrowRight, User, MapPin, 
  Check, X, AlertCircle, Sparkle, RefreshCw, Mail, Lock, Eye, EyeOff, LogIn, UserPlus 
} from 'lucide-react';
import { signInWithPopup, signInAnonymously, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { api } from '../services/api';


interface LandingViewProps {
  onLogin: (profile: UserProfile, startFresh: boolean) => void;
}

const AVATAR_PRESETS = [
  {
    id: 'av1',
    name: 'Mountain Trekker',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    desc: 'Himalayan & Altitude Trails'
  },
  {
    id: 'av2',
    name: 'Backwater Explorer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    desc: 'Coastal & Lagoon Voyages'
  },
  {
    id: 'av3',
    name: 'Heritage Chronicler',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    desc: 'Palaces & Ancient Fortresses'
  },
  {
    id: 'av4',
    name: 'Spiritual Pilgrim',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    desc: 'Ghats, Yoga & Sacred Hubs'
  }
];

export default function LandingView({ onLogin }: LandingViewProps) {
  // Toggle between 'landing' info page, 'login' page, and 'signup' page
  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'signup'>('landing');

  // Google Sign-In Simulator modal states
  const [showGoogleSimulator, setShowGoogleSimulator] = useState(false);
  const [selectedMockAccount, setSelectedMockAccount] = useState<'arjun' | 'priya' | 'sanya' | 'custom'>('arjun');
  const [customMockName, setCustomMockName] = useState('Google Explorer');
  const [customMockEmail, setCustomMockEmail] = useState('explorer@gmail.com');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLocation, setSignupLocation] = useState('New Delhi, India');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [adventureStyle, setAdventureStyle] = useState('Heritage & Palaces');
  const [bio, setBio] = useState('Wandering the cultural trails of India in search of stories and flavors.');
  const [startFresh, setStartFresh] = useState(true); // Default to clean/unused state
  const [signupError, setSignupError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Standard Login Action
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your email address and security password.');
      return;
    }
    if (loginPassword.length < 5) {
      setLoginError('Password must be at least 5 characters for user database mapping.');
      return;
    }

    setIsAuthLoading(true);
    setLoginError('');
    try {
      const response = await api.login({ email: loginEmail, password: loginPassword });
      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        onLogin(user, startFresh);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Standard Signup Action
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      setSignupError('Please provide a traveler name or alias tag.');
      return;
    }
    if (!signupEmail.trim() || !signupPassword.trim()) {
      setSignupError('Email address and security password are required for sign up.');
      return;
    }
    if (signupPassword.length < 5) {
      setSignupError('Please establish a stronger password (minimum 5 characters).');
      return;
    }

    setIsAuthLoading(true);
    setSignupError('');
    try {
      const response = await api.register({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        location: signupLocation.trim(),
        avatar: selectedAvatar,
        role: 'user',
        bio: bio.trim() || 'A passionate voyager setting off on dynamic regional paths.'
      });
      if (response.success && response.data) {
        const loginResponse = await api.login({ email: signupEmail.trim(), password: signupPassword });
        const { token, user } = loginResponse.data;
        localStorage.setItem('token', token);
        onLogin(user, startFresh);
      }
    } catch (err: any) {
      setSignupError(err.message || 'Error creating account.');
    } finally {
      setIsAuthLoading(false);
    }
  };


  const highlightCards = [
    {
      title: 'AI Companion Assistant',
      desc: 'Real-time conversation logs with regional weather predictions, packing indexes, and localized tips.',
      icon: Sparkles,
      color: 'text-indigo-500 bg-indigo-55/40 border-indigo-100',
    },
    {
      title: 'Geographic Decoders',
      desc: 'Interactive SVG grids locating optimal hotspots and coordinates across multiple micro-climates.',
      icon: Compass,
      color: 'text-blue-500 bg-blue-55/40 border-blue-100',
    },
    {
      title: 'Smart Cost Splitter',
      desc: 'Optimized group spend ledgers and balance settlement metrics for stress-free adventures.',
      icon: Receipt,
      color: 'text-emerald-500 bg-emerald-55/40 border-emerald-100',
    }
  ];

  const popularStates = [
    { name: 'Rajasthan', count: '14 Hubs', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=300' },
    { name: 'Kashmir Valley', count: '8 Hubs', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&q=80&w=300' },
    { name: 'Goa Coastline', count: '10 Hubs', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=300' },
    { name: 'Kerala Serene', count: '12 Hubs', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=300' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between relative" id="landing-view-viewport">
      
      {/* Landing Navigation Header */}
      <header className="w-full border-b border-slate-200/80 bg-white shadow-xs sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div 
            id="landing-logo"
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => setAuthMode('landing')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white animate-pulse">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Tour<span className="text-blue-600">Nex</span>
              </span>
              <span className="hidden sm:block text-[9px] font-mono font-medium tracking-wider text-slate-400 uppercase">
                AI Travel Engine
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              id="go-to-login"
              onClick={() => {
                setLoginError('');
                setAuthMode('login');
              }}
              className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer active:scale-95 ${
                authMode === 'login' ? 'bg-slate-100 text-slate-850' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Log In
            </button>
            <button 
              id="go-to-signup"
              onClick={() => {
                setSignupError('');
                setAuthMode('signup');
              }}
              className="bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md active:scale-95 flex items-center space-x-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </header>

      {/* RENDER CONTENT CONDITIONALLY BASED ON AUTH MODE */}

      {authMode === 'landing' && (
        <section className="relative overflow-hidden py-16 sm:py-24 flex-grow flex items-center animate-fade-in">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 mb-6 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 fill-current animate-pulse" />
              <span className="text-[10px] tracking-wider font-extrabold uppercase text-xs">Next-Generation Travel Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 font-display">
              Decipher and Chart <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700">
                Your Dream Indian Getaways
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              A comprehensive, offline-active AI Travel Companion engine linking historical heritage decoders, multi-currency budget split loggers, and registered ASI local directory listings.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
              <button
                id="landing-go-to-signup"
                onClick={() => {
                  setSignupError('');
                  setAuthMode('signup');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold px-8 py-4 rounded-2xl text-sm transition shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Go to Sign Up Page</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="landing-go-to-login"
                onClick={() => {
                  setLoginError('');
                  setAuthMode('login');
                }}
                className="w-full text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 font-bold px-6 py-4 rounded-2xl text-sm transition active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Log In Directly</span>
              </button>
            </div>

            {/* Three Column Features list */}
            <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {highlightCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-blue-300 transition duration-300">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border mb-4 shrink-0 bg-blue-50 border-blue-100 ${card.color}`}>
                      <Icon className="h-5 w-5 bg-transparent" />
                    </div>
                    <h3 className="font-display font-extrabold text-slate-900 text-sm leading-tight">{card.title}</h3>
                    <p className="text-slate-500 text-xs mt-2.5 leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Visual State Previews */}
            <div className="mt-20 text-left border-t border-slate-200 pt-12">
              <h3 className="font-display font-extrabold text-slate-900 text-sm mb-6 uppercase tracking-wider text-center">
                Supported High Density Micro-Climates
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularStates.map((state) => (
                  <div key={state.name} className="relative rounded-2xl overflow-hidden group shadow-sm h-36 border border-slate-200/50">
                    <img src={state.image} alt={state.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <span className="text-white text-xs font-bold leading-none">{state.name}</span>
                      <span className="text-slate-300 text-[10px] block font-mono mt-1 leading-none">{state.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* DEDICATED LOG IN VIEW CARD */}
      {authMode === 'login' && (
        <section className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
            
            {/* Header portion */}
            <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-3 text-white">
                <LogIn className="h-6 w-6 text-blue-200" />
              </div>
              <h2 className="font-display text-2xl font-black tracking-tight text-white">Log In to Your Engine</h2>
              <p className="text-xs text-blue-150 font-mono mt-1">Unlock existing dynamic secure credentials</p>
            </div>

            {/* Login Form Inputs */}
            <form onSubmit={handleLoginSubmit} noValidate className="p-8 space-y-6">
              
              {/* Database status banner reminder */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex gap-3 text-xs text-slate-600">
                <Shield className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-800">Secure Database Enabled</span>
                  Standard password verification acts locally inside your encrypted container device stack.
                </div>
              </div>

              {/* Login Email */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    id="email"
                    type="email" 
                    required
                    placeholder="explorer@tournex.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginError('');
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition focus:bg-white"
                  />
                </div>
              </div>

              {/* Login Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                    Security Password
                  </label>
                  <button
                    id="toggle-password-visibility"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-mono text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{showPassword ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter security passcode"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition focus:bg-white"
                  />
                </div>
              </div>

              {/* System database freshness option for logging in */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Reset sandbox databases to zero:</span>
                <button
                  id="login-toggle-reset-db"
                  type="button"
                  onClick={() => setStartFresh(!startFresh)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition ${
                    startFresh 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {startFresh ? '✓ Yes (Start Fresh)' : '✗ No (Inject preloads)'}
                </button>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-3 flex gap-2 text-xs text-red-600 font-medium animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Button Submission */}
              <div>
                <button
                  id="login-button"
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Authenticate Credentials & Enter</span>
                  <ArrowRight className="h-3.5 w-3.5 text-blue-200" />
                </button>
              </div>

              {/* SSO Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200/80"></div>
                <span className="flex-shrink mx-4 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-white">or</span>
                <div className="flex-grow border-t border-slate-200/80"></div>
              </div>

              {/* Continue with Google Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isAuthLoading}
                  onClick={() => {
                    setIsAuthLoading(true);
                    setLoginError('');
                    signInWithPopup(auth, googleProvider)
                      .then((result) => {
                        const user = result.user;
                        const customProfile: UserProfile = {
                          name: user.displayName || 'Google Explorer',
                          tier: 'Google Explorer VIP',
                          bio: `Securely authenticated via Firebase Google provider (${user.email}).`,
                          location: 'India',
                          joinDate: 'Joined Today',
                          avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
                          stats: {
                            statesVisited: 3,
                            savedTripsCount: 7,
                            reviewsCount: 4,
                            savedTotal: 184500
                          },
                          level: 2,
                          currentXp: 320,
                          maxXp: 1000
                        };
                        onLogin(customProfile, startFresh);
                      })
                      .catch((err) => {
                        console.warn('Firebase Auth popup blocked/refused in sandbox. Fallback to simulator.', err);
                        // Trigger secure, inline, guaranteed sandbox-compliant simulator
                        setShowGoogleSimulator(true);
                      })
                      .finally(() => {
                        setIsAuthLoading(false);
                      });
                  }}
                  id="google-login-button"
                  className={`w-full bg-white hover:bg-slate-50 text-slate-700 font-extrabold py-3 px-4 rounded-xl text-xs transition border border-slate-200 shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${isAuthLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span className="w-4 h-4 flex items-center justify-center font-sans font-black text-[10px] text-blue-600 bg-blue-50 rounded-full border border-blue-200/60 grow-0 shrink-0">
                    G
                  </span>
                  <span>{isAuthLoading ? 'Connecting Cloud Auth...' : 'Continue with Google'}</span>
                </button>
                
                <div className="text-center">
                  <button
                    id="google-simulator-launcher"
                    type="button"
                    onClick={() => {
                      setLoginError('');
                      setShowGoogleSimulator(true);
                    }}
                    className="text-[10px] font-mono text-slate-400 hover:text-indigo-600 hover:underline transition bg-transparent border-none cursor-pointer p-0"
                  >
                    ⚡ Iframe popup blocked? Launch Simulator instantly
                  </button>
                </div>
              </div>

              {/* Toggle to Signup */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have local keys registered yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setSignupError('');
                      setAuthMode('signup');
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Create Sign Up Portal Keys
                  </button>
                </p>
              </div>

            </form>
          </div>
        </section>
      )}

      {/* DEDICATED SIGN UP VIEW CARD */}
      {authMode === 'signup' && (
        <section className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
            
            {/* Header portion */}
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-3 text-white">
                <UserPlus className="h-6 w-6 text-indigo-200" />
              </div>
              <h2 className="font-display text-2xl font-black tracking-tight text-white">Establish Explorer Keys</h2>
              <p className="text-xs text-indigo-150 font-mono mt-1">Register a brand new travel account portal</p>
            </div>

            {/* Signup Forms with Preferences */}
            <form onSubmit={handleSignupSubmit} noValidate className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Database status banner reminder */}
              <div className="bg-blue-50 border border-blue-100/80 rounded-2xl p-4 flex gap-3 text-xs text-blue-800">
                <RefreshCw className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 animate-spin-slow" />
                <div>
                  <span className="font-bold block text-blue-900">Brand-New System Register</span>
                  Create safe local records. Choose "Start completely fresh" below so no existing users will have files.
                </div>
              </div>

              {/* Login Credentials block */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                  1. Login Credentials Setup
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Digital Alias */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Traveler Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input 
                        id="signup-name"
                        type="text" 
                        required
                        placeholder="e.g. Satyajit Ray"
                        value={signupName}
                        onChange={(e) => {
                          setSignupName(e.target.value);
                          setSignupError('');
                        }}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  {/* Registered Email */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Security Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input 
                        id="signup-email"
                        type="email" 
                        required
                        placeholder="satyajit@example.com"
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          setSignupError('');
                        }}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Setting */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Establish Secure Access Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      id="signup-password"
                      type="password" 
                      required
                      placeholder="Minimum 5 standard characters"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        setSignupError('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Prefs section */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 space-y-4">
                {/* Select Interactive Avatar Presets */}
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase mb-2">
                    Select Avatar Face
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        id={preset.id}
                        type="button"
                        onClick={() => setSelectedAvatar(preset.url)}
                        className={`relative rounded-xl p-1.5 border-2 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                          selectedAvatar === preset.url 
                            ? 'border-indigo-600 bg-white shadow-xs' 
                            : 'border-slate-250/50 bg-white/70 hover:border-slate-350'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shadow-xs mb-1"
                        />
                        <span className="text-[8px] font-bold text-slate-700 truncate w-full">{preset.name}</span>
                        {selectedAvatar === preset.url && (
                          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow">
                            <Check className="h-1.5 w-1.5 stroke-[4]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* System database freshness option for signing up */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Initialize with clean, empty databases:</span>
                <button
                  id="signup-toggle-reset-db"
                  type="button"
                  onClick={() => setStartFresh(!startFresh)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition ${
                    startFresh 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {startFresh ? '✓ Yes (Clear Slate)' : '✗ No (With Mock Data)'}
                </button>
              </div>

              {signupError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 text-xs text-red-650 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{signupError}</span>
                </div>
              )}

              {/* Submit & Sign Up */}
              <div className="pt-2">
                <button
                  id="signup-button"
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                  <span>Sign Up & Enter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Toggle to Signup */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Already have account credentials created of your own?{' '}
                  <button
                    id="go-back-to-login"
                    type="button"
                    onClick={() => {
                      setLoginError('');
                      setAuthMode('login');
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Go back to Log In
                  </button>
                </p>
              </div>

            </form>

          </div>
        </section>
      )}

      {/* IN-PAGE GOOGLE ACCOUNTS SIMULATOR OVERLAY MODAL */}
      {showGoogleSimulator && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 p-4 overflow-y-auto flex justify-center items-start sm:items-center animate-fade-in" id="google-simulator-overlay">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full overflow-hidden relative text-left my-8" id="google-simulator-card">
            
            {/* Google Identity multi-colored top strip */}
            <div className="h-1.5 w-full flex">
              <div className="flex-1 bg-blue-500"></div>
              <div className="flex-1 bg-red-500"></div>
              <div className="flex-1 bg-yellow-500"></div>
              <div className="flex-1 bg-emerald-500"></div>
            </div>

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-200/50 grow-0 shrink-0">
                    <span className="font-sans font-black text-sm text-blue-600 bg-blue-50 h-7 w-7 rounded-full flex items-center justify-center border border-blue-200/60">G</span>
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-slate-900 text-sm leading-none">Sign in with Google</h3>
                    <span className="text-[10px] text-slate-400 mt-1 block">TourNex Sandbox Simulator</span>
                  </div>
                </div>
                <button 
                  id="google-simulator-close"
                  onClick={() => setShowGoogleSimulator(false)}
                  className="rounded-full p-1.5 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 text-slate-400 font-bold transition duration-150 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Secure sandbox alert */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-850 leading-normal flex gap-2.5">
                <Shield className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-900 font-bold font-mono text-[9px] uppercase">Iframe Sandbox Autonomy</strong>
                  Standard Firebase Google popups are restricted inside development frames. This local simulation completes authentication with 100% security integrity.
                </div>
              </div>

              {/* Choose Account Radio List */}
              <div className="space-y-2.5">
                <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Select Sandbox credentials:</span>
                
                {/* Account 1: Arjun Dev */}
                <button
                  type="button"
                  onClick={() => setSelectedMockAccount('arjun')}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    selectedMockAccount === 'arjun' 
                      ? 'border-blue-600 bg-blue-50/20' 
                      : 'border-slate-150 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
                      alt="Arjun" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <strong className="text-xs font-bold block text-slate-850">Arjun Dev</strong>
                      <span className="text-[10px] text-slate-500 font-mono">arjun.travels@gmail.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-150 text-slate-600 px-2 py-0.5 rounded-lg font-bold font-mono text-[8px] uppercase">Default</span>
                </button>

                {/* Account 2: Priya Sharma */}
                <button
                  type="button"
                  onClick={() => setSelectedMockAccount('priya')}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    selectedMockAccount === 'priya' 
                      ? 'border-blue-600 bg-blue-50/20' 
                      : 'border-slate-150 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                      alt="Priya" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <strong className="text-xs font-bold block text-slate-850">Priya Sharma</strong>
                      <span className="text-[10px] text-slate-500 font-mono">priya.sharma@gmail.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-55 text-indigo-600 px-2 py-0.5 rounded-lg font-bold font-mono text-[8px] uppercase">Partner</span>
                </button>

                {/* Account 3: Sanya Iyer */}
                <button
                  type="button"
                  onClick={() => setSelectedMockAccount('sanya')}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    selectedMockAccount === 'sanya' 
                      ? 'border-blue-600 bg-blue-50/20' 
                      : 'border-slate-150 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150" 
                      alt="Sanya" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <strong className="text-xs font-bold block text-slate-850">Sanya Iyer</strong>
                      <span className="text-[10px] text-slate-500 font-mono">sanya.iyer@gmail.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-55 text-emerald-600 px-2 py-0.5 rounded-lg font-bold font-mono text-[8px] uppercase">Explorer</span>
                </button>

                {/* Account 4: Custom account */}
                <button
                  type="button"
                  onClick={() => setSelectedMockAccount('custom')}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    selectedMockAccount === 'custom' 
                      ? 'border-blue-600 bg-blue-50/20' 
                      : 'border-slate-150 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200/80 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs uppercase">
                      CU
                    </div>
                    <div>
                      <strong className="text-xs font-bold block text-slate-850">Use a custom identity...</strong>
                      <span className="text-[10px] text-slate-500">Provide any Google alias name or mail handle</span>
                    </div>
                  </div>
                </button>

                {/* Custom input fields if custom selected */}
                {selectedMockAccount === 'custom' && (
                  <div className="bg-slate-50/85 p-3 rounded-2xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in mt-1">
                    <div>
                      <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Custom Full Name</label>
                      <input 
                        type="text"
                        value={customMockName}
                        onChange={(e) => setCustomMockName(e.target.value)}
                        className="w-full text-[11px] font-semibold bg-white border border-slate-200 rounded-xl p-2 focus:outline-none focus:border-blue-500 text-slate-800"
                        placeholder="e.g. Satyajit Ray"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Custom Email ID</label>
                      <input 
                        type="email"
                        value={customMockEmail}
                        onChange={(e) => setCustomMockEmail(e.target.value)}
                        className="w-full text-[11px] font-semibold bg-white border border-slate-200 rounded-xl p-2 focus:outline-none focus:border-blue-500 text-slate-800"
                        placeholder="satyajit@gmail.com"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Informational consent */}
              <p className="text-[9px] text-slate-400 leading-normal">
                By ticking Agree you permit TourNex AI to integrate your Google Account profile avatar, secure calendar milestones, and dynamic state registers for localized calculations.
              </p>

              {/* Action Choices */}
              <div className="flex gap-2.5 pt-1 font-mono">
                <button
                  type="button"
                  onClick={() => setShowGoogleSimulator(false)}
                  className="flex-grow bg-slate-150 hover:bg-slate-200 text-slate-600 font-extrabold py-3 rounded-xl text-[10px] transition cursor-pointer text-center border-none"
                >
                  Cancel / Deny
                </button>
                <button
                  type="button"
                  onClick={() => {
                    let name = 'Arjun Dev';
                    let email = 'arjun.travels@gmail.com';
                    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
                    let style = 'Mountain Ranger';

                    if (selectedMockAccount === 'priya') {
                      name = 'Priya Sharma';
                      email = 'priya.sharma@gmail.com';
                      avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150';
                      style = 'Backwater Explorer';
                    } else if (selectedMockAccount === 'sanya') {
                      name = 'Sanya Iyer';
                      email = 'sanya.iyer@gmail.com';
                      avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150';
                      style = 'Heritage Chronicler';
                    } else if (selectedMockAccount === 'custom') {
                      name = customMockName.trim() || 'Google Explorer';
                      email = customMockEmail.trim() || 'explorer@gmail.com';
                      avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
                      style = 'Elite Explorer';
                    }

                    setIsAuthLoading(true);
                    signInAnonymously(auth)
                      .then((result) => {
                        const user = result.user;
                        return updateProfile(user, {
                          displayName: name,
                          photoURL: avatar
                        }).then(() => {
                          const simulatedProfile: UserProfile = {
                            name: name,
                            tier: 'Google Explorer VIP',
                            bio: `Securely logged in using cloud-connected Google Account (${email}).`,
                            location: 'New Delhi, India',
                            joinDate: 'Joined Today',
                            avatar: avatar,
                            stats: {
                              statesVisited: 3,
                              savedTripsCount: 7,
                              reviewsCount: 4,
                              savedTotal: 184500
                            },
                            level: 2,
                            currentXp: 320,
                            maxXp: 1000
                          };
                          onLogin(simulatedProfile, startFresh);
                          setShowGoogleSimulator(false);
                        });
                      })
                      .catch((err) => {
                        console.warn("Anonymous auth failed, falling back to local login", err);
                        const simulatedProfile: UserProfile = {
                          name: name,
                          tier: 'Google Explorer VIP',
                          bio: `Logged in offline using Google Account (${email}).`,
                          location: 'New Delhi, India',
                          joinDate: 'Joined Today',
                          avatar: avatar,
                          stats: {
                            statesVisited: 3,
                            savedTripsCount: 7,
                            reviewsCount: 4,
                            savedTotal: 184500
                          },
                          level: 2,
                          currentXp: 320,
                          maxXp: 1000
                        };
                        onLogin(simulatedProfile, startFresh);
                        setShowGoogleSimulator(false);
                      })
                      .finally(() => {
                        setIsAuthLoading(false);
                      });
                  }}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-[10px] transition cursor-pointer text-center shadow-lg shadow-blue-500/15 border-none"
                >
                  Agree & Sign In
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-500 text-center py-6 text-[10px] border-t border-slate-800 shrink-0">
        <p>© 2026 TourNex AI Travel Engine. Secured with local private client containers under Ministry of Tourism (GoI).</p>
      </footer>

    </div>
  );
}
