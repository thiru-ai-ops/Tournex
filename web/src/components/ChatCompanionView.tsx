import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TabType, Message, Booking } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  Send, Sparkles, AlertCircle, Bot, CloudSun, UtensilsCrossed, CalendarDays, 
  Wallet, UserCheck, Shield, HelpCircle, Languages, Image, Volume2, Users, 
  PhoneCall, CheckCircle, ChevronRight, User, MapPin, Phone, X
} from 'lucide-react';

interface ChatCompanionViewProps {
  selectedDestination: string;
  onSelectDestination: (destName: string) => void;
  messages: Message[];
  onSendMessage: (msgText: string, image?: string) => void;
  onAddBooking?: (booking: Booking) => void;
}

// 5-Period Temperature Climate Stats for Charting
const weatherDataByDest: Record<string, Array<{ time: string; temp: number; humidity: number }>> = {
  jaipur: [
    { time: '06:00 AM', temp: 23, humidity: 45 },
    { time: '10:00 AM', temp: 29, humidity: 40 },
    { time: '02:00 PM', temp: 34, humidity: 32 },
    { time: '06:00 PM', temp: 30, humidity: 38 },
    { time: '10:00 PM', temp: 22, humidity: 48 },
  ],
  alleppey: [
    { time: '06:00 AM', temp: 25, humidity: 85 },
    { time: '10:00 AM', temp: 28, humidity: 80 },
    { time: '02:00 PM', temp: 31, humidity: 75 },
    { time: '06:00 PM', temp: 28, humidity: 82 },
    { time: '10:00 PM', temp: 24, humidity: 88 },
  ],
  varanasi: [
    { time: '06:00 AM', temp: 24, humidity: 70 },
    { time: '10:00 AM', temp: 30, humidity: 62 },
    { time: '02:00 PM', temp: 33, humidity: 55 },
    { time: '06:00 PM', temp: 29, humidity: 65 },
    { time: '10:00 PM', temp: 22, humidity: 72 },
  ],
  ladakh: [
    { time: '06:00 AM', temp: 3, humidity: 25 },
    { time: '10:00 AM', temp: 11, humidity: 20 },
    { time: '02:00 PM', temp: 15, humidity: 15 },
    { time: '06:00 PM', temp: 8, humidity: 18 },
    { time: '10:00 PM', temp: 1, humidity: 30 },
  ],
};

const defaultWeatherData = [
  { time: '06:00 AM', temp: 22, humidity: 60 },
  { time: '10:00 AM', temp: 27, humidity: 55 },
  { time: '02:00 PM', temp: 31, humidity: 50 },
  { time: '06:00 PM', temp: 28, humidity: 58 },
  { time: '10:00 PM', temp: 24, humidity: 62 },
];

// Curated foodie reviews for famous outlets
const foodReviewsByDest: Record<string, Array<{ name: string; spot: string; rating: number; review: string; avatar: string }>> = {
  jaipur: [
    { name: 'Priya Sharma', spot: 'Rawat Mishtan Bhandar & Sweets', rating: 5, review: 'Their golden Pyaaz Kachori is legendary in Rajasthan! Deeply spiced, flaky onion fillings served with warm sweet tamarind glaze.', avatar: 'PS' },
    { name: 'Rahul K. Mehta', spot: 'Lassiwala M.I. Road (Since 1944)', rating: 4.8, review: 'Thick, hand-churned buttermilk loaded with rich malai, served cold in traditional baked earthen clay cups.', avatar: 'RM' },
    { name: 'Sanya Govind', spot: 'Chokhi Dhani Heritage Hut', rating: 4.9, review: 'Traditional dining inside bajra flour rotis steeped flatly in rich cow-ghee alongside crushed sweetened Baatis.', avatar: 'SG' },
  ],
  alleppey: [
    { name: 'Arjun Sen', spot: 'Backwaters Palms Restaurant', rating: 5, review: 'The slow pan-grilled Karimeen fish wrapped inside dynamic green banana leaves with spicy shallot masala paste is purely heaven!', avatar: 'AS' },
    { name: 'Lisa De Souza', spot: 'Cassia Lagoon dining', rating: 4.7, review: 'Highly hygienic water-front hut serving steaming appam pancakes with local aromatic chicken stew.', avatar: 'LD' },
  ],
  varanasi: [
    { name: 'Ramesh Tiwari', spot: 'Ram Bhandar Street Chowk', rating: 5, review: 'Outstanding morning Kachori Sabzi doused in pungent garam masala curries that wake up every single cell!', avatar: 'RT' },
    { name: 'Anita Patel', spot: 'Blue Lassi Corner (Near Manikarnika)', rating: 4.6, review: 'Wonderful hand-blended saffron mango yogurt paste topped with crushed pistachios and dynamic pomegranate keys.', avatar: 'AP' },
  ],
  ladakh: [
    { name: 'Dechen Angmo', spot: 'Gesmo Restaurant & Bakery', rating: 5, review: 'Comforting, warm thukpa hand-shaved noodle broth and extremely succulent steamed mutton momos.', avatar: 'DA' },
    { name: 'Jessica Miller', spot: 'Leh Apricot Delight Cafe', rating: 4.8, review: 'Tart hot wild buckthorn berries tea paired with crispy, warm handmade apricot croissants.', avatar: 'JM' },
  ],
};

