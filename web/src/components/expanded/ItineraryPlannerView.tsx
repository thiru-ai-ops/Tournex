import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Trash2, Save, ChevronRight, Compass, DollarSign, Sparkles } from 'lucide-react';

export default function ItineraryPlannerView() {
  const [days, setDays] = useState([
    {
      day: 1,
      title: 'Arrival & Palace Sightseeing',
      activities: [
        { id: 'act-1', time: '09:00 AM', name: 'Check-in at Hotel Heritage', location: 'Jaipur Central' },
        { id: 'act-2', time: '11:00 AM', name: 'Explore Hawa Mahal', location: 'Badi Chaupar' },
        { id: 'act-3', time: '03:00 PM', name: 'Visit Jantar Mantar Observatory', location: 'City Palace Complex' }
      ]
    },
    {
      day: 2,
      title: 'Forts & Local Cuisines',
      activities: [
        { id: 'act-4', time: '08:30 AM', name: 'Amer Fort Elephant Ride', location: 'Amer Road' },
        { id: 'act-5', time: '01:30 PM', name: 'Traditional Lunch at Lassiwala', location: 'M.I. Road' },
        { id: 'act-6', time: '04:00 PM', name: 'Sunset at Nahargarh Fort', location: 'Aravalli Hills' }
      ]
    }
  ]);

  const [activeDay, setActiveDay] = useState(1);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('10:00 AM');
  const [newActivityLoc, setNewActivityLoc] = useState('');

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim()) return;

    setDays(prev => prev.map(d => {
      if (d.day === activeDay) {
        return {
          ...d,
          activities: [
            ...d.activities,
            {
              id: `act-${Date.now()}`,
              name: newActivityName.trim(),
              time: newActivityTime,
              location: newActivityLoc.trim() || 'Local Attraction'
            }
          ]
        };
      }
      return d;
    }));

    setNewActivityName('');
    setNewActivityLoc('');
  };

  const handleDeleteActivity = (dayNum: number, actId: string) => {
    setDays(prev => prev.map(d => {
      if (d.day === dayNum) {
        return {
          ...d,
          activities: d.activities.filter(a => a.id !== actId)
        };
      }
      return d;
    }));
  };

  return (
    <div className="space-y-6 text-left" id="itinerary-planner-root">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-800/40 px-2.5 py-1 rounded-full uppercase tracking-widest font-mono font-bold">
            Day-by-Day Route Planner
          </span>
          <h2 className="font-display font-black text-2xl text-white mt-2 tracking-tight">Interactive Itinerary Planner</h2>
          <p className="text-slate-400 text-xs mt-1">Plan your day-to-day sightseeing activities, transit timings, and budget targets.</p>
        </div>
        <button 
          onClick={() => alert('Itinerary saved to database!')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Save className="h-4 w-4" />
          <span>Save Trip Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Day selector & Activities timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Day selection tabs */}
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-xs shrink-0 max-w-md">
            {days.map(d => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeDay === d.day 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Day {d.day}: {d.title.split(' ')[0]}
              </button>
            ))}
            <button
              onClick={() => {
                const nextDay = days.length + 1;
                setDays([...days, { day: nextDay, title: `Exploration Day ${nextDay}`, activities: [] }]);
                setActiveDay(nextDay);
              }}
              className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Day</span>
            </button>
          </div>

          {/* Active Day details & list of activities */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Day {activeDay}: {days.find(d => d.day === activeDay)?.title}
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Timeline schedule for active planning</p>
            </div>

            {/* Timeline */}
            <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-6">
              {days.find(d => d.day === activeDay)?.activities.map((act, index) => (
                <div key={act.id} className="relative group">
                  {/* Timeline dot */}
                  <span className="absolute -left-9.5 top-1 h-7 w-7 rounded-full bg-blue-50 border-2 border-blue-600 text-blue-600 flex items-center justify-center font-bold text-[10px] shadow-sm">
                    {index + 1}
                  </span>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:border-slate-300 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{act.time}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight">{act.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>{act.location}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteActivity(activeDay, act.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition cursor-pointer"
                      title="Remove activity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {days.find(d => d.day === activeDay)?.activities.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No activities planned for this day yet. Add one using the form below!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Add Activity Form & Budget Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Add Activity Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">Add Activity</h4>
            
            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Activity Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Traditional Dinner" 
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 07:30 PM" 
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. M.I. Road" 
                    value={newActivityLoc}
                    onChange={(e) => setNewActivityLoc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Day {activeDay}</span>
              </button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4">
            <h4 className="font-display font-bold text-sm">Itinerary Metrics</h4>
            
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/30">
                <span className="text-[9px] text-slate-500 uppercase block font-mono">Total Activities</span>
                <strong className="text-base text-blue-400 mt-1 block">
                  {days.reduce((acc, curr) => acc + curr.activities.length, 0)}
                </strong>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/30">
                <span className="text-[9px] text-slate-500 uppercase block font-mono font-bold text-amber-500">Est. Mileage</span>
                <strong className="text-base text-amber-400 mt-1 block">18 km</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
