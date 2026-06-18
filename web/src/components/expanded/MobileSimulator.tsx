import React, { useState } from 'react';
// Unused imports removed
import { 
  Smartphone, Compass, Landmark, User, MessageCircle, AlertTriangle, 
  Camera, Map, QrCode, Star, ArrowLeft, Send, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function MobileSimulator() {
  // Navigation states inside simulated phone:
  // splash, login, signup, home, ar, chat, passes, receipt, map, badges
  const [screen, setScreen] = useState<'splash' | 'login' | 'signup' | 'home' | 'ar' | 'chat' | 'passes' | 'receipt' | 'map' | 'badges'>('splash');
  
  // Simulated form inputs:
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Simulated Chat states
  const [mobileMessages, setMobileMessages] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
    { sender: 'ai', text: 'Namaste! Ask me about Hawa Mahal hours or crowd avoidance tips.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Simulated Receipt scan
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Simulated AR target selection
  const [arTarget, setArTarget] = useState<'hawa' | 'taj'>('hawa');

  const handleMobileSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMobileMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = 'I am looking up the travel details matching your query...';
      if (userText.toLowerCase().includes('hawa') || userText.toLowerCase().includes('crowd')) {
        reply = 'Hawa Mahal is best visited at 9:00 AM. Crowd density spikes significantly after 11:30 AM.';
      } else if (userText.toLowerCase().includes('taj') || userText.toLowerCase().includes('ticket')) {
        reply = 'Taj Mahal is closed on Fridays. Baseline tickets are ₹50 for Indian nationals.';
      }
      setMobileMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1000);
  };

  const startReceiptScan = () => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult('Detected: Hotel Stay Bill - ₹4,500. Split details auto-populated!');
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-3xl text-left" id="mobile-simulator-root">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-5xl items-center">
        
        {/* Left Side: Info & Controls */}
        <div className="lg:col-span-5 space-y-4 text-white">
          <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-800/40 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono font-bold">
            On-Screen Emulation
          </span>
          <h2 className="font-display font-black text-2xl tracking-tight text-white">Interactive Mobile Simulator</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Test and interact with the **10 screens** of the TourNex React Native Mobile App. Toggle routes below or tap controls on the phone frame to navigate.
          </p>

          <div className="bg-slate-850 p-4.5 rounded-2xl border border-slate-800 space-y-2.5">
            <span className="text-[9px] text-slate-500 uppercase font-mono block font-bold">Direct Screen Links</span>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button onClick={() => setScreen('splash')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'splash' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>15. Splash Screen</button>
              <button onClick={() => setScreen('login')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'login' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>16. Login Screen</button>
              <button onClick={() => setScreen('signup')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'signup' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>17. Signup Screen</button>
              <button onClick={() => setScreen('home')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>18. Home Dashboard</button>
              <button onClick={() => setScreen('ar')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'ar' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>19. AR Scanner</button>
              <button onClick={() => setScreen('chat')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'chat' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>20. AI Companion</button>
              <button onClick={() => setScreen('passes')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'passes' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>21. Active Passes</button>
              <button onClick={() => setScreen('receipt')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'receipt' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>22. Receipt Scanner</button>
              <button onClick={() => setScreen('map')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'map' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>23. Offline Map</button>
              <button onClick={() => setScreen('badges')} className={`py-1.5 px-3 rounded-lg text-left transition ${screen === 'badges' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>24. Achievements</button>
            </div>
          </div>
        </div>

        {/* Right Side: Phone Chassis mockup */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-80 h-[580px] bg-slate-950 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between" id="phone-chassis">
            
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center space-x-1.5 border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800"><span className="w-1 h-1 rounded-full bg-blue-900"></span></span>
              <span className="w-10 h-1 bg-slate-800 rounded-full"></span>
            </div>

            {/* Simulated Status Bar */}
            <div className="h-9 bg-slate-900/60 backdrop-blur-md px-5 pt-3.5 flex justify-between items-center text-[10px] text-white/90 z-40 shrink-0 font-mono">
              <span>12:45 PM</span>
              <div className="flex gap-1.5 items-center">
                <span>📶</span>
                <span>🔋 85%</span>
              </div>
            </div>

            {/* Screen Content Panel */}
            <div className="flex-grow bg-[#0f172a] overflow-y-auto p-4 text-xs relative flex flex-col justify-between" id="phone-screen-content">
              
              {/* Back navigation button if not splash/login/signup */}
              {screen !== 'splash' && screen !== 'login' && screen !== 'signup' && screen !== 'home' && (
                <button 
                  onClick={() => setScreen('home')}
                  className="absolute top-2 left-2 bg-slate-900/80 text-white p-1 rounded-md transition border border-slate-800 shrink-0 z-40"
                >
                  ← Home
                </button>
              )}

              {/* 15. SPLASH SCREEN */}
              {screen === 'splash' && (
                <div className="flex-grow flex flex-col justify-center items-center text-center space-y-6 animate-fade-in text-white pt-16">
                  <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-blue-600/35">
                    T
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg tracking-tight">TourNex Mobile</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest block uppercase mt-1">AI TRAVEL ENGINE</p>
                  </div>
                  <button 
                    onClick={() => setScreen('login')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition duration-200 cursor-pointer shadow-md"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* 16. LOGIN SCREEN */}
              {screen === 'login' && (
                <div className="flex-grow flex flex-col justify-between pt-8 space-y-4 text-white">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display font-black text-base">Welcome Back</h4>
                      <p className="text-[10px] text-slate-400">Log in to sync travel records</p>
                    </div>
                    
                    <div className="space-y-2.5 text-xs text-left">
                      <div className="space-y-1">
                        <label className="block text-[8px] font-mono uppercase text-slate-500 font-bold tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="explorer@tournex.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-semibold text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[8px] font-mono uppercase text-slate-500 font-bold tracking-wider">Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 font-semibold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => setScreen('home')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition duration-200"
                    >
                      Authenticate
                    </button>
                    <button 
                      onClick={() => setScreen('signup')}
                      className="w-full text-slate-400 text-[10px] text-center hover:text-white transition py-1"
                    >
                      Don't have accounts? Create Profile
                    </button>
                  </div>
                </div>
              )}

              {/* 17. SIGNUP SCREEN */}
              {screen === 'signup' && (
                <div className="flex-grow flex flex-col justify-between pt-6 space-y-4 text-white">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-display font-black text-base">Register Profile</h4>
                      <p className="text-[10px] text-slate-400">Create your TourNex traveler keys</p>
                    </div>

                    <div className="space-y-2 text-xs text-left">
                      <div className="space-y-0.5">
                        <label className="block text-[8px] font-mono uppercase text-slate-500">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Satyajit Ray" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-semibold text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="block text-[8px] font-mono uppercase text-slate-500">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="explorer@tournex.com" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-semibold text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="block text-[8px] font-mono uppercase text-slate-500">Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 font-semibold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button 
                      onClick={() => setScreen('home')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition duration-200"
                    >
                      Create Account
                    </button>
                    <button 
                      onClick={() => setScreen('login')}
                      className="w-full text-slate-400 text-[10px] text-center hover:text-white transition py-1"
                    >
                      Already registered? Log In
                    </button>
                  </div>
                </div>
              )}

              {/* 18. HOME DASHBOARD SCREEN */}
              {screen === 'home' && (
                <div className="flex-grow flex flex-col justify-between pt-4 space-y-4 text-white">
                  <div className="space-y-3.5">
                    {/* Header profile info */}
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">A</div>
                        <div>
                          <strong className="text-[11px] block">Arjun Dev</strong>
                          <span className="text-[9px] text-slate-500">Tier: Elite Explorer</span>
                        </div>
                      </div>
                      <span className="text-xs bg-slate-800 px-2 py-0.5 rounded font-mono font-bold">Lvl 4</span>
                    </div>

                    {/* Weather warning alert */}
                    <div className="bg-amber-500/15 border border-amber-500/35 text-amber-300 p-2.5 rounded-xl flex gap-2 items-start text-[10px]">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <strong>Weather warning alert</strong>
                        <p className="text-[9px] text-slate-200 mt-0.5">Heavy crowd spikes and sunset humidity at Amer Fort today.</p>
                      </div>
                    </div>

                    {/* Menu links grid */}
                    <div className="grid grid-cols-2 gap-2 text-center font-semibold">
                      <button onClick={() => setScreen('ar')} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center gap-1.5 hover:border-slate-600 transition">
                        <Camera className="h-4.5 w-4.5 text-blue-400" />
                        <span className="text-[10px]">19. AR Scanner</span>
                      </button>
                      <button onClick={() => setScreen('chat')} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center gap-1.5 hover:border-slate-600 transition">
                        <MessageCircle className="h-4.5 w-4.5 text-indigo-400" />
                        <span className="text-[10px]">20. Companion</span>
                      </button>
                      <button onClick={() => setScreen('passes')} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center gap-1.5 hover:border-slate-600 transition">
                        <QrCode className="h-4.5 w-4.5 text-emerald-400" />
                        <span className="text-[10px]">21. Booking Passes</span>
                      </button>
                      <button onClick={() => setScreen('receipt')} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center gap-1.5 hover:border-slate-600 transition">
                        <Camera className="h-4.5 w-4.5 text-purple-400" />
                        <span className="text-[10px]">22. Receipt Scan</span>
                      </button>
                      <button onClick={() => setScreen('map')} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center gap-1.5 hover:border-slate-600 transition">
                        <Map className="h-4.5 w-4.5 text-orange-400" />
                        <span className="text-[10px]">23. Offline Map</span>
                      </button>
                      <button onClick={() => setScreen('badges')} className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center gap-1.5 hover:border-slate-600 transition">
                        <Star className="h-4.5 w-4.5 text-amber-400" />
                        <span className="text-[10px]">24. Achievements</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setScreen('login')}
                    className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 text-xs py-2 rounded-xl transition cursor-pointer text-center font-bold"
                  >
                    Logout Session
                  </button>
                </div>
              )}

              {/* 19. AR SCREEN */}
              {screen === 'ar' && (
                <div className="flex-grow flex flex-col justify-between pt-6 space-y-3 text-white">
                  <div className="space-y-3">
                    <h4 className="font-display font-black text-sm">AR Monument Scanner</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">Point camera at architectural landmarks to activate dynamic summaries and audio narration overlay.</p>

                    {/* Camera simulation viewport */}
                    <div className="h-44 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-cover bg-center filter grayscale opacity-45" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80&w=300')` }}></div>
                      <div className="absolute inset-4 border border-dashed border-blue-500 rounded-xl animate-pulse"></div>
                      
                      <div className="relative text-center p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1 max-w-[200px]">
                        <span className="text-[8px] bg-blue-500 text-white font-mono px-1.5 py-0.5 rounded font-black">SCANNING TARGET</span>
                        <h5 className="font-bold text-[10px]">Hawa Mahal, Jaipur</h5>
                        <p className="text-[8px] text-slate-400">953 small windows designed to cool structure</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center text-[10px]">
                      <span>🔊 Play audio narration guide</span>
                      <button onClick={() => alert('Playing audio guide!')} className="bg-blue-600 px-2.5 py-1 rounded-lg text-[9px] font-bold text-white">PLAY</button>
                    </div>
                  </div>
                </div>
              )}

              {/* 20. MOBILE CHAT SCREEN */}
              {screen === 'chat' && (
                <div className="flex-grow flex flex-col justify-between pt-6 overflow-hidden h-[440px] text-white">
                  <h4 className="font-display font-black text-sm pb-1 border-b border-slate-800">AI Chat Companion</h4>
                  
                  {/* Chat feed */}
                  <div className="flex-grow overflow-y-auto space-y-2 py-3 text-[10px] pr-1">
                    {mobileMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2.5 rounded-xl max-w-[200px] leading-relaxed border ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 border-blue-500 text-white' 
                            : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Send bar */}
                  <form onSubmit={handleMobileSend} className="flex gap-2 border-t border-slate-850 pt-2 shrink-0">
                    <input 
                      type="text" 
                      placeholder="Ask companion..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-grow bg-slate-900 border border-slate-850 rounded-xl px-2.5 py-1.5 text-[10px] text-white focus:outline-none"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-xl shrink-0"><Send className="h-3.5 w-3.5" /></button>
                  </form>
                </div>
              )}

              {/* 21. ACTIVE PASSES SCREEN */}
              {screen === 'passes' && (
                <div className="flex-grow flex flex-col justify-between pt-6 space-y-4 text-white">
                  <div className="space-y-3">
                    <h4 className="font-display font-black text-sm">Vouchers & QR Passes</h4>
                    <p className="text-[10px] text-slate-400">Offline check gates confirmation codes</p>

                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl relative space-y-3">
                      <div className="flex justify-between items-center">
                        <strong className="text-[11px] block">Hawa Mahal Entry Pass</strong>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">VALID</span>
                      </div>
                      
                      {/* Simulated QR Code */}
                      <div className="h-28 w-28 mx-auto bg-white p-2 rounded-xl border border-slate-100 flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-slate-900" />
                      </div>
                      
                      <span className="block text-center font-mono text-[9px] text-slate-500 uppercase tracking-widest font-black">ID: TNX-HW-990812</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 22. RECEIPT SCAN SCREEN */}
              {screen === 'receipt' && (
                <div className="flex-grow flex flex-col justify-between pt-6 space-y-4 text-white">
                  <div className="space-y-3.5">
                    <h4 className="font-display font-black text-sm">Group Splitter OCR Scan</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">Take a picture of dining or stays bills to auto-resolve ledger transactions in the splitter database.</p>

                    {/* Camera view */}
                    <div className="h-40 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4">
                      {isScanning ? (
                        <div className="text-center space-y-2">
                          <span className="text-[10px] text-blue-400 block animate-pulse">Running OCR algorithms...</span>
                          <div className="h-1 bg-blue-600 rounded-full w-24 mx-auto overflow-hidden"><div className="h-full bg-indigo-300 animate-slide-in"></div></div>
                        </div>
                      ) : scannedResult ? (
                        <div className="text-center space-y-2">
                          <span className="text-xl">✅</span>
                          <p className="text-[10px] text-emerald-400 font-bold">{scannedResult}</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <span className="text-2xl">📸</span>
                          <p className="text-[9px] text-slate-400">Position receipt within focus frame</p>
                        </div>
                      )}
                    </div>

                    {!isScanning && !scannedResult && (
                      <button 
                        onClick={startReceiptScan}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-[10px] transition duration-200 cursor-pointer shadow-md text-center block"
                      >
                        Start Bill OCR Scan
                      </button>
                    )}

                    {scannedResult && (
                      <button 
                        onClick={() => setScannedResult(null)}
                        className="w-full bg-slate-800 hover:bg-slate-750 text-slate-350 text-[10px] font-bold py-2 rounded-xl transition cursor-pointer text-center block"
                      >
                        Scan Another Receipt
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 23. OFFLINE MAP SCREEN */}
              {screen === 'map' && (
                <div className="flex-grow flex flex-col justify-between pt-6 space-y-4 text-white">
                  <div className="space-y-3">
                    <h4 className="font-display font-black text-sm">Offline Maps Network</h4>
                    <p className="text-[10px] text-slate-400">Accredited heritage paths downloadable for offline navigation.</p>

                    {/* Vector Map image */}
                    <div className="h-44 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 filter contrast-125" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=300')` }}></div>
                      
                      <div className="absolute top-4 left-4 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex flex-col gap-1 items-start text-[8px]">
                        <strong>Offline packages download:</strong>
                        <span className="text-emerald-400">Jaipur Heritage Zone (8.5 MB) - Unlocked</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 24. BADGES SCREEN */}
              {screen === 'badges' && (
                <div className="flex-grow flex flex-col justify-between pt-6 space-y-4 text-white">
                  <div className="space-y-3.5">
                    <h4 className="font-display font-black text-sm">Achievements & Badges</h4>
                    <p className="text-[10px] text-slate-400">Gamified catalog representing visited hubs</p>

                    {/* Badge shelf */}
                    <div className="grid grid-cols-3 gap-2.5 text-center text-[9px] font-bold">
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center gap-1 hover:border-slate-700 transition">
                        <span className="text-xl">🏰</span>
                        <span className="truncate w-full">Rajput Explorer</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center gap-1 hover:border-slate-700 transition">
                        <span className="text-xl">🛶</span>
                        <span className="truncate w-full">Backwater Yogi</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col items-center gap-1 hover:border-slate-700 transition opacity-40">
                        <span className="text-xl">❄️</span>
                        <span className="truncate w-full">Himalaya Scout</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Virtual Home Button */}
            <div className="h-7 bg-slate-950 flex items-center justify-center pb-2 shrink-0 z-55">
              <button 
                onClick={() => setScreen('home')}
                className="h-1 w-24 bg-white/35 rounded-full hover:bg-white/60 transition cursor-pointer"
                title="Virtual Home Button"
              ></button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