const defaultFoodReviews = [
  { name: 'Amit Verma', spot: 'Local Authentic Diner', rating: 4.8, review: 'Perfect hot butter nan bread paired masterfully with slow-cooked aromatic chicken curries.', avatar: 'AV' },
  { name: 'Vikram Singh', spot: 'Heritage Gastronomy', rating: 4.7, review: 'Satisfying vegetarian multi-course thali featuring seasonal curries and warm lentil puddings.', avatar: 'VS' },
];

// Fully accredited tour guides listing
const guidesByDest: Record<string, Array<{ id: string; name: string; phone: string; license: string; rating: number; fee: number; spec: string; image: string }>> = {
  jaipur: [
    { id: 'g1', name: 'Rajesh Sharma', phone: '+91 94140 18239', license: 'ASI-201-RJ', rating: 4.9, fee: 750, spec: 'Mughal Architecture & Solar Observatories', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
    { id: 'g2', name: 'Manish Verma', phone: '+91 98290 54112', license: 'ASI-305-RJ', rating: 4.8, fee: 650, spec: 'Traditional Block Printing, Jewelry & Gems', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }
  ],
  alleppey: [
    { id: 'g3', name: 'Kiran Thampi', phone: '+91 98460 77112', license: 'ASI-451-KL', rating: 4.9, fee: 800, spec: 'Backwater Mangrove Ecology & Rare Birds', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { id: 'g4', name: 'Mini Jose', phone: '+91 99471 22881', license: 'ASI-902-KL', rating: 4.7, fee: 700, spec: 'Spices cultivation & Coir Handicrafts weaving', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' }
  ],
  varanasi: [
    { id: 'g5', name: 'Pandit Ravi Dubey', phone: '+91 94501 33281', license: 'ASI-711-UP', rating: 4.9, fee: 850, spec: 'Ghat Sanskrit Chants, Rituals & Philosophy', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150' },
    { id: 'g6', name: 'Shyam Yadav', phone: '+91 99351 44101', license: 'ASI-112-UP', rating: 4.8, fee: 600, spec: 'Banarasi Silk Weaving Co-ops & Folk Mysticism', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' }
  ],
  ladakh: [
    { id: 'g7', name: 'Stanzin Dorjay', phone: '+91 99061 99012', license: 'ASI-808-JK', rating: 4.9, fee: 900, spec: 'Tibetan Monastery Iconography & Trekking Trails', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150' }
  ]
};

const defaultGuides = [
  { id: 'g-def-1', name: 'Alok Mishra', phone: '+91 94310 12895', license: 'ASI-101-IND', rating: 4.8, fee: 600, spec: 'Regional History, Architecture & ASI decoders', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'g-def-2', name: 'Devendra Patil', phone: '+91 98902 44123', license: 'ASI-803-IND', rating: 4.7, fee: 550, spec: 'Local Culinary Spots & Heritage walking loops', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' }
];

// Multi-Dialect Indian Language Translation Sheets
const translationLanguages = [
  { name: 'Hindi', code: 'hi-IN', phoneme: 'Dhanyavaad', script: 'धन्यवाद', phraseMap: {
    thanks: 'बहुत-बहुत धन्यवाद (Bahut-bahut dhanyavaad)',
    price: 'यह कितने का है? (Yeh kitne ka hai?)',
    water: 'क्या मुझे पानी मिल सकता है? (Kya mujhe paani mil sakta hai?)',
    direction: 'होटल कहाँ है? (Hotel kahan hai?)',
    help: 'कृपया मेरी मदद करें (Kripya meri madad karein)'
  }},
  { name: 'Tamil', code: 'ta-IN', phoneme: 'Nandri', script: 'நன்றி', phraseMap: {
    thanks: 'மிக்க நன்றி (Mikka nandri)',
    price: 'यह எத்தனை? (Idhu evvalavu?)',
    water: 'தண்ணீர் கிடைக்குமா? (Thanneer kidaikkuma?)',
    direction: 'ஹோட்டல் எங்கே இருக்கிறது? (Hotel engay irukkirathu?)',
    help: 'தயவுசெய்து எனக்கு உதவுங்கள் (Thayavu seidhu enakku udhavungal)'
  }},
  { name: 'Bengali', code: 'bn-IN', phoneme: 'Dhanyabaad', script: 'ধন্যবাদ', phraseMap: {
    thanks: 'আপনাকে অনেক ধন্যবাদ (Aponake onek dhanyabaad)',
    price: 'ওটা কত দাম? (Ota koto dam?)',
    water: 'একটু জল পাব কী? (Ektu jol pabo ki?)',
    direction: 'হোটেলটি কোথায়? (Hotel-ti kothay?)',
    help: 'দয়া করে আমাকে সাহায্য করুন (Doya kore amake sahajjo korun)'
  }},
  { name: 'Punjabi', code: 'pa-IN', phoneme: 'Dhanvaad', script: 'ਧੰਨਵਾਦ', phraseMap: {
    thanks: 'ਬਹੁਤ-ਬਹੁਤ ਧੰਨਵਾਦ (Bahut-bahut dhanvaad)',
    price: 'ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ? (Eh kinne da hai?)',
    water: 'ਕੀ ਮੈਨੂੰ ਪਾਣੀ ਮਿਲ ਸਕਦਾ ਹੈ? (Ki mainu paani mil sakda hai?)',
    direction: 'ਹੋਟਲ ਕਿੱਥੇ ਹੈ? (Hotel kithe hai?)',
    help: 'ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ (Kripya karke meri madad karo)'
  }},
  { name: 'Telugu', code: 'te-IN', phoneme: 'Dhanyavaadalu', script: 'ధన్యవాదాలు', phraseMap: {
    thanks: 'చాలా ధన్యవాదాలు (Chala dhanyavaadalu)',
    price: 'ఇది ఎంత? (Idhi entha?)',
    water: 'నాకు మంచి నీరు దൊరుകുతుందా? (Naku manchi neeru dorukuthundha?)',
    direction: 'హోటൽ ఎక్కడ ఉంది? (Hotel ekkada undhi?)',
    help: 'దయచేసి నాకు సహాయం చేయండి (Dayachesi naku sahayam cheyandi)'
  }},
  { name: 'Marathi', code: 'mr-IN', phoneme: 'Dhanyavaad', script: 'धन्यवाद', phraseMap: {
    thanks: 'खूप खूप धन्यवाद (Khoop khoop dhanyavaad)',
    price: 'हे कितीला आहे? (He kithila aahe?)',
    water: 'मला पाणी मिळेल का? (Mala paani milel ka?)',
    direction: 'हॉटेल कुठे आहे? (Hotel kuthe aahe?)',
    help: 'कृपया मला मदत करा (Kripya mala madat kara)'
  }},
  { name: 'Malayalam', code: 'ml-IN', phoneme: 'Nandhi', script: 'നന്ദി', phraseMap: {
    thanks: 'വളരെയധികം നന്ദി (Valare-yadhikam nandhi)',
    price: 'ഇതിന് എത്രയാണ് വില? (Idhinethrayanu vila?)',
    water: 'വെള്ളം ലഭിക്കുമോ? (Vellam labhikkumo?)',
    direction: 'ഹോട്ടൽ എവിടെയാണ്? (Hotel evideyanu?)',
    help: 'ദയവായി എന്നെ സഹായിക്കൂ (Dayavayi enne sahayikkoo)'
  }},
  { name: 'Gujarati', code: 'gu-IN', phoneme: 'Aabhar', script: 'ખૂબ ખૂબ આભાર', phraseMap: {
    thanks: 'ખૂબ ખૂબ આભાર (Khoob khoob aabhar)',
    price: 'આ કેટલાનું છે? (Aa ketlanu chhe?)',
    water: 'મને પાણી મળી શકે? (Mane paani mali shake?)',
    direction: 'હોટેલ ક્યાં છે? (Hotel kyan chhe?)',
    help: 'કૃપા કરીને મારી મદદ કરો (Kripa karine mari madad karo)'
  }}
];

export default function ChatCompanionView({ selectedDestination, onSelectDestination, messages, onSendMessage, onAddBooking }: ChatCompanionViewProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Sidebar custom expanded overlays
  const [showChartModal, setShowChartModal] = useState(false);
  const [showFoodReviewsModal, setShowFoodReviewsModal] = useState(false);
  
  // Translation hub helper
  const [activeQuickAction, setActiveQuickAction] = useState<'translate' | 'safety' | 'guides' | null>(null);
  const [selectedPhraseKey, setSelectedPhraseKey] = useState<'thanks' | 'price' | 'water' | 'direction' | 'help'>('thanks');
  const [playingLang, setPlayingLang] = useState<string | null>(null);

  // Guide booking validation form
  const [bookingGuide, setBookingGuide] = useState<any | null>(null);
  const [formName, setFormName] = useState('Arjun Mehta');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [bookingCompletedSlip, setBookingCompletedSlip] = useState<any | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Contextual destination matching key identifier
  const destMatchKey = useMemo(() => {
    const name = selectedDestination.toLowerCase();
    if (name.includes('jaipur')) return 'jaipur';
    if (name.includes('alleppey') || name.includes('kerala')) return 'alleppey';
    if (name.includes('varanasi')) return 'varanasi';
    if (name.includes('ladakh') || name.includes('leh')) return 'ladakh';
    return 'default';
  }, [selectedDestination]);

  // Read contextual variables
  const context = useMemo(() => {
    const k = destMatchKey;
    if (k === 'jaipur') {
      return {
        temp: 32,
        condition: 'Sunny, Crisp Breeze',
        high: 34,
        low: 21,
        flavor: "Dal Baati Churma",
        flavorPlace: "Rawat Mishtan Bhandar",
        flavorDesc: "A wholesome traditional Rajasthani luxury platter featuring spiced lentils, baked wheat balls, and sweetened crushed wheat syrup.",
        spentBudget: 3250,
        limitBudget: 5000,
        tip: "Hawa Mahal looks best at sunrise. Light enters through the ornate colored glass windows casting breathtaking hues.",
        safety: "Jaipur is generally safe. Prefer registered e-rickshaws. Decline over-aggressive middlemen around markets."
      };
    } else if (k === 'alleppey') {
      return {
        temp: 29,
        condition: 'Humid, Mild Drizzle',
        high: 31,
        low: 24,
        flavor: "Karimeen Pollichathu",
        flavorPlace: "Backwaters Palms Resto",
        flavorDesc: "Pearl spot fish marinated in rich local Kerala spices, wrapped tenderly in fresh banana leaves and slow wood-fire grilled.",
        spentBudget: 4200,
        limitBudget: 6000,
        tip: "Rent houseboats from licensed agents at Finishing Point. Avoid taking boat rides after sunset due to lake marsh rules.",
        safety: "Check that life jackets exist on deck. Register timings in local harbor checkpoints before embarkation."
      };
    } else if (k === 'varanasi') {
      return {
        temp: 30,
        condition: 'High Humidity',
        high: 33,
        low: 22,
        flavor: "Kachori Sabzi & Lassi",
        flavorPlace: "Ram Bhandar, Chowk",
        flavorDesc: "Flaky deep-fried flatbread stuffed with spiced lentils, served with tangy potato curry and thick cardamom yogurt.",
        spentBudget: 2100,
        limitBudget: 4000,
        tip: "Arrive at Dashashwamedh Ghat by 5:30 PM to book an authorized wooden rowboat seat for the spectacular Ganga Aarti.",
        safety: "Do not touch deep river currents. Rely strictly on demarcated metal railing lines during crowded prayers."
      };
    } else if (k === 'ladakh') {
      return {
        temp: 14,
        condition: 'Chilly, Clear Blue Skies',
        high: 16,
        low: 4,
        flavor: "Steamed Mutton Momo & Thukpa",
        flavorPlace: "Gesmo Restaurant, Fort Road",
        flavorDesc: "Authentic hot ladakhi hand-pulled noodles soup paired with artisan dumplings packed with local mountain herbs.",
        spentBudget: 4500,
        limitBudget: 8000,
        tip: "Rest entirely for the first 24-48 hours. Acclimatization is absolutely critical to avoid Altitudinal Mountain Sickness (AMS).",
        safety: "Carry valid physical identity slips since Leh spans multiple military-restricted border checkpoints."
      };
    } else {
      return {
        temp: 28,
        condition: 'Mild and Pleasant',
        high: 30,
        low: 18,
        flavor: "Gourmet Butter Chicken & Naan",
        flavorPlace: "Classic Heritage Kitchens",
        flavorDesc: "Creamy cardamom tomato gravy infused with clay-oven roasted chicken pieces, served with hot wood-fired butter naans.",
        spentBudget: 3000,
        limitBudget: 5000,
        tip: "Always inspect official state tourism credentials to reserve local monument entries paperlessly.",
        safety: "Maintain digital copies of credentials in offline caches. Prefer packaged sealed beverages."
      };
    }
  }, [destMatchKey]);

  // Interactive Climate Weather chart data points
  const activeWeatherData = useMemo(() => {
    return weatherDataByDest[destMatchKey] || defaultWeatherData;
  }, [destMatchKey]);

  // Food reviews list
  const activeFoodReviews = useMemo(() => {
    return foodReviewsByDest[destMatchKey] || defaultFoodReviews;
  }, [destMatchKey]);

  // Tour guides list
  const activeGuides = useMemo(() => {
    return guidesByDest[destMatchKey] || defaultGuides;
  }, [destMatchKey]);

  // Speech voice feedback playback
  const playNativeTranslation = (textToSpeak: string, languageLocale: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = languageLocale;
      utterance.rate = 0.85;
      
      setPlayingLang(languageLocale);
      utterance.onend = () => setPlayingLang(null);
      utterance.onerror = () => setPlayingLang(null);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS Speech audio triggers are currently restricted or unsupported in this browser container.");
    }
  };

  const presetQuestions = [
    { label: "Best hours to avoid crowds?", text: `What's the best local advice to avoid maximum crowd density at ${selectedDestination} tomorrow?` },
    { label: "Recommend local food!", text: `What are the must-try local legacy culinary spots around ${selectedDestination}?` },
    { label: "Local Safety checklist?", text: `Provide the localized security precautions and emergency helpline codes for travelers.` }
  ];

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText);
    setInputText('');
  };

  // Safe handler to finalize guide booking
  const handleFinalizeGuideBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Your Full Name is required to confirm the booking.');
      return;
    }
    if (!formAddress.trim()) {
      setFormError('Resident/Hotel Address is required for licensing verify.');
      return;
    }
    if (!formPhone.trim() || formPhone.replace(/\D/g, '').length < 10) {
      setFormError('A valid 10-digit Phone Number is required.');
      return;
    }

    const txId = `GD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBookingItem: Booking = {
      id: `booking-${Date.now()}`,
      name: `ASI Certified Guide: ${bookingGuide.name} (${bookingGuide.license})`,
      dates: 'Tomorrow Morning Loop',
      status: 'UPCOMING',
      price: bookingGuide.fee,
      bookingId: txId,
      image: bookingGuide.image
    };

    if (onAddBooking) {
      onAddBooking(newBookingItem);
    }

    const slip = {
      txId,
      guide: bookingGuide,
      visitorName: formName,
      visitorPhone: formPhone,
      address: formAddress,
      amountPaid: bookingGuide.fee
    };

    setBookingCompletedSlip(slip);
    setBookingGuide(null);
    setFormAddress('');
    setFormPhone('');
    
    // Inject confirmation message into AI chat
    onSendMessage(`[CONFIRMED BOOKING] Successfully booked ASI Government guide ${bookingGuide.name} (License: ${bookingGuide.license}) with Guide Phone: ${bookingGuide.phone}. Credentials verified for ${formName}.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-16 animate-fade-in" id="companion-view-root">
      
      {/* Left panel: Context widget sidebar (Bento cards) */}
      <div className="lg:col-span-4 space-y-5" id="companion-bento-sidebar">
        
        {/* Header Widget */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-905 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-blue-300 font-bold uppercase">Real-Time Companion</span>
          </div>
          <h2 className="font-display font-bold text-lg text-white mt-2 truncate">
            {selectedDestination} Assistant
          </h2>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            AI-curated highlights and interactive charts optimized for your exploration loop.
          </p>
        </div>

        {/* Weather Widget with Expandable recharts graph */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4" id="weather-widget">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block leading-none">Weather Today</span>
              <span className="font-display font-extrabold text-[#0f172a] text-2xl tracking-tight mt-1 leading-none block">
                {context.temp}°C
              </span>
              <span className="text-slate-500 text-xs font-semibold block leading-none pt-1">
                {context.condition}
              </span>
              <span className="text-slate-400 text-[10px] block leading-none font-mono">
                High: {context.high}°C • Low: {context.low}°C
              </span>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl shrink-0 shadow-sm animate-bounce-slow">
              ☀️
            </div>
          </div>

          <button 
            onClick={() => setShowChartModal(true)}
            className="w-full bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-150 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1 cursor-pointer"
          >
            <CloudSun className="h-4 w-4" />
            <span>Review Weather Forecast Chart</span>
          </button>
        </div>

        {/* Local Flavors Card with Food Reviews popup trigger */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3" id="flavors-widget">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block leading-none">Local Flavors Suggestion</span>
            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60 uppercase">
              Top Pick
            </span>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-xl shrink-0">
              🍲
            </div>
            <div>
              <h4 className="font-display font-bold text-[#0f172a] text-sm truncate leading-none">{context.flavor}</h4>
              <span className="text-slate-400 text-[10px] mt-1 block leading-none">{context.flavorPlace}</span>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            {context.flavorDesc}
          </p>

          <button 
            onClick={() => setShowFoodReviewsModal(true)}
            className="w-full bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-150 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
          >
            <UtensilsCrossed className="h-4 w-4" />
            <span>Read Local Food Reviews ({activeFoodReviews.length})</span>
          </button>
        </div>

        {/* Instant Action Tray */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2.5" id="companion-actions-tray">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Quick Action Triggers</span>
          
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => {
                setActiveQuickAction(activeQuickAction === 'translate' ? null : 'translate');
              }}
              className={`p-2 py-3 rounded-xl border text-[10px] font-bold transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
                activeQuickAction === 'translate' 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
            >
              <Languages className="h-4 w-4" />
              <span>Translate</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveQuickAction(activeQuickAction === 'safety' ? null : 'safety');
              }}
              className={`p-2 py-3 rounded-xl border text-[10px] font-bold transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
                activeQuickAction === 'safety' 
                  ? 'bg-red-600 border-red-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Safety info</span>
            </button>

            <button 
              onClick={() => {
                setActiveQuickAction(activeQuickAction === 'guides' ? null : 'guides');
              }}
              className={`p-2 py-3 rounded-xl border text-[10px] font-bold transition flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer ${
                activeQuickAction === 'guides' 
                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Locate Guide</span>
            </button>
          </div>

          {/* Quick Action Overlay Sheets */}
          {activeQuickAction === 'translate' && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-inner space-y-3.5 animate-slide-down">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Pronunciation Translate Playback</span>
              
              {/* Phrases switcher row */}
              <div className="grid grid-cols-5 gap-1 text-[9px] font-bold">
                {(['thanks', 'price', 'water', 'direction', 'help'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPhraseKey(key)}
                    className={`py-1 rounded text-center transition cursor-pointer capitalize border ${
                      selectedPhraseKey === key 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-50 text-slate-600 border-slate-150 hover:bg-slate-100'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Scrollable Indian Languages Cards list */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {translationLanguages.map((lang) => {
                  const outPhrase = lang.phraseMap[selectedPhraseKey];
                  return (
                    <div key={lang.name} className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 flex items-center justify-between text-xs gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-blue-600">{lang.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">({lang.code})</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-[13px]">{outPhrase}</h5>
                        <p className="text-[10px] text-slate-500 italic block leading-none">Sounds as: "{lang.phoneme}"</p>
                      </div>
                      <button
                        onClick={() => playNativeTranslation(outPhrase, lang.code)}
                        className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 cursor-pointer shadow-xs active:scale-95 transition ${
                          playingLang === lang.code 
                            ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                            : 'bg-white hover:bg-indigo-50 text-indigo-600 border-slate-200'
                        }`}
                        title={`Listen to ${lang.name} translation`}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeQuickAction === 'safety' && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-inner space-y-2 animate-slide-down">
              <span className="text-[10px] font-mono font-bold text-red-500 uppercase block">Security Warnings</span>
              <p className="text-slate-600 text-xs leading-normal">
                {context.safety}
              </p>
              <div className="bg-red-50 text-[10px] text-red-700 p-2.5 rounded-lg font-bold border border-red-100 flex items-center space-x-1.5">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>Tourist Patrol Helpline: Call 1363 (24/7 National Multilingual Helpline)</span>
              </div>
            </div>
          )}

          {activeQuickAction === 'guides' && (
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-inner space-y-3 animate-slide-down">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">ASI Accredited Guides Directory</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase font-mono">Government Verified</span>
              </div>

              {/* Local Guides listing block representing direct verification details */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {activeGuides.map((gd) => (
                  <div key={gd.id} className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-xs text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-slate-250 bg-slate-100">
                        <img src={gd.image} alt={gd.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h5 className="font-extrabold text-slate-900 truncate leading-none">{gd.name}</h5>
                          <span className="text-[9px] font-mono font-semibold text-indigo-600 leading-none shrink-0">{gd.license}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400 text-[10px] pt-1">
                          <PhoneCall className="h-3 w-3 text-slate-400" />
                          <span className="font-semibold text-slate-800 selection:bg-slate-100">{gd.phone}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-normal mt-1 italic">
                          Specialty: {gd.spec}
                        </p>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100.5">
                          <span className="font-extrabold text-slate-800">₹{gd.fee}/Hour</span>
                          <button
                            onClick={() => {
                              setBookingCompletedSlip(null);
                              setBookingGuide(gd);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[9px] transition cursor-pointer active:scale-95"
                          >
                            Book Guide
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Right panel: Active Chat Room Panel */}
      <div className="lg:col-span-8 flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm" id="chat-center">
        
        {/* Chat Header */}
        <div className="bg-slate-50 border-b border-slate-150 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold relative">
              <Bot className="h-5.5 w-5.5 text-white" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white animate-ping"></span>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm leading-none flex items-center gap-1.5">
                <span>TourNex AI Companion</span>
                <span className="bg-blue-100 text-blue-800 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">Dual-Model Active</span>
              </h3>
              <p className="text-slate-500 text-[10px] leading-none mt-1 font-mono uppercase tracking-wider">
                Twin Model Intelligence • Offline Active
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => onSelectDestination('Jaipur Palace Loop')}
            className="text-xs font-mono font-bold bg-slate-200/70 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition active:scale-95 cursor-pointer"
          >
            Reset Logs
          </button>
        </div>

        {/* Chat Conversation Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50" id="chat-scroll-frame">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div 
                key={msg.id}
                className={`flex max-w-[85%] ${isAI ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-start'} gap-2.5`}
                id={`chat-msg-${msg.id}`}
              >
                {/* Mini logo avatar */}
                {isAI ? (
                  <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200/50">
                    AI
                  </div>
                ) : (
                  <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    Me
                  </div>
                )}

                {/* Bubble content */}
                <div className={`space-y-2 rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  isAI 
                    ? 'bg-white border border-slate-150 text-slate-800' 
                    : 'bg-blue-600 text-white rounded-br-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  
                  {/* Embedded high-quality location banner card inside bubble */}
                  {msg.image && (
                    <div className="mt-3.5 rounded-xl overflow-hidden border border-slate-150/40 shadow-sm max-w-[280px]">
                      <img 
                        src={msg.image} 
                        alt="Monument Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-32 object-cover"
                      />
                      <div className="bg-slate-50 p-2.5 text-[10px] font-semibold text-slate-600 border-t border-slate-100 uppercase tracking-widest text-center">
                        {selectedDestination} • Spot Insight
                      </div>
                    </div>
                  )}

                  {/* Actions Tray */}
                  {isAI && msg.actions && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {msg.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (act.actionId === 'ask-crowds') {
                              onSendMessage(act.payload || act.label);
                            } else if (act.actionId === 'find-guide') {
                              setActiveQuickAction('guides');
                            } else {
                              onSendMessage(act.label);
                            }
                          }}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-2.5 py-1.5 rounded-lg border border-blue-100 text-[10px] transition-all cursor-pointer"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[8px] text-right mt-1.5 leading-none ${isAI ? 'text-slate-400' : 'text-blue-200'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 mr-auto" id="typing-bubble">
              <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200">
                AI
              </div>
              <div className="bg-white border border-slate-150 rounded-2xl px-4 py-3 flex space-x-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Dynamic click helper presets */}
        {messages.length < 6 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-1.5 shrink-0 animate-fade-in" id="preset-suggestions">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center leading-none">Suggestions</span>
            {presetQuestions.map((q) => (
              <button
                key={q.label}
                onClick={() => {
                  onSendMessage(q.text);
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium py-1 px-2.5 rounded-full transition truncate max-w-[210px] cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* Input panel form layout */}
        <div className="p-4 bg-white border-t border-slate-150 shrink-0">
          <form onSubmit={handleSendText} className="flex gap-2.5 items-center">
            <input 
              type="text" 
              placeholder={`Ask anything about ${selectedDestination}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
            />
            
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-150 disabled:text-slate-400 text-white rounded-xl p-3 font-semibold transition shadow-md active:scale-95 shrink-0 flex items-center justify-center h-10 w-10 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

      {/* MODAL 1: Weather Recharts climate curves */}
      {showChartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-150">
              <div className="flex items-center space-x-2">
                <CloudSun className="h-5 w-5 text-blue-500" />
                <h3 className="font-display font-extrabold text-slate-900 text-base">
                  Interactive Temperature & Climate Chart (Today)
                </h3>
              </div>
              <button 
                onClick={() => setShowChartModal(false)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Analyzing live diurnal radiation patterns, barometric pressure cycles, and thermal indices for <strong>{selectedDestination}</strong>:
            </p>

            {/* Recharts Area Curve graph display */}
            <div className="h-64 w-full mt-6" id="weather-graph-viewport">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeWeatherData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 9, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} 
                  />
                  <Area 
                    name="Temperature (°C)" 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTemp)" 
                  />
                  <Area 
                    name="Humidity (%)" 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#colorHum)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 bg-slate-50 border border-slate-150 p-3 rounded-2xl text-[10px] text-slate-500 font-mono flex justify-between items-center">
              <span>● Diurnal High Peak: {context.high}°C at 02:00 PM</span>
              <span>● Simulated via real-time microclimate sensors</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Culinary Outlets Client Food Reviews */}
      {showFoodReviewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xl border border-slate-200 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-150">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                <h3 className="font-display font-extrabold text-slate-900 text-base">
                  Legacy Culinary Reviews - {selectedDestination}
                </h3>
              </div>
              <button 
                onClick={() => setShowFoodReviewsModal(false)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto mt-4 pr-1">
              {activeFoodReviews.map((rev, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-extrabold text-xs border border-orange-200">
                        {rev.avatar}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-800 leading-none">{rev.name}</h5>
                        <span className="text-[10px] text-orange-600 font-bold block mt-1 leading-none">Dined at: {rev.spot}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-0.5 bg-amber-50 rounded-lg px-1.5 py-0.5 border border-amber-250/30 text-amber-600 font-bold text-[10px]">
                      <span>★</span>
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic pt-1 text-[11px]">
                    "{rev.review}"
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setShowFoodReviewsModal(false)}
                className="bg-slate-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer active:scale-95"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Tour Guide Booking Form requiring Name, Address, Phone validation */}
      {bookingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center pb-3 border-b border-slate-150">
              <h3 className="font-display font-extrabold text-slate-900 text-base">
                Secure Licensed Guide Booking
              </h3>
              <button 
                onClick={() => setBookingGuide(null)}
                className="text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Selected Guide Details Mini card */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-150 text-xs flex gap-3 mt-4">
              <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                <img src={bookingGuide.image} alt={bookingGuide.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#0f172a] leading-none">{bookingGuide.name}</h4>
                <p className="text-slate-400 text-[10px] mt-1 font-mono leading-none">Lic: {bookingGuide.license} • Rating: ★{bookingGuide.rating}</p>
                <p className="text-slate-500 text-[10px] mt-1.5">Phone: <b>{bookingGuide.phone}</b></p>
                <p className="text-indigo-600 font-extrabold text-[10px] mt-1">Rate: ₹{bookingGuide.fee}/Hour</p>
              </div>
            </div>

            {/* Validation Request Warning */}
            <div className="bg-amber-50 text-amber-800 text-[11px] p-2.5 rounded-xl font-medium border border-amber-100 flex items-start space-x-1.5 mt-4">
              <Shield className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <span><b>MANDATORY SECURITY ACTION:</b> ASI credentials decree that you must supply your Full Name, Current Address, and active phone number to confirm government-licensed escort bookings.</span>
            </div>

            <form onSubmit={handleFinalizeGuideBooking} className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Resident / Resort Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="E.g. Heritage Resort, Room 402"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">Active Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold font-mono"
                  />
                </div>
              </div>

              {formError && (
                <div className="text-[10px] font-bold text-red-600 text-center uppercase font-mono">
                  ⚠ {formError}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingGuide(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold py-2.5 transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold py-2.5 transition shadow-md active:scale-95"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slip Confirmation Card */}
      {bookingCompletedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-250 shadow-2xl animate-scale-in text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <CheckCircle className="h-7 w-7" />
            </div>
            
            <h3 className="font-display font-black text-slate-900 text-base">
              Guide Booking Confirmed Successfully!
            </h3>
            <p className="text-slate-500 text-xs mt-1.5">
              Government ASI regulatory credentials have locked your license session.
            </p>

            {/* Printable Pass Slip Block */}
            <div className="bg-slate-50 border border-dashed border-slate-250 rounded-2xl p-4 text-left text-xs font-semibold text-slate-700 space-y-2 mt-4 font-sans">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 text-[10px] font-mono">PASS TRANSACTION ID</span>
                <span className="font-mono text-slate-900 font-extrabold">{bookingCompletedSlip.txId}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Tourist Name</span>
                <span className="text-slate-900 font-extrabold">{bookingCompletedSlip.visitorName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Registered Phone</span>
                  <span className="text-slate-900 font-mono">{bookingCompletedSlip.visitorPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Address</span>
                  <span className="text-slate-900 truncate block">{bookingCompletedSlip.address}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] uppercase block text-slate-400">ASI Escort Guide</span>
                  <span className="font-bold text-slate-800">{bookingCompletedSlip.guide.name} ({bookingCompletedSlip.guide.license})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase block text-slate-400">Price Fee</span>
                  <span className="text-emerald-600 font-black">₹{bookingCompletedSlip.amountPaid} Paid</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 text-[10px] text-emerald-700 p-2.5 rounded-lg font-bold border border-emerald-100 flex items-center space-x-1.5 mt-4">
              <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Escort details dispatched. Saved to "My Bookings" tab!</span>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setBookingCompletedSlip(null)}
                className="w-full bg-slate-950 hover:bg-black text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer active:scale-95"
              >
                Great, Thank You!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
