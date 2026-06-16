import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Languages, Compass, ShieldAlert, PhoneCall } from 'lucide-react';

interface FloatingAIAssistantProps {
  currentDestination: string;
  onSelectDestination?: (name: string) => void;
  setActiveTab?: (tab: any) => void;
}

export default function FloatingAIAssistant({ currentDestination, onSelectDestination, setActiveTab }: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I'm your mini TourNex Copilot. Let me know if you need any instant translations, local emergency numbers, safety indices, or quick route insights for ${currentDestination}!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside pop-up chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const query = text.toLowerCase();
      let responseText = '';

      if (query.includes('translate') || query.includes('how to say') || query.includes('language')) {
        responseText = `Sure! In Indian tourist hubs, people speak several languages. You can say:\n• "Thank you" -> "Dan-ya-vaad" (Hindi) or "Nandri" (Tamil)\n• "How much?" -> "Kitne ka hai?" (Hindi) or "Idhu evvalavu?" (Tamil)\n\nYou can access our advanced 'Translate Helper' inside the AI Planner tab for audio feedback pronunciation loops!`;
      } else if (query.includes('safety') || query.includes('safe') || query.includes('emergency') || query.includes('cop') || query.includes('police')) {
        responseText = `TourNex Safety Intelligence Report for ${currentDestination}:\n✔ Tourist Helpline: Call 1363 (24/7 National Tourism Multilingual Help line)\n✔ Emergency Police response line: Call 112\n✔ Recommendation: Always travel in officially licensed local e-rickshaws or prepaid taxis, and preserve virtual copies of booking papers.`;
      } else if (query.includes('food') || query.includes('eat') || query.includes('restaurant') || query.includes('review')) {
        responseText = `Fantastic food awaits near ${currentDestination}! Popular choices:\n• Rawat Mishtan Bhandar (Agra/Jaipur famous sweetmeats and kachori)\n• Backwaters Palms Diner (Alleppey style slow-grilled lake fish)\n\nVisit our 'AI Planner' tab sidebar for full client food review feeds with precise star tags!`;
      } else {
        responseText = `I've logged your request: "${text}". As your TourNex Copilot, I suggest checking our 'AI Planner' or 'Gateway Finder' tabs for map coordinates, group billing splits, and regional guides directories!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant' as const,
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (optionText: string) => {
    handleSend(optionText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="floating-ai-assistant">
      
      {/* Mini Chat Box */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[450px] animate-slide-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xs leading-none">TourNex Copilot</h3>
                <span className="text-[9px] font-mono text-blue-100 uppercase tracking-widest mt-1 block">Live AI Helper</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Context Bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-medium">Inside context: <strong className="text-slate-800">{currentDestination}</strong></span>
            <span className="text-emerald-600 font-mono font-bold uppercase flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Synchronized
            </span>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div key={msg.id} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-xs ${
                    isAssistant 
                      ? 'bg-white text-slate-800 border border-slate-150' 
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span className={`block text-[8px] text-right mt-1 leading-none ${isAssistant ? 'text-slate-400' : 'text-blue-200'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-150 rounded-2xl px-3 py-2 flex items-center space-x-1">
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Triggers list */}
          <div className="p-2 bg-white border-t border-slate-100 flex flex-wrap gap-1 items-center max-h-24 overflow-y-auto">
            <button 
              onClick={() => handleOptionClick("Translate help phrases")}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-700 px-2 py-1 flex items-center gap-1 transition"
            >
              <Languages className="h-3 w-3 text-blue-500" />
              <span>Translation phrases</span>
            </button>
            <button 
              onClick={() => handleOptionClick(`Get local food suggestion for ${currentDestination}`)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-700 px-2 py-1 flex items-center gap-1 transition"
            >
              <Compass className="h-3 w-3 text-orange-500" />
              <span>Food options</span>
            </button>
            <button 
              onClick={() => handleOptionClick(`Display safety emergency line for ${currentDestination}`)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-700 px-2 py-1 flex items-center gap-1 transition"
            >
              <ShieldAlert className="h-3 w-3 text-red-500" />
              <span>Safety Line</span>
            </button>
          </div>

          {/* Input field */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="p-3 bg-white border-t border-slate-150 flex gap-2"
          >
            <input 
              type="text" 
              placeholder="Ask Copilot..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2 disabled:bg-slate-100 disabled:text-slate-400 transition"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      )}

      {/* Pulsing Toggle Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95 group relative border-2 border-white"
        title="Open TourNex Copilot"
      >
        <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
        {isOpen ? (
          <X className="h-6 w-6 text-white group-hover:rotate-90 transition duration-300" />
        ) : (
          <div className="relative">
            <Bot className="h-6 w-6 text-white group-hover:scale-110 transition duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </div>
        )}
      </button>

    </div>
  );
}
