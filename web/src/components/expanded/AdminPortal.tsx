import React, { useState } from 'react';
import { 
  Building, LayoutDashboard, ShieldCheck, MapPin, Users, 
  DollarSign, AlertTriangle, ArrowRight, Star, Send, Plus, Trash2, Edit, Landmark 
} from 'lucide-react';

export default function AdminPortal() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Admin subpages: dashboard, monuments, guides, settlements, alerts
  const [activeAdminSubPage, setActiveAdminSubPage] = useState<'dashboard' | 'monuments' | 'guides' | 'settlements' | 'alerts'>('dashboard');

  // Monument State
  const [adminMonuments, setAdminMonuments] = useState([
    { id: 'm-1', name: 'Hawa Mahal', city: 'Jaipur', fee: 50, hours: '9:00 AM - 5:00 PM' },
    { id: 'm-2', name: 'Amer Fort', city: 'Jaipur', fee: 100, hours: '8:00 AM - 5:30 PM' },
    { id: 'm-3', name: 'Taj Mahal', city: 'Agra', fee: 50, hours: '6:00 AM - 6:30 PM' }
  ]);
  const [newMonName, setNewMonName] = useState('');
  const [newMonCity, setNewMonCity] = useState('');
  const [newMonFee, setNewMonFee] = useState(50);
  const [newMonHours, setNewMonHours] = useState('9:00 AM - 5:00 PM');

  // Guide State
  const [guides, setGuides] = useState([
    { id: 'g-1', name: 'Rajesh Mishra', city: 'Jaipur', badge: 'Elite Guide', status: 'Pending Approval', file: 'rajesh_licence.pdf' },
    { id: 'g-2', name: 'Sujata Nair', city: 'Alleppey', badge: 'Certified Guide', status: 'Approved', file: 'sujata_accreditation.pdf' }
  ]);

  // Broadcast Alert State
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'danger'>('warning');
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: string; text: string; type: string }>>([]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@tournex.com' && adminPassword === 'adminpassword') {
      setIsAdminLoggedIn(true);
      setAdminError('');
    } else {
      setAdminError('Invalid administrator credentials.');
    }
  };

  const handleAddMonument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonName.trim() || !newMonCity.trim()) return;

    setAdminMonuments(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        name: newMonName.trim(),
        city: newMonCity.trim(),
        fee: newMonFee,
        hours: newMonHours
      }
    ]);
    setNewMonName('');
    setNewMonCity('');
  };

  const handleDeleteMonument = (id: string) => {
    setAdminMonuments(prev => prev.filter(m => m.id !== id));
  };

  const handleApproveGuide = (id: string) => {
    setGuides(prev => prev.map(g => g.id === id ? { ...g, status: 'Approved' } : g));
  };

  const handleDeclineGuide = (id: string) => {
    setGuides(prev => prev.map(g => g.id === id ? { ...g, status: 'Declined' } : g));
  };

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertText.trim()) return;

    setActiveAlerts(prev => [
      ...prev,
      { id: `alert-${Date.now()}`, text: alertText.trim(), type: alertType }
    ]);
    setAlertText('');
    alert('Broadcast notification pushed to all mobile devices!');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-6 text-left my-10 shadow-2xl" id="admin-login-root">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg shadow-blue-600/30">
            T
          </div>
          <h3 className="font-display font-black text-lg tracking-tight">Admin & Guide Portal</h3>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">25. Secure Administration Entry</p>
        </div>

        {adminError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center font-semibold">
            {adminError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Admin Email</label>
            <input 
              type="email" 
              placeholder="admin@tournex.com" 
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-semibold text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-semibold text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px] text-slate-400 leading-relaxed">
            💡 Demo credentials:<br />
            <strong>Email:</strong> admin@tournex.com<br />
            <strong>Password:</strong> adminpassword
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition cursor-pointer text-center block shadow-md"
          >
            Authenticate Administrator
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left text-slate-850" id="admin-dashboard-root">
      
      {/* Sidebar navigation */}
      <div className="lg:col-span-3 bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-6">
        <div>
          <span className="text-[9px] text-blue-400 font-mono block font-bold tracking-widest">Back-Office Desk</span>
          <h3 className="font-display font-black text-base mt-1 text-white">TourNex Console</h3>
        </div>

        <nav className="flex flex-col gap-1.5 text-xs font-semibold text-slate-400">
          <button 
            onClick={() => setActiveAdminSubPage('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-left transition ${
              activeAdminSubPage === 'dashboard' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>26. Main Analytics</span>
          </button>
          <button 
            onClick={() => setActiveAdminSubPage('monuments')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-left transition ${
              activeAdminSubPage === 'monuments' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Landmark className="h-4 w-4" />
            <span>27. Monuments Management</span>
          </button>
          <button 
            onClick={() => setActiveAdminSubPage('guides')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-left transition ${
              activeAdminSubPage === 'guides' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>28. Guide Verification</span>
          </button>
          <button 
            onClick={() => setActiveAdminSubPage('settlements')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-left transition ${
              activeAdminSubPage === 'settlements' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>29. Ledger Settlements</span>
          </button>
          <button 
            onClick={() => setActiveAdminSubPage('alerts')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-left transition ${
              activeAdminSubPage === 'alerts' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-850 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>30. Broadcast Alerts</span>
          </button>
        </nav>

        <button 
          onClick={() => setIsAdminLoggedIn(false)}
          className="w-full bg-slate-800 hover:bg-slate-750 text-slate-350 py-2 rounded-xl text-xs font-bold transition text-center block border border-slate-700/50"
        >
          Exit Admin Console
        </button>
      </div>

      {/* Main panel content */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* 26. ANALYTICS DASHBOARD */}
        {activeAdminSubPage === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">System Analytics Overview</h3>
              <p className="text-slate-500 text-xs mt-0.5">Real-time indicators across ticket purchases, verified guides, and transaction volumes.</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Monument Bookings</span>
                <strong className="text-xl text-blue-600 block mt-1">1,240 Passes</strong>
                <span className="text-[8px] text-emerald-600 block mt-0.5">+15% vs yesterday</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Active Travelers</span>
                <strong className="text-xl text-indigo-600 block mt-1">480 Online</strong>
                <span className="text-[8px] text-emerald-600 block mt-0.5">Mobile & Web users</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Registered Guides</span>
                <strong className="text-xl text-amber-600 block mt-1">32 Verified</strong>
                <span className="text-[8px] text-slate-500 block mt-0.5">2 Pending checks</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Commissions Volume</span>
                <strong className="text-xl text-emerald-650 text-emerald-600 block mt-1">₹85,450</strong>
                <span className="text-[8px] text-emerald-600 block mt-0.5">Payout ledger sum</span>
              </div>
            </div>

            {/* Simple Graphic Bar Representing Stays */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Monthly Booking Volume Trend</h4>
              <div className="h-32 flex items-end gap-3.5 pt-4 px-2 border-b border-l border-slate-200 font-mono text-[9px] text-slate-400">
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-blue-600/20 border border-blue-500/40 rounded-t h-[40%] text-center font-bold text-blue-700">420</div>
                  <span>April</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-blue-600/40 border border-blue-500/60 rounded-t h-[65%] text-center font-bold text-blue-700">680</div>
                  <span>May</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-blue-600 border border-blue-700 rounded-t h-[90%] text-center font-bold text-white">1,240</div>
                  <span className="font-bold text-slate-800">June</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 27. MONUMENT MANAGEMENT CRUD */}
        {activeAdminSubPage === 'monuments' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">Heritage Monuments Directory</h3>
              <p className="text-slate-500 text-xs mt-0.5">Add, edit, or remove entries in the primary Archaeological Survey database.</p>
            </div>

            {/* CRUD Form */}
            <form onSubmit={handleAddMonument} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs items-end">
              <div>
                <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-1">Monument Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. City Palace" 
                  value={newMonName}
                  onChange={(e) => setNewMonName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-1">City Hub</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jaipur" 
                  value={newMonCity}
                  onChange={(e) => setNewMonCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase text-slate-400 font-bold mb-1">Entrance Fee (₹)</label>
                <input 
                  type="number" 
                  value={newMonFee}
                  onChange={(e) => setNewMonFee(parseInt(e.target.value) || 50)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none"
                  required
                />
              </div>
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-black text-white py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Monument</span>
              </button>
            </form>

            {/* List */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    <th className="p-3 text-left">Monument Name</th>
                    <th className="p-3 text-left">City Location</th>
                    <th className="p-3 text-left">Timings</th>
                    <th className="p-3 text-left">Entrance Fee</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminMonuments.map(mon => (
                    <tr key={mon.id} className="border-b border-slate-150 last:border-none hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800">{mon.name}</td>
                      <td className="p-3 text-slate-650">{mon.city}</td>
                      <td className="p-3 text-slate-500 font-mono">{mon.hours}</td>
                      <td className="p-3 font-mono font-bold text-blue-600">₹{mon.fee}</td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button onClick={() => handleDeleteMonument(mon.id)} className="text-red-500 hover:text-red-700 p-1 rounded transition cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 28. GUIDE VERIFICATION PORTAL */}
        {activeAdminSubPage === 'guides' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">Guide Accreditations & Verification</h3>
              <p className="text-slate-500 text-xs mt-0.5">Review PDF credential submissions from local guides and approve government license logs.</p>
            </div>

            <div className="space-y-3">
              {guides.map(guide => (
                <div key={guide.id} className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{guide.name}</span>
                      <span className={`text-[8px] px-2 py-0.5 rounded font-mono font-bold ${
                        guide.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>{guide.status}</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1">Location: {guide.city} • Tier: {guide.badge}</p>
                    <span className="block text-[9px] text-indigo-600 font-mono mt-0.5">Uploaded License: {guide.file}</span>
                  </div>

                  {guide.status === 'Pending Approval' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveGuide(guide.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Approve Guide
                      </button>
                      <button 
                        onClick={() => handleDeclineGuide(guide.id)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 29. LEDGER SETTLEMENTS */}
        {activeAdminSubPage === 'settlements' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">Commission & Payout Ledger</h3>
              <p className="text-slate-500 text-xs mt-0.5">Track commissions gathered from government guide matching and active tourist fast-passes.</p>
            </div>

            <div className="bg-slate-50 border border-slate-205 p-5 rounded-2xl space-y-4 text-xs font-sans">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <strong>Local Guide matching fee:</strong>
                <span className="font-mono text-slate-700">₹8,500 payout (10% standard commission)</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <strong>Heritage fast-pass ticket sales:</strong>
                <span className="font-mono text-slate-700">₹72,400 payouts logged to Ministry of Tourism</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <strong className="text-slate-900">Net Settlements Volume:</strong>
                <strong className="text-emerald-600 font-mono text-sm">₹80,900 cleared payouts</strong>
              </div>
            </div>
          </div>
        )}

        {/* 30. BROADCAST SAFETY ALERTS */}
        {activeAdminSubPage === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">Broadcast Safety Alerts Panel</h3>
              <p className="text-slate-500 text-xs mt-0.5">Publish live weather notices, localized closures, or high crowd warnings to all active mobile apps.</p>
            </div>

            <form onSubmit={handleSendAlert} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Select Alert Priority</label>
                <div className="flex gap-2.5">
                  {(['info', 'warning', 'danger'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAlertType(type)}
                      className={`px-4 py-2 rounded-xl border font-bold capitalize transition cursor-pointer ${
                        alertType === type 
                          ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Alert broadcast message</label>
                <textarea 
                  placeholder="e.g. Heavy crowd delays at Jantar Mantar gates. Consider visiting after 3:30 PM."
                  value={alertText}
                  onChange={(e) => setAlertText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-rose-500 h-24"
                  required
                />
              </div>

              <button 
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Send className="h-4 w-4" />
                <span>Broadcast Alert Notification</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
