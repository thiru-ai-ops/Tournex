import React from 'react';
import { TabType } from '../types';
import { Compass, CalendarDays, MessageSquareCode, Receipt, User, History, Route, Menu, X, Landmark } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userName: string;
}

export default function Navbar({ activeTab, setActiveTab, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'explore' as TabType, label: 'Explore', icon: Compass },
    { id: 'gateway' as TabType, label: 'Gateway Finder', icon: Route },
    { id: 'companion' as TabType, label: 'AI Planner', icon: MessageSquareCode },
    { id: 'splitter' as TabType, label: 'Budget Splitter', icon: Receipt },
    { id: 'bookings' as TabType, label: 'My Bookings', icon: History },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex cursor-pointer items-center space-x-2.5 transition active:scale-95"
          id="nav-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" id="nav-desktop">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Status / Action Button */}
        <div className="hidden md:flex items-center space-x-4" id="nav-actions">
          <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-100 rounded-full pl-2.5 pr-4 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              AMM
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-none">{userName}</span>
              <span className="text-[9px] font-mono text-emerald-600 leading-none mt-0.5 font-bold uppercase">● Premium</span>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden" id="nav-mobile-toggle">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white" id="nav-mobile-panel">
          <div className="space-y-1.5 px-4 pt-3 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-mobile-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center space-x-3 px-4 py-2.5 rounded-lg text-base font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="mt-4 border-t border-slate-100 pt-3 flex items-center space-x-3 px-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                AMM
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-800Leading-none">{userName}</span>
                <span className="text-xs text-slate-500 mt-0.5">Elite Explorer • Level 8</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
