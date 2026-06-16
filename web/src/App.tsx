import React, { useState } from 'react';
import { TabType, Destination, Hotel, Booking, Expense, Message, UserProfile } from './types';
import { 
  ALL_DESTINATIONS, 
  POPULAR_HOTELS, 
  USER_CURRENT_PROFILE, 
  INITIAL_EXPENSES, 
  INITIAL_BOOKINGS 
} from './data';
import Navbar from './components/Navbar';
import ExploreView from './components/ExploreView';
import GatewayView from './components/GatewayView';
import ChatCompanionView from './components/ChatCompanionView';
import SplitterView from './components/SplitterView';
import BookingsView from './components/BookingsView';
import ProfileView from './components/ProfileView';
import LandingView from './components/LandingView';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import GoogleAuthSimulator from './components/GoogleAuthSimulator';
import { Landmark, Compass, ShieldAlert, Sparkles, MessageSquare, History, Heart, CheckCircle2 } from 'lucide-react';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { api } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [destinations, setDestinations] = useState<Destination[]>(ALL_DESTINATIONS);
  const [selectedDestination, setSelectedDestination] = useState<string>('Jaipur Palace Loop');
  const [profile, setProfile] = useState<UserProfile>(USER_CURRENT_PROFILE);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Helper to pull all live records for logged-in user from Express backend
  const refreshUserData = async () => {
    try {
      const expRes = await api.getExpenses();
      setExpenses(expRes.data.expenses || []);

      const bookRes = await api.getBookings();
      setBookings(bookRes.data.bookings || []);

      const msgRes = await api.getMessages();
      if (msgRes.data.messages && msgRes.data.messages.length > 0) {
        setMessages(msgRes.data.messages);
      } else {
        // Fallback: If no chats yet, start with default initial conversation prompts
        setMessages([
          {
            id: 'm1',
            sender: 'ai',
            text: "Namaste! I'm your TourNex AI Travel Companion, your real-time intelligence partner for exploration. Ask me anything about Jaipur monument hours, crowd avoidance times, or localized safety indices!",
            time: '10:00 AM',
            actions: [
              { label: 'Book Monument Ticket', actionId: 'ask-crowds', payload: "How can I book local fort tickets?" },
              { label: 'Find Local Guide', actionId: 'find-guide' }
            ]
          }
        ]);
      }
    } catch (err) {
      console.error("Error refreshing backend user data:", err);
    }
  };

  // 1. Google OAuth Message Event Listener (React Parent Win Context)
  React.useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Accept matching domains
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1') && origin !== window.location.origin) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.profile) {
        handleLogin(event.data.profile, true);
        triggerNotification(`Welcome! Connected securely with Google credentials.`);
      }
    };
    
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  // 2. Initial LocalStorage Token Auto-Authentication and Load
  React.useEffect(() => {
    const checkAuthAndLoad = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profileResponse = await api.getProfile();
          if (profileResponse.success && profileResponse.data?.user) {
            setProfile(profileResponse.data.user);
            setIsLoggedIn(true);
            await refreshUserData();
          }
        } catch (err) {
          console.warn("Auto-login token verification failed, resetting token:", err);
          localStorage.removeItem('token');
        }
      }
    };
    checkAuthAndLoad();
  }, []);

  // 3. Real-time Firebase Authentication Observer (for Simulator Popup Login flow)
  React.useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          localStorage.setItem('token', token);
          setIsLoggedIn(true);
          
          const profileResponse = await api.getProfile();
          if (profileResponse.success && profileResponse.data?.user) {
            setProfile(profileResponse.data.user);
          }
          await refreshUserData();
        } catch (err) {
          console.error("Error aligning Firebase session with Express backend:", err);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 4. Google OAuth / Simulator Redirect parsing (Child Popup context)
  React.useEffect(() => {
    // Check real Google hash parameters
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('access_token');
    
    // Check mock simulator query parameters
    const searchParams = new URL(window.location.href).searchParams;
    const isMockAuth = searchParams.get('oauth_mock_success') === 'true';
    const mockEmail = searchParams.get('email') || 'google.explorer@gmail.com';
    const mockName = searchParams.get('name') || 'Google Explorer';

    if (token && window.opener) {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const customProfile: UserProfile = {
          name: data.name || 'Google Explorer',
          tier: 'Elite Explorer',
          bio: `Verified Google Account user (${data.email || 'explorer@gmail.com'}).`,
          location: 'United States',
          joinDate: 'Joined Today',
          avatar: data.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          stats: { statesVisited: 0, savedTripsCount: 0, reviewsCount: 0, savedTotal: 0 },
          level: 1,
          currentXp: 180,
          maxXp: 1000
        };
        window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', profile: customProfile }, '*');
        window.close();
      })
      .catch(err => {
        console.error('Error fetching real Google profile from token', err);
        window.close();
      });
    }
  }, []);

  const handleAddDestination = (newDest: Destination) => {
    if (!destinations.some((d) => d.name.toLowerCase() === newDest.name.toLowerCase())) {
      setDestinations((prev) => [...prev, newDest]);
    }
  };

  // Helper notification bubble
  const triggerNotification = (text: string) => {
    setActiveNotification(text);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  // Splitter operations
  const handleAddExpense = async (newExp: Expense) => {
    try {
      await api.addExpense(newExp);
      await refreshUserData();
      triggerNotification(`Added expense: "${newExp.description}" for ₹${newExp.amount.toLocaleString()}`);
    } catch (err: any) {
      triggerNotification(`Error: ${err.message || 'Could not add expense'}`);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const deleted = expenses.find((e) => e.id === id);
    try {
      await api.deleteExpense(id);
      await refreshUserData();
      if (deleted) {
        triggerNotification(`Removed transaction: "${deleted.description}"`);
      }
    } catch (err: any) {
      triggerNotification(`Error: ${err.message || 'Could not remove expense'}`);
    }
  };

  const handleClearExpenses = async () => {
    try {
      await api.clearExpenses();
      setExpenses([]);
      triggerNotification("All group expense records cleared!");
    } catch (err: any) {
      triggerNotification(`Error: ${err.message || 'Could not clear expenses'}`);
    }
  };

  // Booking operations
  const handleAddBooking = async (newBooking: Booking) => {
    try {
      await api.addBooking(newBooking);
      await refreshUserData();
      triggerNotification(`New Reservation ID locked: ${newBooking.bookingId}`);
    } catch (err: any) {
      triggerNotification(`Error: ${err.message || 'Could not record booking'}`);
    }
  };

  // Simulated Intellect Companion reply routing
  const handleSendMessage = async (msgText: string, image?: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      sender: 'user',
      text: msgText,
      time: timeNow,
      image
    };

    try {
      await api.addMessage(userMsg);
      const res = await api.getMessages();
      setMessages(res.data.messages);

      // Fast-path AI companion response
      setTimeout(async () => {
        let aiText = '';
        let aiImage = undefined;
        let aiActions = undefined;
        const lower = msgText.toLowerCase();

        if (lower.includes('hawa mahal') || lower.includes('crowd')) {
          aiText = "Based on our live tourist density index, Hawa Mahal gets highly congested after 11:30 AM. Sunrise is the absolute prime hour!\n\nPro-Tip: Enter via the rear street entrance rather than the main heavy marketplace arch for a shorter queue line of under 5 minutes.";
          aiImage = 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80&w=800';
        } else if (lower.includes('jaipur') || lower.includes('palace') || lower.includes('fort')) {
          aiText = "Jaipur is stunning! I suggest visiting Amer Fort (glorious elephant walks and mirror work), and the ornate City Palace.\n\nLocal secrets tell that you should try Lassi at Lassiwala on M.I. Road—they serve it inside clay hand-baked kulladh cups since 1944. It is an amazing cultural treat!";
          aiImage = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800';
        } else if (lower.includes('kerala') || lower.includes('alleppey') || lower.includes('houseboat')) {
          aiText = "Welcome to Alleppey! The dynamic backwaters are best explored on overnight houseboat stays. \n\nAI advise: Check for standard hull registrations. Buy fresh Pearl Spot fish (Karimeen) near the jetty—the boat cook will grill it in banana leaves with coconut spices as part of your cruise dining package!";
          aiImage = 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800';
        } else if (lower.includes('ticket') || lower.includes('book')) {
          aiText = "I've logged a priority fast-track query with our booking desk. \n\nNo charge has been deducted. You can checkout hotels easily under the 'Explore' tab stays feed.";
          aiActions = [{ label: 'Browse Hotels Stays', actionId: 'tab-explore' }];
        } else if (lower.includes('guide')) {
          aiText = "We found 2 government-accredited local guides available tomorrow morning. They speak fluent English and Hindi, and charge standard regulated rates of ₹800/hour. Would you like me to book their services?";
          aiActions = [
            { label: 'Secure Accredit Guide', actionId: 'guide-yes' },
            { label: 'Decline', actionId: 'guide-no' }
          ];
        } else if (lower.includes('varanasi') || lower.includes('aarti') || lower.includes('ghat')) {
          aiText = "Varanasi Ghats are deeply mystical. I suggest witnessing the evening Ganga Aarti at Dashashwamedh Ghat starting at 6:30 PM. \n\nPro advice: Rent a small shared rowboat to watch the illuminated ceremonies directly from the holy river waters for an unparalleled serene panorama!";
          aiImage = 'https://images.unsplash.com/photo-1561361062-73691af8f2ec?auto=format&fit=crop&q=80&w=800';
        } else if (lower.includes('ladakh') || lower.includes('leh')) {
          aiText = "Ladakh is a glorious high-altitude desert! Please ensure you rest for at least 32 hours to acclimate safely before moving to Pangong Lake. \n\nSuggested highlights: Nubra Valley sand dunes, Diskit Monastery, and Leh Royal Palace.";
          aiImage = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800';
        } else {
          aiText = `Sure! I am monitoring standard travel metrics for your current query. India offers rich micro-climates, delicious locally cultivated spices, and incredibly welcoming ancient heritage sites.\n\nLet me know if you would like custom guide lists, weather charts, or local food reviews for ${selectedDestination}!`;
        }

        const aiMsg = {
          sender: 'ai',
          text: aiText,
          image: aiImage,
          actions: aiActions,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        await api.addMessage(aiMsg);
        const updatedRes = await api.getMessages();
        setMessages(updatedRes.data.messages);
      }, 1200);

    } catch (err: any) {
      console.error("Send message error", err);
    }
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    try {
      const res = await api.updateProfile(updated);
      setProfile(res.data.user);
      triggerNotification("Profile updated successfully!");
    } catch (err: any) {
      triggerNotification(`Error: ${err.message || 'Could not update profile'}`);
    }
  };

  const handleLogin = (customProfile: UserProfile, startFresh: boolean) => {
    setProfile(customProfile);
    setIsLoggedIn(true);
    setActiveTab('explore');
    if (startFresh) {
      // Clear data for new session
      api.clearExpenses().catch(console.error);
      api.clearMessages().catch(console.error);
      setExpenses([]);
      setBookings([]);
      setMessages([
        {
          id: 'welcome-fresh',
          sender: 'ai',
          text: `Namaste, ${customProfile.name}! Welcome to your fresh TourNex AI travel engine. Your journey starts today with completely clean ledgers, zero active bookings, and optimized companion support! Let me know where you'd like to explore first.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      refreshUserData();
    }
  };

  // Check if we are rendering inside the Google Auth Simulator popup frame
  const params = new URLSearchParams(window.location.search);
  const isSimulatorPopup = params.get('oauth_simulator') === 'true';

  if (isSimulatorPopup) {
    return <GoogleAuthSimulator />;
  }

  if (!isLoggedIn) {
    return <LandingView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" id="applet-viewport">
      
      {/* Top Standard Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={profile.name} 
      />

      {/* Main Content Render Frame */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
        
        {/* Banner Alert Toast notifications */}
        {activeNotification && (
          <div className="fixed top-18 right-6 z-50 bg-slate-900 border border-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5 animate-slide-in">
            <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
              ✓
            </div>
            <span>{activeNotification}</span>
          </div>
        )}

        {/* Tab Switch Panels Router */}
        {activeTab === 'explore' && (
          <ExploreView 
            destinations={destinations}
            onAddDestination={handleAddDestination}
            onSelectDestination={(name) => setSelectedDestination(name)}
            onAddBooking={handleAddBooking}
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'gateway' && (
          <GatewayView 
            destinations={destinations}
            selectedDestination={selectedDestination}
            onSelectDestination={(name) => setSelectedDestination(name)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'companion' && (
          <ChatCompanionView 
            selectedDestination={selectedDestination}
            onSelectDestination={(name) => setSelectedDestination(name)}
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddBooking={handleAddBooking}
          />
        )}

        {activeTab === 'splitter' && (
          <SplitterView 
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onClearExpenses={handleClearExpenses}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsView 
            bookings={bookings}
            onAddBooking={handleAddBooking}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            destinations={destinations}
            profile={profile}
            setActiveTab={setActiveTab}
            onSelectDestination={(name) => {
              setSelectedDestination(name);
              setActiveTab('companion');
            }}
            onUpdateProfile={handleUpdateProfile}
            onLogout={() => {
              signOut(auth).catch(err => console.error("Sign out error", err));
              localStorage.removeItem('token');
              setIsLoggedIn(false);
              // Fully reset and start fresh for the next login session
              setProfile(USER_CURRENT_PROFILE);
              setExpenses([]);
              setBookings([]);
              setMessages([
                {
                  id: 'm1',
                  sender: 'ai',
                  text: "Namaste! I'm your TourNex AI Travel Companion, your real-time intelligence partner for exploration. Ask me anything about Jaipur monument hours, crowd avoidance times, or localized safety indices!",
                  time: '10:00 AM',
                  actions: [
                    { label: 'Book Monument Ticket', actionId: 'ask-crowds', payload: "How can I book local fort tickets?" },
                    { label: 'Find Local Guide', actionId: 'find-guide' }
                  ]
                }
              ]);
            }}
          />
        )}

      </main>

      {/* Structured Footer representing Screen 3 / 8 */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-auto shrink-0" id="global-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-slate-800 items-start">
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-white">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                  T
                </div>
                <span className="font-display font-extrabold text-white text-base">TourNex Companion</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 max-w-xs leading-relaxed text-center sm:text-left">
                Empowering mindful travelers with localized conversational intelligence, unified budget splits, and ASI heritage decoders.
              </p>
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">Ministry Affiliations</span>
              <div className="mt-3 flex flex-col gap-1.5 items-center sm:items-start text-[11px] text-slate-400 font-semibold font-display">
                <span className="hover:text-white transition">Incredible India Campaign 🇮🇳</span>
                <span className="hover:text-white transition">Ministry of Tourism (GoI)</span>
                <span className="hover:text-white transition">Archaeological Survey of India</span>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono block">Interactive Portal</span>
              <div className="mt-3 flex flex-col gap-1.5 items-center sm:items-start text-[11px] text-slate-400 font-semibold">
                <span className="hover:text-white transition">Privacy Policy & Safe Harbor</span>
                <span className="hover:text-white transition">Terms of Service agreements</span>
                <span className="hover:text-white transition text-blue-500 font-bold">Contact Support: support@tournex.in</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 gap-3">
            <span>© 2026 TourNex AI Travel Engine. Proudly developed with Cloud Native Workspace.</span>
            <div className="flex gap-4 font-mono uppercase tracking-widest font-black text-[9px] text-slate-500">
              <span>● Offline-First Active</span>
              <span>● SSL Secured</span>
              <span>● No Keys Required</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating summons popup AI Copilot */}
      <FloatingAIAssistant 
        currentDestination={selectedDestination} 
        onSelectDestination={(name) => setSelectedDestination(name)}
        setActiveTab={(tab) => setActiveTab(tab)}
      />

    </div>
  );
}
