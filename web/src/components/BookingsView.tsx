import React, { useState } from 'react';
import { Booking } from '../types';
import TournexNotificationGateway from './TournexNotificationGateway';
import { Mail, Calendar, ArrowRight, CheckCircle2, Ticket, Printer, XCircle, RefreshCcw, HelpCircle, FileText } from 'lucide-react';

interface BookingsViewProps {
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
}

export default function BookingsView({ bookings, onAddBooking }: BookingsViewProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [ticketModal, setTicketModal] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeGatewayBooking, setActiveGatewayBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const handleDownloadTicket = (b: Booking) => {
    setTicketModal(b);
  };

  const exportSingleBooking = (booking: Booking) => {
    const summary = `==================================================
TOURNEX TRAVEL BOOKING SUMMARY
==================================================
Reservation ID: ${booking.bookingId}
Destination   : ${booking.name}
Status        : ${booking.status}
Dates         : ${booking.dates}
Total Cost    : ₹${booking.price.toLocaleString()}

--------------------------------------------------
${booking.isPackage ? `PACKAGE DETAILS:
- Hotel Stay: ${booking.hotelName || 'N/A'}${booking.nightsCount ? ` (${booking.nightsCount} Nights, ${booking.roomsCount || 1} Room)` : ''}
- Sightseeing Spots Included:
${booking.spotsIncluded ? booking.spotsIncluded.map(spot => `  * ${spot}`).join('\n') : '  None'}
` : 'Trip Package: Standard Booking (No extra package add-ons)'}
--------------------------------------------------
Generated on  : ${new Date().toLocaleDateString()}
Thank you for choosing TourNex!
==================================================`;

    try {
      const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TourNex-Booking-${booking.bookingId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }

    setToastMessage(`Summary for "${booking.name}" exported to TourNex-Booking-${booking.bookingId}.txt!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const exportAllBookings = () => {
    if (bookings.length === 0) {
      alert("No travel history bookings found to export!");
      return;
    }
    let summary = `==================================================
TOURNEX - MY COMPREHENSIVE TRAVEL HISTORY
==================================================
Total Reservations: ${bookings.length}
Generated Date    : ${new Date().toLocaleDateString()}

`;

    bookings.forEach((booking, idx) => {
      summary += `[Trip #${idx + 1}]
Destination : ${booking.name}
Booking ID  : ${booking.bookingId}
Status      : ${booking.status}
Dates       : ${booking.dates}
Total Cost  : ₹${booking.price.toLocaleString()}
${booking.isPackage ? `Hotel Stay  : ${booking.hotelName || 'N/A'} (${booking.nightsCount || 4} Nights, ${booking.roomsCount || 1} Room)
Sightseeing : ${booking.spotsIncluded ? booking.spotsIncluded.join(', ') : 'None'}` : 'Trip Type   : Standard Booking (Only flight/train travel included)'}
--------------------------------------------------
`;
    });

    summary += `\n==================================================\nThank you for exploring with TourNex!\n==================================================`;

    try {
      const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TourNex-Travel-History.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }

    setToastMessage(`All ${bookings.length} reservations exported to TourNex-Travel-History.txt!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRebook = (b: Booking) => {
    // Rebook completed / cancelled trip as UPCOMING
    const randomId = `TNX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      name: b.name,
      status: 'UPCOMING',
      dates: 'Nov 20 - Nov 24, 2026',
      price: b.price,
      bookingId: randomId,
      image: b.image
    };
    onAddBooking(newBooking);
    alert(`Rebooked! Added upcoming booking for ${b.name} with Reservation ID: ${randomId}`);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in" id="bookings-view-root">
      
      {/* Search and Tabs line bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-200 pb-4 gap-3">
        <div>
          <h1 className="font-display font-extrabold text-[#0f172a] text-2xl tracking-tight">My Travel Bookings</h1>
          <p className="text-slate-500 text-xs mt-1">Review trip receipts, upcoming details, and download boarding itineraries</p>
        </div>

        {/* Tab filters and Export action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <button
            onClick={exportAllBookings}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-150 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shrink-0"
            title="Export all travel bookings as a formatted text file"
            id="btn-export-all-bookings"
          >
            <FileText className="h-4 w-4" />
            <span>Export All Summaries</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex space-x-1 self-start sm:self-auto" id="bookings-status-tabs">
            {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
              <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>

      <div className="space-y-4" id="bookings-list-frame">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No Travel History Selected</h3>
            <p className="text-slate-500 text-xs mt-1">There are no reservations marked as "{activeTab}" currently.</p>
          </div>
        ) : (
          filteredBookings.slice().reverse().map((booking) => (
            <div 
              key={booking.id}
              className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row"
              id={`booking-card-${booking.id}`}
            >
              {/* Left thumbnail image */}
              <div className="relative md:w-56 h-36 md:h-auto bg-slate-100 overflow-hidden shrink-0">
                <img 
                  src={booking.image} 
                  alt={booking.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none shadow-md ${
                    booking.status === 'UPCOMING' ? 'bg-blue-600 text-white' :
                    booking.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200/50 border' :
                    'bg-red-100 text-red-800 border-red-200/50 border'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Booking specifications details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider leading-none">
                      ID: {booking.bookingId}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      ₹{booking.price.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 text-base leading-tight mt-1.5">
                    {booking.name}
                  </h3>
                  
                  <p className="text-slate-500 text-xs font-medium flex items-center mt-2 space-x-1.5">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{booking.dates}</span>
                  </p>

                  {booking.isPackage && (
                    <div className="mt-3.5 space-y-3 border-t border-slate-100 pt-3" id={`package-extra-info-${booking.id}`}>
                      {/* Hotel Stay Room accommodation details and Night counts with image */}
                      {booking.hotelName && (
                        <div>
                          <span className="text-[9px] font-mono font-bold uppercase text-emerald-600 tracking-wider block mb-1">🛎️ Hotel Reservation (Room & Nights):</span>
                          <div className="flex items-center space-x-2.5 bg-emerald-50/50 border border-emerald-100 p-2 rounded-xl">
                            {booking.hotelImage && (
                              <img 
                                src={booking.hotelImage} 
                                alt={booking.hotelName} 
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 object-cover rounded-lg shrink-0 border border-emerald-200"
                              />
                            )}
                            <div className="truncate">
                              <span className="block text-[11px] font-bold text-slate-800 truncate leading-snug">{booking.hotelName}</span>
                              <p className="text-[10px] text-slate-500 font-mono">Duration: {booking.nightsCount || 4} Nights stay ({booking.roomsCount || 1} Room{booking.roomsCount && booking.roomsCount > 1 ? 's' : ''})</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tourist spots there going to see */}
                      {booking.spotsIncluded && booking.spotsIncluded.length > 0 && (
                        <div>
                          <span className="text-[9px] font-mono font-bold uppercase text-blue-600 tracking-wider block mb-1">🗺️ Sightseeing Itinerary spots included:</span>
                          <div className="flex flex-wrap gap-1">
                            {booking.spotsIncluded.map((spot, idx) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-md border border-blue-100">
                                📍 {spot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Countdown & Live Weather Forecast Widget */}
                  {booking.status === 'UPCOMING' && (
                    <div className="mt-3.5 bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      {/* Sub-card 1: Trip Countdown Clock */}
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">⏱️</span>
                        <div>
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Live Trip Countdown</span>
                          <span className="font-mono text-xs font-black text-slate-800 leading-none block mt-1 animate-pulse">
                            {booking.name.includes('Agra') ? '142d - 11h - 45m' :
                             booking.name.includes('Jaipur') ? '175d - 18h - 10m' :
                             booking.name.includes('Varanasi') ? '177d - 02h - 15m' :
                             booking.name.includes('Alleppey') ? '95d - 01h - 20m' :
                             '118d - 15h - 30m'}
                          </span>
                          <span className="text-[9px] text-slate-500 mt-1 block">Time to departure at destination gateway</span>
                        </div>
                      </div>

                      {/* Sub-card 2: Weather & AQI Insights */}
                      <div className="flex items-start space-x-3 border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-3 sm:pt-0 sm:pl-4">
                        <span className="text-xl">☀️</span>
                        <div>
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Live Weather & AQI Forecast</span>
                          <div className="flex items-center space-x-2 mt-1 leading-none">
                            <span className="font-bold text-slate-800 text-xs text-indigo-700">
                              {booking.name.includes('Agra') ? '27°C • Clear Sky' :
                               booking.name.includes('Jaipur') ? '31°C • Sunny & Dry' :
                               booking.name.includes('Varanasi') ? '27°C • Spiritual Haze' :
                               booking.name.includes('Alleppey') ? '28°C • Coastal Breeze' :
                               booking.name.includes('Goa') ? '29°C • Tropical Warmth' :
                               '22°C • Partly Cloudy'}
                            </span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                              booking.name.includes('Varanasi') ? 'bg-amber-100 text-amber-805' :
                              'bg-emerald-100 text-emerald-805'
                            }`}>
                              AQI {booking.name.includes('Agra') ? '72' :
                                   booking.name.includes('Jaipur') ? '110' :
                                   booking.name.includes('Varanasi') ? '160' :
                                   booking.name.includes('Alleppey') ? '42' : '35'}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 block">Ideal touring conditions, zero weather flags</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Operations Actions bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-50" id={`booking-actions-${booking.id}`}>
                  <div className="flex flex-wrap gap-2">
                    {/* Common Export Detail summary */}
                    <button 
                      onClick={() => exportSingleBooking(booking)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200/50 transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                      title="Export travel details text summary"
                      id={`btn-export-booking-${booking.id}`}
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      <span>Export Summary</span>
                    </button>

                    {booking.status === 'UPCOMING' && (
                      <>
                        <button 
                          onClick={() => handleDownloadTicket(booking)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer animate-pulse"
                        >
                          <Ticket className="h-4 w-4" />
                          <span>View Ticket</span>
                        </button>
                        <button 
                          onClick={() => setActiveGatewayBooking(booking)}
                          className="bg-amber-550 bg-amber-500 hover:bg-amber-600 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center space-x-1.5 cursor-pointer"
                          title="Simulate sending receipt and TourNex brochure"
                        >
                          <span>📨 Send to SMS/Gmail</span>
                        </button>
                        <button 
                          onClick={() => setActiveGatewayBooking(booking)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          E-Ticket PDF
                        </button>
                      </>
                    )}

                    {booking.status === 'COMPLETED' && (
                      <>
                        <button 
                          onClick={() => handleRebook(booking)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                          <span>Rebook Trip</span>
                        </button>
                        <button 
                          onClick={() => setActiveGatewayBooking(booking)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                        >
                          <span>📨 Get Receipt & Brochure</span>
                        </button>
                        <button 
                          onClick={() => alert(`Opening tax invoice receipt...`)}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Invoice Details
                        </button>
                      </>
                    )}

                    {booking.status === 'CANCELLED' && (
                      <>
                        <div className="bg-red-50 text-red-700 font-bold px-3 py-1.5 rounded-lg text-[10px] border border-red-100 flex items-center space-x-1">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>REFUND PROCESSED</span>
                        </div>
                        <button 
                          onClick={() => alert(`Opening 24/7 help ticket desk for cancellation support...`)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          <span>Help Center</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Ticket Download Overlay HUD Modal */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" id="ticket-modal">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full space-y-4 relative animate-scale-up">
            
            {/* Header Ticket Deco logo */}
            <div className="border-b border-dashed border-slate-200 pb-3 flex justify-between items-center bg-slate-950 text-white rounded-t-xl -mt-6 -mx-6 px-6 py-4">
              <div>
                <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-blue-400 block leading-none">TourNex Boarding Itinerary</span>
                <span className="font-display font-extrabold text-base block mt-1 leading-none">{ticketModal.bookingId}</span>
              </div>
              <Ticket className="h-6 w-6 text-blue-400" />
            </div>

            <div className="space-y-3 pt-3">
              <div>
                <label className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Booking Landmark details</label>
                <div className="text-xs font-semibold text-slate-800 mt-0.5 leading-snug">{ticketModal.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Service Dates</label>
                  <span className="text-xs text-slate-700 font-bold block mt-0.5">{ticketModal.dates.split(',')[0]}</span>
                </div>
                <div>
                  <label className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Passholder Name</label>
                  <span className="text-xs text-slate-700 font-bold block mt-0.5">Primary Guest + Group</span>
                </div>
              </div>

              {ticketModal.isPackage && (
                <div className="space-y-3.5 border-t border-slate-150 pt-2.5">
                  {/* Hotel highlight for package with Image */}
                  {ticketModal.hotelName && (
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-emerald-600 block uppercase font-black">Verified Hotel Stay:</label>
                      <div className="flex items-center space-x-2 bg-emerald-50/50 border border-emerald-150 p-1.5 rounded-xl">
                        {ticketModal.hotelImage && (
                          <img 
                            src={ticketModal.hotelImage} 
                            alt={ticketModal.hotelName} 
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 object-cover rounded-lg shrink-0 border border-emerald-200"
                          />
                        )}
                        <div className="truncate">
                          <span className="block text-[10px] font-black text-slate-800 truncate leading-tight">{ticketModal.hotelName}</span>
                          <span className="block text-[9px] text-slate-500 font-mono">{ticketModal.nightsCount || 4} Nights stay ({ticketModal.roomsCount || 1} Room)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sightseeing spots names */}
                  {ticketModal.spotsIncluded && ticketModal.spotsIncluded.length > 0 && (
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-blue-600 block uppercase font-black">Sightseeing Spotpasses Included:</label>
                      <div className="flex flex-wrap gap-1 max-h-[72px] overflow-y-auto pr-1">
                        {ticketModal.spotsIncluded.map((spot, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-100 flex items-center gap-0.5">
                            📍 {spot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Barcode Mock segment */}
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1 text-center font-mono text-slate-400 text-[10px] select-none block select-none">
                <div className="h-8 w-full flex items-center justify-center gap-0.5">
                  {[...Array(24)].map((_, i) => (
                    <span 
                      key={i} 
                      style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px` }}
                      className="h-full bg-slate-800" 
                    />
                  ))}
                </div>
                <span className="text-[9px] uppercase tracking-widest block leading-none pt-1">TNX-BARCODE-900341882</span>
              </div>
            </div>

            <button 
              onClick={() => setTicketModal(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition"
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 max-w-sm animate-scale-up" id="toast-export-feedback">
          <div className="bg-emerald-500 text-slate-950 p-1 rounded-full shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-medium block leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* TourNex Dedicated Live Dispatch Center & Digital Booklet Brochure */}
      <TournexNotificationGateway 
        booking={activeGatewayBooking}
        defaultPhone="+91 98450 12345"
        defaultEmail="king11cobra777@gmail.com"
        isOpen={activeGatewayBooking !== null}
        onClose={() => setActiveGatewayBooking(null)}
      />

    </div>
  );
}
