import React, { useState } from 'react';
import { Shield, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GoogleAuthSimulator() {
  const [name, setName] = useState('Arjun Dev');
  const [email, setEmail] = useState('arjun.travels@gmail.com');
  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please specify a mock profile name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please specify a valid template email address.');
      return;
    }

    // Redirect to self with successful mock parameters to trigger the postMessage payload
    const params = new URLSearchParams();
    params.set('oauth_mock_success', 'true');
    params.set('name', name.trim());
    params.set('email', email.trim());
    
    window.location.href = window.location.origin + '?' + params.toString();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl max-w-sm w-full overflow-hidden p-6 relative">
        
        {/* Google Multi-colored mock top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-blue-500"></div>
          <div className="flex-1 bg-red-500"></div>
          <div className="flex-1 bg-yellow-500"></div>
          <div className="flex-1 bg-emerald-500"></div>
        </div>

        {/* Header */}
        <div className="text-center mt-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 mb-2 border border-slate-200/50">
            <span className="font-sans font-black text-sm text-blue-600 bg-blue-50 h-7 w-7 rounded-full flex items-center justify-center border border-blue-200/60">G</span>
          </div>
          <h2 className="font-display text-base font-extrabold text-slate-800">Sign in with Google</h2>
          <p className="text-[11px] text-slate-400 mt-1">Simulated Google Accounts developer portal</p>
        </div>

        {/* App connection request banner */}
        <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 text-left mt-4 text-[10px] text-slate-600 flex gap-2.5">
          <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-slate-800">Connect to TourNex Engine</span>
            This application requests permission to read your basic profile info and contact email.
          </div>
        </div>

        {/* Customization Form */}
        <form onSubmit={handleSimulateSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              Select Mock Profile Name
            </label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. Arjun Dev"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              Select Mock Contact Email
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. arjun@gmail.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Requested Scope indicators */}
          <div className="border-t border-b border-slate-100 py-3 space-y-2">
            <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Requested Access Points:</span>
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>openid / oauth2/v2/auth</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>userinfo.profile & userinfo.email</span>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 flex gap-2 text-[11px] text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action trigger buttons */}
          <div className="flex gap-2 pt-1 font-mono">
            <button
              type="button"
              onClick={() => window.close()}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-[10px] transition cursor-pointer text-center"
            >
              Deny
            </button>
            <button
              type="submit"
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-[10px] transition cursor-pointer text-center shadow-sm shadow-blue-500/20"
            >
              Agree & Login
            </button>
          </div>
        </form>

        <p className="text-[9px] text-center text-slate-400 mt-5 leading-normal">
          Agreeing triggers a <code>window.postMessage</code> cross-origin payload returning fully verified Google VIP traveler properties back to parent window.
        </p>

      </div>
    </div>
  );
}
