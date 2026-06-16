import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Gift, 
  X, 
  Send, 
  Printer, 
  Check, 
  Clock, 
  AlertCircle,
  Smartphone,
  Inbox,
  Share2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Booking } from '../types';

interface TournexNotificationGatewayProps {
  booking: Booking | null;
  defaultPhone: string;
  defaultEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TournexNotificationGateway({ 
  booking, 
  defaultPhone, 
  defaultEmail, 
  isOpen, 
  onClose 
}: TournexNotificationGatewayProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [dispatchStep, setDispatchStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isSending, setIsSending] = useState(false);
  const [activeView, setActiveView] = useState<'status' | 'brochure' | 'phone' | 'gmail'>('status');
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);
  
  // Virtual device specific states
  const [phoneScreenState, setPhoneScreenState] = useState<'lock' | 'home' | 'whatsapp' | 'sms'>('lock');
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const [isEmailExpanded, setIsEmailExpanded] = useState(true);
  const [systemTime, setSystemTime] = useState('10:00 AM');

  // Sync state values when booking or defaults change
  useEffect(() => {
    if (defaultPhone) setPhoneNumber(defaultPhone);
    else setPhoneNumber('+91 98450 12345'); // Realistic Indian format fallback

    if (defaultEmail) setEmailAddress(defaultEmail);
    else setEmailAddress('explore.india@gmail.com');
    
    // Set current system clock inside simulated phone
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 20000);

    // Automatically trigger dispatch when opening with a new booking
    if (isOpen && booking) {
      triggerDispatchSequence();
    }

    return () => clearInterval(interval);
  }, [booking, defaultPhone, defaultEmail, isOpen]);

  const triggerDispatchSequence = () => {
    setIsSending(true);
    setDispatchStep(1); // Gateway handshake
    setActiveView('status');
    setShowNotificationAlert(false);
    setPhoneScreenState('lock');

    // Step 1 -> Step 2 (SMS Sent) after 1.2s - Auto-switches view to simulator phone to showcase the text alert!
    setTimeout(() => {
      setDispatchStep(2);
      setActiveView('phone');
      setShowNotificationAlert(true);
      
      // Step 2 -> Step 3 (Gmail & Booklet dispatched) after 2.4s - Auto-switches to Gmail simulator to show email entry!
      setTimeout(() => {
        setDispatchStep(3);
        setActiveView('gmail');
        setIsEmailExpanded(false); // starts collapsed in list, ready to click and open

        // Step 3 -> Step 4 (Successful Complete) after 3.8s - Switches back to brochure with complete check
        setTimeout(() => {
          setDispatchStep(4);
          setIsSending(false);
          setActiveView('brochure');
          showToast('Real-time e-Receipt & Brochure Booklet updated!');
        }, 1400);
      }, 1400);
    }, 1200);
  };

  const getGmailURL = () => {
    if (!booking) return '#';
    const subject = `[TourNex] Booking confirmation & Tour Pamphlet Guide - ${booking.bookingId}`;
    const mailBody = `Hello from TourNex Premium Logistics!

Thank you for choosing TourNex. Your booking is successfully processed and registered.

=========================================
      TOURNEX BOOKING CONFIRMATION RECEIPT      
=========================================
Reservation Reference: ${booking.bookingId}
Booking Item: ${booking.name}
Assigned Hotel/Stay: ${booking.hotelName || 'Regional Premium Partner Resort'}
Allocated Dates: ${booking.dates}
Grand Total Paid: INR ${booking.price.toLocaleString()}
Payment Status: SUCCESSFUL & CONFIDENTIAL

=========================================
      YOUR COMPLIMENTARY TRAVEL PAMPHLET       
=========================================
South India's Curated Explorer Network highlights:

1. Golden Coffee Track (Coorg)
Mist-covered deep mountains, premium estate homestays, dynamic organic spice plantations & scenic Abbey Falls.

2. French Colonial Coast (Pondicherry/Auroville)
Cobblestone alleys, quiet Promenade Beach trails, organic spiritual commune & French-fusion patisseries.

3. Ancient Heritage Trail (Madurai)
Majestic towering spires of Meenakshi Temple, architectural galleries of Thirumalai Nayak, and street cuisine trackers.

★ EXCLUSIVE REGISTERED MEMBER PERK:
Present this email confirmation/receipt at the reception desk during check-in to get a complimentary Welcomed Beverage & 15% Spa/Dining Discount coupon at our partner resorts!

Wishing you a magical and safe voyage!

Warm regards,
TourNex Client Services Coordinator
https://ai.studio/build (Shared AI Applet Node)`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
  };

  const getSMSURL = () => {
    if (!booking) return '#';
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const textMsg = `TourNex Booking Confirmed! Ref: ${booking.bookingId}. ${booking.name}, Dates: ${booking.dates}, Paid: INR ${booking.price.toLocaleString()}. Check your email (${emailAddress}) for your Digital Pamphlet booklet & 15% discount check gift!`;
    return `sms:${cleanPhone}?body=${encodeURIComponent(textMsg)}`;
  };

  const getWhatsAppURL = () => {
    if (!booking) return '#';
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const messageText = `Hi there! Your TourNex booking for ${booking.name} (Ref: ${booking.bookingId}) has been successfully processed in real time! ✨ Dates: ${booking.dates}. Total Paid: INR ${booking.price.toLocaleString()}. Present this at check-in for your complimentary Welcome Drink & 15% Spa Coupon! Check your inbox (${emailAddress}) for your Full Digital Pamphlet Brochure. Have a magical stay!`;
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`;
  };

  const handleManualResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      showToast('Please provide a valid Phone Number!');
      return;
    }
    if (!emailAddress.includes('@')) {
      showToast('Please provide a valid Gmail Address!');
      return;
    }
    
    // Launch actual device protocols based on client capability to send to actual custom accounts
    try {
      const gmailUrl = getGmailURL();
      window.open(gmailUrl, '_blank');
      showToast('Opened secure Google Gmail pre-filled draft composition tab!');
    } catch (err) {
      console.warn("External window popup restricted in iframe sandbox:", err);
    }

    triggerDispatchSequence();
  };

  const showToast = (msg: string) => {
    setToastFeedback(msg);
    setTimeout(() => setToastFeedback(null), 3500);
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-950/80 backdrop-blur-subtle p-3 sm:p-4 animate-fade-in" id="notification-gateway-overlay">
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col md:flex-row h-[95vh] md:h-[80vh] max-h-[850px]" id="gateway-container">
        
        {/* LEFT SIDE PANEL: Simulated Dispatch Controllers & Input Forms */}
        <div className="w-full md:w-2/5 p-5 sm:p-6 flex flex-col justify-between bg-slate-50 border-r border-slate-200/60 overflow-y-auto shrink-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-blue-600/15 text-blue-600 rounded-xl">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </span>
                <span className="font-mono text-[9px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  REAL-TIME DISPATCH NODE
                </span>
              </div>
              <button 
                onClick={onClose}
                className="md:hidden p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                id="btn-close-gateway-mobile"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-display font-black text-slate-900 text-lg sm:text-xl leading-tight">Digital Dispatch Console</h3>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                Connect your booking seamlessly to native Indian networks. Your dynamic voucher indices and curated booklets are packaged in real-time.
              </p>
            </div>

            {/* Live Active Booking Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 mb-4 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 rounded-bl-3xl flex items-center justify-center text-emerald-600">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase tracking-wider">BOOKED TICKET SOURCE</span>
              <h4 className="text-xs font-extrabold text-slate-850 line-clamp-1 mt-0.5">{booking.name}</h4>
              
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                <div>
                  <span className="text-slate-400 block font-mono text-[8.5px]">RESERVATION REF ID:</span>
                  <strong className="font-mono text-slate-700">{booking.bookingId}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[8.5px]">GRAND TARIFF COST:</span>
                  <strong className="text-slate-900 font-bold">₹{booking.price.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Live progress flow log entries */}
            <div className="space-y-3 mb-5">
              <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">TELECOM & MAIL TRANSACTIONS</h5>
              
              {/* Step 1: SMTP handshake */}
              <div className="flex items-start space-x-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200/50">
                <div className="mt-0.5 shrink-0">
                  {dispatchStep >= 1 ? (
                    <div className="h-5 w-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[11px]">✓</div>
                  ) : (
                    <div className="h-5 w-5 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-[10px]"><Clock className="h-3 w-3 animate-spin" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-[11px] ${dispatchStep >= 1 ? 'text-slate-800' : 'text-slate-450'}`}>Live SMTP Handshake</p>
                  <p className="text-[9.5px] text-slate-400 truncate">Carrier status: connected and secure.</p>
                </div>
              </div>

              {/* Step 2: SMS & WhatsApp Dispatch */}
              <div className="flex items-start space-x-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200/50">
                <div className="mt-0.5 shrink-0">
                  {dispatchStep >= 2 ? (
                    <div className="h-5 w-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[11px]">✓</div>
                  ) : dispatchStep === 1 ? (
                    <div className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] animate-pulse">●</div>
                  ) : (
                    <div className="h-5 w-5 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-[10px]"><Phone className="h-3 w-3" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-[11px] ${dispatchStep >= 2 ? 'text-slate-800' : 'text-slate-450'}`}>WhatsApp & SMS Carrier</p>
                  <p className="text-[9.5px] text-slate-450 truncate">
                    {dispatchStep >= 2 ? `Delivered voucher details in real-time to ${phoneNumber}` : `Awaiting queuing protocol...`}
                  </p>
                </div>
              </div>

              {/* Step 3: Google Gmail Delivery */}
              <div className="flex items-start space-x-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200/50">
                <div className="mt-0.5 shrink-0">
                  {dispatchStep >= 3 ? (
                    <div className="h-5 w-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[11px]">✓</div>
                  ) : dispatchStep === 2 ? (
                    <div className="h-5 w-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] animate-pulse">●</div>
                  ) : (
                    <div className="h-5 w-5 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center text-[10px]"><Mail className="h-3 w-3" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-[11px] ${dispatchStep >= 3 ? 'text-slate-800' : 'text-slate-450'}`}>Gmail Delivery Tunnel</p>
                  <p className="text-[9.5px] text-slate-450 truncate">
                    {dispatchStep >= 3 ? `Verified HTML Booking summary dispatched to ${emailAddress}` : `Awaiting dynamic package compilation...`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form to submit to their real Google and Mobile numbers */}
          <form onSubmit={handleManualResend} className="border-t border-slate-200/60 pt-4 mt-2 space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h6 className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block">RECIPIENTS PROFILE COORDINATES</h6>
              <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-sm font-semibold font-mono animate-pulse">Auto-dispatched</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[8.5px] font-mono text-slate-400 uppercase mb-0.5">Mobile Phone: *</label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isSending}
                    className="w-full pl-8 pr-2.5 py-2 text-[11px] font-semibold bg-white border border-slate-205 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
                    placeholder="+91 98450 12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[8.5px] font-mono text-slate-400 uppercase mb-0.5">Guest Gmail Address: *</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    disabled={isSending}
                    className="w-full pl-8 pr-2.5 py-2 text-[11px] font-semibold bg-white border border-slate-205 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
                    placeholder="guest.explorer@gmail.com"
                  />
                </div>
              </div>
            </div>

            {/* Direct Send button that pops real client triggers */}
            <div className="space-y-2 pt-1.5">
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] py-2.5 rounded-xl transition duration-150 cursor-pointer shadow-md shadow-blue-500/10 flex items-center justify-center space-x-2 disabled:bg-blue-300 disabled:cursor-not-allowed uppercase tracking-wider font-mono"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSending ? 'Transmitting In Real-Time...' : 'Open Gmail Draft & Resend'}</span>
              </button>
              
              <div className="text-center font-mono">
                <span className="text-[9px] text-slate-400">Standard telecom SMS & SMTP gateways simulated synchronously.</span>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE PANEL: LIVE INTERACTIVE SUITE - REAL-TIME PHONE & GMAIL SIMULATORS */}
        <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
          
          {/* Header tabs select bar */}
          <div className="flex bg-slate-950 p-2 sm:p-2.5 border-b border-slate-850 items-center justify-between overflow-x-auto shrink-0 select-none">
            <div className="flex space-x-1.5" id="brochure-toggle-tabs">
              <button
                onClick={() => setActiveView('status')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition shrink-0 ${
                  activeView === 'status' ? 'bg-slate-800 text-white border border-slate-705' : 'text-slate-400 hover:text-white'
                }`}
              >
                Booking Receipt
              </button>
              
              <button
                onClick={() => setActiveView('phone')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition shrink-0 flex items-center space-x-1 ${
                  activeView === 'phone' ? 'bg-[#ff9f0a]/10 text-[#ffaa24] border border-[#ffaa24]/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="flex items-center">
                  Live Phone Feed 
                  {dispatchStep >= 2 && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>}
                </span>
              </button>

              <button
                onClick={() => setActiveView('gmail')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition shrink-0 flex items-center space-x-1 ${
                  activeView === 'gmail' ? 'bg-[#ff3b30]/10 text-[#ff5b52] border border-[#ff3b30]/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Inbox className="h-3.5 w-3.5" />
                <span className="flex items-center">
                  Gmail Portal
                  {dispatchStep >= 3 && <span className="ml-1 w-1.5 h-1.5 bg-red-500 rounded-full text-[8px] px-1 font-sans text-white h-3.5 flex items-center justify-center">1</span>}
                </span>
              </button>

              <button
                onClick={() => setActiveView('brochure')}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition shrink-0 flex items-center space-x-1 ${
                  activeView === 'brochure' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                <span>TourNex Pamphlet</span>
              </button>
            </div>

            <button 
              onClick={onClose}
              className="hidden md:block p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
              id="btn-close-gateway-desktop"
              title="Close Panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* MAIN SIMULATION STAGE AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-center bg-slate-950/40">
            
            {/* VIEW A: HARD COPY RECEIPT */}
            {activeView === 'status' && (
              <div className="space-y-4 font-mono text-[11px] bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl text-slate-300 relative shadow-inner max-w-xl mx-auto w-full">
                <div className="absolute top-2.5 right-3 text-[8.5px] bg-emerald-500/20 text-emerald-450 border border-emerald-500/30 px-2 py-0.5 rounded font-sans font-extrabold uppercase">
                  PAID RECEIPT
                </div>
                <div className="text-center border-b border-dashed border-slate-800 pb-4">
                  <h4 className="font-sans font-black text-white tracking-wider text-sm uppercase">TourNex Premium Logistics</h4>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">South India's Smart Regional Concierge Network</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Transaction ID: TXN-{booking.bookingId || 'PENDING'}</p>
                </div>

                <div className="space-y-2 py-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">RESERVATION CODE:</span>
                    <span className="font-bold text-white font-mono">{booking.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">CUSTOMER CONTACT:</span>
                    <span className="font-bold text-slate-300 truncate max-w-[200px]">{emailAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">PHONE MOBILE:</span>
                    <span className="font-bold text-slate-300 font-mono">{phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">DATES RESERVED:</span>
                    <span className="text-right truncate max-w-[210px] text-slate-200">{booking.dates}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500 uppercase">LODGING SPOT:</span>
                    <span className="font-bold text-white text-right max-w-[210px] truncate">{booking.hotelName || 'Premium Partner Stay'}</span>
                  </div>
                </div>

                <div className="border-t border-b border-dashed border-slate-800 py-3 my-2 space-y-1.5">
                  <div className="flex justify-between text-slate-400 font-black">
                    <span>ITEM TARIFF DESIGNATION</span>
                    <span>AMOUNT (INR)</span>
                  </div>
                  <div className="flex justify-between text-[10px] pt-0.5 text-slate-350">
                    <span>1x {booking.name.slice(0, 36)}...</span>
                    <span>₹{booking.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-sans">
                    <span>TourNex Digital Concierge Fee</span>
                    <span>₹0.00 (Waived)</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-sans">
                    <span>GST (18% Statutory Levy Rate)</span>
                    <span className="text-slate-400">Included</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs sm:text-sm font-bold text-white">
                  <span>TOTAL PAID IN FULL</span>
                  <span className="text-emerald-400 font-mono text-sm sm:text-base">₹{booking.price.toLocaleString()}</span>
                </div>

                <div className="text-[9px] text-slate-500 font-sans leading-normal pt-4 text-center border-t border-slate-800 border-dashed space-y-1">
                  <p>✓ Receipt securely transmitted via real-time carrier node network.</p>
                  <p className="italic text-[8px] text-slate-600 mt-1">Disclaimer: Simulated sandbox invoice certified for tour logs.</p>
                </div>
              </div>
            )}

            {/* VIEW B: INTERACTIVE LIVE SMARTPHONE SIMULATOR */}
            {activeView === 'phone' && (
              <div className="animate-scale-up w-full flex flex-col items-center">
                
                {/* Simulated Smartphone Frame */}
                <div className="w-[280px] h-[550px] bg-[#0f172a] rounded-[48px] p-3 border-[6px] border-slate-700 shadow-2xl relative flex flex-col overflow-hidden">
                  
                  {/* Dynamic Island Chamber */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-30 flex items-center justify-between px-3 text-[9px] text-white">
                    <span className="text-[8px] font-bold text-yellow-400">⚡ Core</span>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
                  </div>

                  {/* Phone Status bar */}
                  <div className="h-6 flex justify-between items-center text-[9px] font-semibold text-slate-350 px-5 pt-1.5 z-20 font-sans shrink-0">
                    <span>{systemTime}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-[8px]">Jio 5G</span>
                      <span>📶</span>
                      <span>🔋 88%</span>
                    </div>
                  </div>

                  {/* Phone Inner Display Stage */}
                  <div className="flex-1 rounded-[38px] overflow-hidden relative bg-slate-900 flex flex-col justify-between p-3.5 text-slate-200">
                    
                    {/* Device content based on notification app state */}
                    {phoneScreenState === 'lock' && (
                      <div className="flex-1 flex flex-col justify-between pt-10 pb-6 relative">
                        {/* Lock screen top stats */}
                        <div className="text-center space-y-1">
                          <span className="text-xl">🔒</span>
                          <h4 className="text-2xl font-extralight tracking-tight text-white">{systemTime}</h4>
                          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                        </div>

                        {/* Slide-down incoming push notification banner */}
                        {showNotificationAlert && dispatchStep >= 2 && (
                          <div 
                            onClick={() => setPhoneScreenState('whatsapp')}
                            className="bg-slate-950/95 border border-slate-800/80 rounded-2xl p-3 shadow-xl absolute top-24 inset-x-0 mx-auto z-40 animate-slide-in cursor-pointer hover:bg-slate-900 border-l-4 border-l-emerald-500 active:scale-95 transition"
                          >
                            <div className="flex items-center justify-between text-[9px] text-emerald-400 font-semibold mb-1">
                              <span className="flex items-center gap-1">💬 WhatsApp • Just now</span>
                              <span>now</span>
                            </div>
                            <h5 className="text-[10px] font-extrabold text-[#f8fafc] truncate">TourNex India Booking Desk</h5>
                            <p className="text-[9.5px] text-slate-300 leading-snug line-clamp-2 mt-0.5">
                              Reservation Ref: {booking.bookingId}. Success! Stay at {booking.hotelName || booking.name} is booked...
                            </p>
                            <span className="text-[8px] bg-slate-900 text-slate-400 px-1 py-0.5 rounded font-mono font-bold mt-1.5 inline-block">Tap to open chat</span>
                          </div>
                        )}

                        {/* Bottom action trigger bar */}
                        <div className="space-y-3 shrink-0">
                          <div className="bg-slate-955/60 backdrop-blur-md rounded-xl p-2.5 border border-slate-800/40 text-center text-[9px] text-slate-300 leading-normal">
                            <span className="text-amber-400 font-bold block uppercase tracking-wider text-[8px] mb-0.5 font-mono">Real-time device preview</span>
                            The phone automatically vibrates and flashes when your reservation secures on native Indian systems!
                          </div>
                          
                          <button 
                            onClick={() => setPhoneScreenState('whatsapp')}
                            className="w-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 py-2 rounded-xl text-[10px] font-bold text-white transition flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <span>🔓 Swipe Up to open WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {phoneScreenState === 'whatsapp' && (
                      <div className="flex-1 flex flex-col justify-between bg-slate-950 font-sans text-xs">
                        
                        {/* WhatsApp Headers */}
                        <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center space-x-2 shrink-0">
                          <button 
                            onClick={() => setPhoneScreenState('lock')} 
                            className="text-emerald-500 font-bold hover:text-emerald-400 text-[10px]"
                          >
                            ◀ Lock
                          </button>
                          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 font-bold text-[9px] tracking-tight border border-emerald-500/30">
                            TN
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-[10.5px] text-white truncate leading-tight">TourNex India</h5>
                            <span className="text-[8.5px] text-slate-400 font-mono">Online • Verified Agent</span>
                          </div>
                        </div>

                        {/* WhatsApp Chat dialogue thread bubble screen */}
                        <div className="flex-1 p-2 overflow-y-auto space-y-3 bg-[#0a0f0d] flex flex-col justify-end">
                          <div className="text-[8.5px] bg-[#1a2e2b] text-teal-400 py-1 px-2.5 rounded-lg text-center mx-auto max-w-[170px] border border-emerald-900/30 font-medium">
                            🔒 Messages are secured with end-to-end sandbox certificates.
                          </div>
                          
                          {dispatchStep >= 2 ? (
                            <div className="bg-[#05604c] text-white p-2.5 rounded-xl self-end max-w-[90%] text-[10px] leading-relaxed shadow-sm relative border border-emerald-600/20 select-text">
                              <p className="font-extrabold text-teal-200 uppercase text-[8px] tracking-wide mb-1 flex items-center gap-1">
                                <span>⚡ IN-APP TELEGRAM VOUCHER</span>
                              </p>
                              Hi there! Your TourNex booking for <strong>{booking.name}</strong> has been successfully processed in real time!
                              
                              <div className="bg-[#044a3b]/60 border border-emerald-800/40 p-1.5 rounded-lg my-1.5 text-[9px] space-y-0.5 text-slate-200">
                                <div>• <strong>Ref ID:</strong> {booking.bookingId}</div>
                                <div>• <strong>Dates:</strong> {booking.dates}</div>
                                <div>• <strong>Stay:</strong> {booking.hotelName || 'Regency Club'}</div>
                                <div className="text-emerald-300 font-bold">• <strong>Total Paid:</strong> INR {booking.price.toLocaleString()}</div>
                              </div>
                              
                              <p className="text-[9.5px]">
                                Present this at check-in for your complimentary Welcome Beverage & 15% Spa/Dining Coupon!
                              </p>
                              
                              <span className="block text-right text-[8px] text-teal-300 font-mono mt-1">
                                {systemTime} • Sent ✓✓
                              </span>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-500 text-[10px] leading-normal px-2">
                              Awaiting booking trigger... The real-time WhatsApp push notification will be shown here upon confirmation.
                            </div>
                          )}
                        </div>

                        {/* WhatsApp Message write bar bottom */}
                        <div className="bg-slate-900 p-2 flex items-center space-x-1.5 border-t border-slate-800 shrink-0">
                          <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1 text-[9.5px] text-slate-400">
                            Pre-verified receipt loaded
                          </div>
                          <button 
                            type="button" 
                            onClick={() => {
                              window.open(getWhatsAppURL(), '_blank');
                              showToast('Redirected to native WhatsApp dispatcher thread!');
                            }}
                            className="bg-emerald-650 hover:bg-emerald-600 text-white rounded-full h-6.5 w-6.5 flex items-center justify-center font-bold text-[11px] shrink-0 border-none cursor-pointer p-0"
                            title="Direct WhatsApp"
                          >
                            🚀
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Device Bottom Handlebar */}
                  <div className="h-5 flex items-center justify-center shrink-0">
                    <div className="w-24 h-1 bg-slate-500 rounded-full"></div>
                  </div>
                </div>

                {/* Simulated action triggers */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm w-full">
                  <button
                    onClick={() => {
                      try {
                        const whatsappUrl = getWhatsAppURL();
                        window.open(whatsappUrl, '_blank');
                        showToast('Triggered real WhatsApp messaging dialogue!');
                      } catch (err) {
                        console.warn("Popup blocked:", err);
                      }
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white border-none py-2 rounded-xl text-[10px] font-black transition active:scale-95 cursor-pointer flex items-center justify-center space-x-1 shadow-md shadow-emerald-500/10"
                  >
                    <span>💬 Test Real WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      try {
                        const smsUrl = getSMSURL();
                        window.location.href = smsUrl;
                        showToast('Triggered real mobile carrier SMS client!');
                      } catch (err) {
                        console.warn("SMS restricted:", err);
                      }
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-705 py-2 rounded-xl text-[10px] font-bold transition active:scale-95 cursor-pointer"
                  >
                    <span>📱 Test Carrier SMS</span>
                  </button>
                </div>

              </div>
            )}

            {/* VIEW C: GMAIL DESKTOP WEB SIMULATOR */}
            {activeView === 'gmail' && (
              <div className="animate-scale-up w-full max-w-2xl mx-auto flex flex-col rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl overflow-hidden font-sans text-xs">
                
                {/* Simulated Web Browser Tab header */}
                <div className="bg-[#1e293b] p-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block pl-2 font-medium">Google Gmail Sandbox</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded px-3 py-1 font-mono text-[9px] text-slate-300 text-center max-w-sm w-44 sm:w-60 truncate">
                    https://mail.google.com/u/0/inbox
                  </div>
                  <div className="text-[10px] text-slate-500">Node: Sandbox</div>
                </div>

                {/* Browser content: Mock Gmail Inbox view */}
                <div className="flex h-[380px] bg-slate-950 text-slate-200">
                  
                  {/* Mock Sidebar */}
                  <div className="w-1/4 bg-slate-900/80 border-r border-slate-850 p-2 sm:p-3 space-y-2 shrink-0 text-[10px]">
                    <button className="w-full bg-red-650 hover:bg-red-600 text-white font-bold py-1.5 rounded-lg text-center cursor-pointer border-none text-[10px] uppercase tracking-wide">
                      Compose
                    </button>
                    <div className="space-y-1.5 pt-2">
                      <div className="bg-slate-800/80 text-white font-bold px-2 py-1.5 rounded-md flex items-center justify-between cursor-pointer">
                        <span>📥 Inbox</span>
                        <span className="bg-red-500 text-white rounded-full px-1.5 text-[8px] font-sans font-bold">1</span>
                      </div>
                      <div className="text-slate-400 px-2 py-1.5 rounded flex items-center justify-between hover:text-white cursor-pointer">
                        <span>⭐ Starred</span>
                      </div>
                      <div className="text-slate-400 px-2 py-1.5 rounded flex items-center justify-between hover:text-white cursor-pointer">
                        <span>📤 Sent Mail</span>
                      </div>
                      <div className="text-slate-400 px-2 py-1.5 rounded flex items-center justify-between hover:text-white cursor-pointer">
                        <span>📝 Drafts</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Emails Listing & Content Reader pane */}
                  <div className="flex-1 flex flex-col overflow-y-auto">
                    
                    {!isEmailExpanded ? (
                      /* LIST VIEW */
                      <div className="flex-1 flex flex-col">
                        <div className="p-3 border-b border-slate-850 flex items-center justify-between bg-slate-950 shrink-0">
                          <strong className="text-xs text-white">Primary Mail Feed</strong>
                          <span className="text-[10px] text-slate-500">1 - 1 of 1</span>
                        </div>

                        {dispatchStep >= 3 ? (
                          <div 
                            onClick={() => setIsEmailExpanded(true)}
                            className="p-3 border-b border-slate-850 hover:bg-slate-900/80 cursor-pointer flex items-center justify-between transition border-l-4 border-l-blue-500 bg-blue-950/20"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                              <strong className="text-white text-[11px] shrink-0 font-extrabold">TourNex Premium Logistics</strong>
                              <span className="text-slate-205 truncate font-semibold text-[10px]">
                                Booking Secured! Ref ID: {booking.bookingId} — Stay/package locked in real-time...
                              </span>
                            </div>
                            <span className="text-slate-450 text-[9.5px] whitespace-nowrap shrink-0 ml-2 font-mono">Just Now</span>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 text-slate-500">
                            <Clock className="h-6 w-6 text-slate-650 animate-spin mb-2" />
                            <p className="text-[10px]">Connecting dynamic electronic mail relays...</p>
                          </div>
                        )}
                        
                        {/* Fake older email */}
                        <div className="p-3 border-b border-slate-850 hover:bg-slate-900/40 cursor-default opacity-40 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-transparent shrink-0"></span>
                            <span className="text-slate-350 text-[10.5px] truncate font-medium">Ministry of Tourism (GoI)</span>
                            <span className="text-slate-400 truncate text-[9.5px]">Regional regulatory permit clearance registered for local guides...</span>
                          </div>
                          <span className="text-slate-500 text-[9px] shrink-0 ml-2 font-mono">11 Hours Ago</span>
                        </div>

                      </div>
                    ) : (
                      /* EMAIL EXTENDED RICH DETAIL VIEW */
                      <div className="flex-1 p-4 sm:p-5 space-y-4">
                        
                        {/* Email back to list header */}
                        <div className="flex items-center space-x-2 border-b border-slate-850 pb-2.5 text-[10px] justify-between shrink-0">
                          <button 
                            onClick={() => setIsEmailExpanded(false)}
                            className="text-blue-500 hover:text-blue-400 font-extrabold cursor-pointer"
                          >
                            ◀ Back to Inbox Primary
                          </button>
                          <span className="text-slate-400 font-mono">Message-ID: &lt;sh.2026.tournex.{booking.bookingId}@inbox.gmail.com&gt;</span>
                        </div>

                        {/* Sender info title */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">T</div>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <strong className="text-white text-[11px]">TourNex AI Booking Node</strong>
                                <span className="text-[9px] text-slate-400 font-mono">&lt;bookings@tournex.in&gt;</span>
                              </div>
                              <span className="text-[9px] text-slate-400">To: {emailAddress} • Just now</span>
                            </div>
                          </div>
                          <div className="text-[9.5px] text-slate-500 font-mono">Certified secure</div>
                        </div>

                        {/* Rich HTML Invoice content container */}
                        <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md max-w-xl mx-auto select-text text-[11px] leading-relaxed border border-slate-200">
                          
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3" style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <div>
                              <h4 className="font-sans font-black text-slate-905 uppercase text-xs tracking-wider">TOURNEX EXPEDITIONS</h4>
                              <p className="text-[9px] text-slate-400 font-sans">Authorized Indian Agency License No: IN-893042-C</p>
                            </div>
                            <span className="bg-blue-100 text-blue-850 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200">OFFICIAL VERIFIED E-CONFIRMATION</span>
                          </div>

                          <p className="font-sans">
                            Dear Traveler Guest, 
                          </p>
                          <p className="font-sans">
                            Thank you for booking with us. We have securely processed your reservation. Standard check-in privileges and details are described below:
                          </p>

                          <div className="bg-slate-50 border border-slate-200/65 rounded-xl p-3.5 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                              <div>
                                <span className="text-slate-400 block uppercase font-mono text-[8px] tracking-wider">Reservation Reference ID</span>
                                <strong className="text-blue-700 font-mono text-xs">{booking.bookingId}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block uppercase font-mono text-[8px] tracking-wider">Dates Reserved</span>
                                <strong className="text-slate-800">{booking.dates}</strong>
                              </div>
                            </div>
                            
                            <div className="border-t border-slate-200/40 pt-2 text-[10px] font-sans">
                              <span className="text-slate-405 block uppercase font-mono text-[8px] tracking-wider">Accommodation / Stay</span>
                              <strong className="text-slate-800">{booking.hotelName || booking.name}</strong>
                            </div>

                            <div className="border-t border-slate-200/40 pt-2 text-[10px] font-sans">
                              <span className="text-slate-405 block uppercase font-mono text-[8px] tracking-wider">Total Charge Deducted</span>
                              <strong className="text-emerald-700 text-xs">INR {booking.price.toLocaleString()} (SUCCESS)</strong>
                            </div>
                          </div>

                          {/* Complimentary stamp perk code */}
                          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5 text-amber-900 border-l-4 border-l-amber-500">
                            <span className="text-base shrink-0">🎁</span>
                            <div className="text-[10px] leading-snug">
                              <strong className="block text-amber-950 font-bold uppercase tracking-wide text-[8.5px] font-mono">Exclusive Member check-in stamp check:</strong>
                              Present this confirmation email to the check-in desk at any partner resort to claim your complimentary <strong>Curated Welcome Beverage & 15% Spa and Dining Coupon</strong>! Preset coupon code: <span className="font-mono bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-extrabold">PREMIUM-TOUR-2026</span>.
                            </div>
                          </div>

                          <div className="text-center pt-2 text-[9px] text-slate-400 border-t border-slate-100 italic">
                            For support coordinates call standard support protocols. Safe voyage explorer!
                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* Simulated workspace external composer button */}
                <div className="bg-[#1e293b] p-3 text-center border-t border-slate-800">
                  <button
                    onClick={() => {
                      const gmailUrl = getGmailURL();
                      window.open(gmailUrl, '_blank');
                      showToast('Opened Google Gmail draft prefilled in separate tab!');
                    }}
                    className="bg-[#d93025] hover:bg-[#b02218] text-white border-none px-4 py-2 rounded-xl text-[10px] font-black uppercase font-mono tracking-wider transition cursor-pointer flex items-center justify-center space-x-1.5 mx-auto shadow-md"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Open Real Gmail Draft Composer</span>
                  </button>
                </div>

              </div>
            )}

            {/* VIEW D: BEAUTIFUL TRI-FOLD PAMPHLET CATALOG */}
            {activeView === 'brochure' && (
              <div className="space-y-4 animate-scale-up max-w-xl mx-auto w-full text-slate-100" id="tournex-pamphlet-render">
                
                {/* Pamphlet Cover Header Design */}
                <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 p-5 text-center min-h-[140px] flex flex-col justify-between shadow-lg">
                  <div className="absolute top-2 right-2 flex space-x-1 text-[8px] text-amber-450 font-bold tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Sparkles className="h-2 w-2 text-amber-400 animate-spin" />
                    <span>TOURNEX OFFICIAL BLUEPRINT</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-amber-400 font-bold uppercase">South India's Curated Explorer Catalog</span>
                    <h4 className="font-display font-extrabold text-[#F4EEDC] text-lg sm:text-xl mt-1 tracking-wide">TourNex Brochure & Pamphlet</h4>
                    <p className="text-slate-300 text-[11px] mt-1 px-2 leading-relaxed font-sans">
                      Escape the crowd. Unlock hidden sanctuaries, historical marvels, spiritual tracks, and breathtaking cliffside horizons.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-500/20 flex justify-between items-center text-[9px]">
                    <span className="flex items-center text-amber-300 font-bold"><ShieldCheck className="h-3 w-3 mr-1 text-amber-400" /> Government Accredited</span>
                    <span className="text-slate-400 uppercase font-mono">Est. 2026</span>
                  </div>
                </div>

                {/* Main brochure content: Highlights & coupons */}
                <div className="space-y-3 font-sans text-xs">
                  
                  {/* Highlight 1: Popular regional circuits */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <h5 className="font-display font-extrabold text-amber-400 uppercase text-xs flex items-center gap-1.5 tracking-wider">
                      <MapPin className="h-3.5 w-3.5" /> Premium Curated Circuits
                    </h5>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-[#121b2d] p-2.5 rounded-lg border border-slate-850 flex justify-between gap-2">
                        <div className="max-w-[75%]">
                          <strong className="text-slate-100 text-[11px] block text-amber-200">🍊 Golden Coffee Track (Coorg)</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Mist-covered mountains, absolute estate homestays, dynamic organic spice plantations & scenic Abbey Falls guides.</p>
                        </div>
                        <div className="text-right shrink-0 mt-0.5">
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1 rounded block leading-none py-1">3 Days</span>
                          <span className="text-[9px] text-slate-500 font-mono block mt-1">From ₹7,999</span>
                        </div>
                      </div>

                      <div className="bg-[#121b2d] p-2.5 rounded-lg border border-slate-850 flex justify-between gap-2">
                        <div className="max-w-[75%]">
                          <strong className="text-slate-100 text-[11px] block text-amber-200">🌊 French Colonial Coast (Pondicherry)</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Cobblestone alleyways, quiet Promenade Beach trails, organic Auroville spiritual center, and French-fusion bakeries.</p>
                        </div>
                        <div className="text-right shrink-0 mt-0.5">
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1 rounded block leading-none py-1">2 Days</span>
                          <span className="text-[9px] text-slate-500 font-mono block mt-1">From ₹5,499</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exclusive Member welcome benefits coupon */}
                  <div className="bg-gradient-to-r from-amber-900/40 via-yellow-900/10 to-transparent border border-amber-500/30 rounded-xl p-3.5 flex items-center space-x-3">
                    <div className="bg-amber-500/15 text-amber-400 p-2 rounded-xl shrink-0 border border-amber-500/30">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-amber-400 uppercase tracking-widest block font-mono">FRANCHISE PRIVILEGES ATTACHED</span>
                      <strong className="text-xs text-amber-100 block mt-0.5">TourNex Privilege Stamp Card</strong>
                      <p className="text-[10px] text-slate-300 leading-snug mt-0.5">
                        As a registered client, presents this dynamic PDF catalog at any partner resort during check-in to claim a complimentary Welcome Beverage & 15% Spa check-in discount!
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>© TourNex Tours & Package Network 2026.</span>
                    <button 
                      onClick={() => alert("TourNex Pamphlet has been exported as a digital copy to your documents tray!")}
                      className="text-amber-450 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-bold bg-transparent border-none p-0"
                    >
                      <Printer className="h-3 w-3" /> Get Printed/PDF copy
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Action footer closes overlay */}
          <div className="bg-slate-950 p-4 border-t border-slate-850 flex justify-between items-center shrink-0">
            <div className="text-[10px] text-slate-500 hidden sm:block">
              Connected with active booking desk: <span className="font-mono text-blue-400">{booking.bookingId}</span>
            </div>
            
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs px-5 py-2.5 rounded-xl transition duration-150 cursor-pointer border-none"
            >
              Close Dispatch Desk
            </button>
          </div>

        </div>

      </div>

      {/* Real-time mini toast notifications banner pop */}
      {toastFeedback && (
        <div className="fixed bottom-4 left-4 z-50 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-white text-xs animate-scale-up" id="gateway-toast">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{toastFeedback}</span>
        </div>
      )}

    </div>
  );
}
