import React, { useState, useMemo } from 'react';
import { Expense, Settlement } from '../types';
import { PlusCircle, Wallet, ArrowRight, User, Trash2, ArrowUpDown, CheckCircle2, Download, RefreshCcw } from 'lucide-react';

interface SplitterViewProps {
  expenses: Expense[];
  onAddExpense: (newExp: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onClearExpenses: () => void;
}

export default function SplitterView({ expenses, onAddExpense, onDeleteExpense, onClearExpenses }: SplitterViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [desc, setDesc] = useState('');
  const [amountVal, setAmountVal] = useState('');
  const [payer, setPayer] = useState('Arjun');
  const [category, setCategory] = useState<'Stay' | 'Food' | 'Activity' | 'Transit' | 'Shopping' | 'Other'>('Food');
  const [splitWith, setSplitWith] = useState<string[]>(['Arjun', 'Priya', 'Sanya', 'Rahul']);
  const [settledAlert, setSettledAlert] = useState(false);

  // Advanced interactive widgets states
  const [customExchangeValue, setCustomExchangeValue] = useState<number>(5000);
  const [targetLimit, setTargetLimit] = useState<number>(50000);

  const membersList = ['Arjun', 'Priya', 'Sanya', 'Rahul'];

  // Categories config
  const catIcons = {
    Stay: '🏨',
    Food: '🍜',
    Activity: '🐫',
    Transit: '🚌',
    Shopping: '🛍️',
    Other: '🎒'
  };

  const catColors = {
    Stay: 'bg-purple-100 text-purple-700 border-purple-200/50',
    Food: 'bg-amber-100 text-amber-700 border-amber-200/50',
    Activity: 'bg-orange-100 text-orange-700 border-orange-200/50',
    Transit: 'bg-blue-100 text-blue-700 border-blue-200/50',
    Shopping: 'bg-pink-100 text-pink-700 border-pink-200/50',
    Other: 'bg-slate-100 text-slate-700 border-slate-250'
  };

  // Compute stats
  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Compute net individual balances (Paid - Owed)
  const individualMetrics = useMemo(() => {
    const paid: { [key: string]: number } = { Arjun: 0, Priya: 0, Sanya: 0, Rahul: 0 };
    const owed: { [key: string]: number } = { Arjun: 0, Priya: 0, Sanya: 0, Rahul: 0 };

    expenses.forEach((exp) => {
      paid[exp.paidBy] += exp.amount;
      const share = exp.amount / exp.splitWith.length;
      exp.splitWith.forEach((p) => {
        owed[p] += share;
      });
    });

    return membersList.map((m) => {
      const net = paid[m] - owed[m];
      return {
        name: m,
        paid: paid[m],
        owed: owed[m],
        net: Number(net.toFixed(2))
      };
    });
  }, [expenses]);

  // Compute smart settlements minimizing the number of transactions
  const settlementsList = useMemo(() => {
    // Clone individual balances
    const balances = individualMetrics.map((m) => ({ name: m.name, net: m.net }));
    
    const debtors = balances.filter((b) => b.net < -0.01).map((b) => ({ ...b }));
    const creditors = balances.filter((b) => b.net > 0.01).map((b) => ({ ...b }));

    // Sort: debtors ascending (most negative first), creditors descending (most positive first)
    debtors.sort((a, b) => a.net - b.net);
    creditors.sort((a, b) => b.net - a.net);

    const transactions: Settlement[] = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      
      const oweAmount = Math.min(-debtor.net, creditor.net);
      if (oweAmount > 0.05) {
        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: Number(oweAmount.toFixed(2))
        });
      }

      debtor.net += oweAmount;
      creditor.net -= oweAmount;

      if (Math.abs(debtor.net) < 0.05) i++;
      if (Math.abs(creditor.net) < 0.05) j++;
    }

    return transactions;
  }, [individualMetrics]);

  const toggleSplitMember = (name: string) => {
    if (splitWith.includes(name)) {
      if (splitWith.length > 1) {
        setSplitWith(splitWith.filter((m) => m !== name));
      }
    } else {
      setSplitWith([...splitWith, name]);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amountVal || isNaN(Number(amountVal)) || Number(amountVal) <= 0) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      description: desc.trim(),
      amount: Number(Number(amountVal).toFixed(2)),
      paidBy: payer,
      splitWith: [...splitWith],
      category,
      date: new Date().toISOString().split('T')[0]
    };

    onAddExpense(newExpense);
    setDesc('');
    setAmountVal('');
    setShowAddForm(false);
  };

  const triggerSettleUp = () => {
    onClearExpenses();
    setSettledAlert(true);
    setTimeout(() => setSettledAlert(false), 5000);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in" id="splitter-view-root">
      
      {/* Dynamic Alert Banner */}
      {settledAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center space-x-2 shadow-sm animate-bounce-once">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-xs leading-none">Balances completely settled up! Itinerary reset to empty sheet.</span>
        </div>
      )}

      {/* Trip Header Budget Splitter Card */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md border border-blue-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="splitter-header">
        <div>
          <span className="bg-blue-400/30 border border-blue-400/40 text-blue-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">Ongoing Group Loop</span>
          <h1 className="font-display font-extrabold text-[#ffffff] text-2xl tracking-tight mt-1.5 leading-none">
            Rajasthan Heritage Trip Splitter
          </h1>
          <p className="text-blue-100/90 text-xs font-semibold mt-1">
            Group Members: Arjun, Priya, Sanya, Rahul
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-right w-full sm:w-auto shrink-0 flex justify-between sm:block">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200 leading-none">Total Group Spends</span>
          <span className="font-display font-black text-xl text-white block mt-1 leading-none sm:text-right">
            ₹{totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </section>

      {/* Split Settlements Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="splitter-content">
        
        {/* Left Area: Smart Settlements & Member Balances */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Settlement Logic Visual Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm" id="settlement-intelligence">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <span className="text-lg leading-none">🧙‍♂️</span>
              <div>
                <h3 className="font-display font-extrabold text-slate-900 text-sm leading-none">AI Settlement Logic</h3>
                <span className="text-slate-400 text-[9px] font-mono leading-none font-bold uppercase mt-1 tracking-wider block">Optimized Transaction Flow</span>
              </div>
            </div>

            {/* Smart Transactions list */}
            <div className="pt-3 space-y-2.5">
              {settlementsList.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 border border-slate-150 rounded-xl" id="no-debt-banner">
                  🎉 Group balance is in perfect equilibrium! No transactions needed.
                </div>
              ) : (
                settlementsList.map((set, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-blue-100 bg-blue-50/45 text-xs shadow-sm shadow-blue-500/5">
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                      <span className="bg-blue-100 text-blue-700 h-6 w-6 rounded-full flex items-center justify-center text-[10px] uppercase">{set.from[0]}</span>
                      <span>{set.from}</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center shrink-0 px-2.5">
                      <span className="text-[10px] text-blue-600 font-extrabold font-mono mb-0.5 leading-none">
                        ₹{set.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    </div>

                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                      <span>{set.to}</span>
                      <span className="bg-emerald-100 text-emerald-700 h-6 w-6 rounded-full flex items-center justify-center text-[10px] uppercase">{set.to[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Member balance limits and tallies */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm" id="member-balance-widget">
            <h3 className="font-display font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Member Balances
            </h3>

            <div className="pt-3.5 space-y-3">
              {individualMetrics.map((met) => {
                const isPositive = met.net >= 0;
                return (
                  <div key={met.name} className="flex items-center justify-between text-xs" id={`member-item-${met.name}`}>
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-center font-bold text-slate-600">
                        {met.name[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block leading-none">{met.name}</span>
                        <span className="text-slate-400 text-[10px] leading-none mt-1 inline-block">Paid ₹{met.paid.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-bold block leading-none ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}₹{met.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5 inline-block leading-none">
                        {isPositive ? 'Gets back' : 'Owes total'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Area: Expenses Feed & Control logs */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-display font-extrabold text-slate-900 text-base">Expense Logs Loop</h3>
            
            <div className="flex gap-2">
              <button 
                onClick={triggerSettleUp}
                className="bg-slate-100 hover:bg-slate-250 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg transition active:scale-95 flex items-center space-x-1"
                title="Settle up entire trip expenses"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Settle Up</span>
              </button>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition active:scale-95 flex items-center space-x-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* New Expense slide down form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-slide-down">
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest block">Record New Group Spend</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] text-slate-500 font-bold mb-1 uppercase">What was this spend for?</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Udaipur Fort Tickets, TukTuk Ride..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={amountVal}
                      onChange={(e) => setAmountVal(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-6 pr-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Payer selection */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Who paid this?</label>
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-semibold text-slate-700"
                  >
                    {membersList.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Category selection */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Expense Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none font-semibold text-slate-700"
                  >
                    <option value="Stay">Stay & Lodging</option>
                    <option value="Food">Food & Drinks</option>
                    <option value="Activity">Activities & Safaris</option>
                    <option value="Transit">Transit & Flights</option>
                    <option value="Shopping">Shopping Goods</option>
                    <option value="Other">Other Expenses</option>
                  </select>
                </div>

                {/* Splits checklist */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-slate-500 font-bold mb-1 uppercase justify-between flex">
                    <span>Split equally with:</span>
                    <span className="text-[9px] font-mono text-slate-400 lowercase italic">{splitWith.length} checked</span>
                  </label>
                  
                  <div className="flex gap-1.5 flex-wrap bg-white border border-slate-200 rounded-xl p-2 h-10 overflow-hidden items-center justify-around">
                    {membersList.map((m) => {
                      const included = splitWith.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleSplitMember(m)}
                          className={`px-1.5 py-0.5 rounded-md font-bold text-[10px] transition ${
                            included 
                              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                              : 'text-slate-400 border border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-white hover:bg-slate-200 text-slate-700 border border-slate-250 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-md"
                >
                  Record Spend
                </button>
              </div>
            </form>
          )}

          {/* Expense feeds feed */}
          <div className="space-y-3" id="expense-logs-feed">
            {expenses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/50">
                <Wallet className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No recorded Group Expenses</h4>
                <p className="text-slate-500 text-xs mt-1">Start plotting transactions above using "Add Expense"!</p>
              </div>
            ) : (
              [...expenses].reverse().map((exp) => (
                <div 
                  key={exp.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-xs transition group"
                  id={`expense-feed-item-${exp.id}`}
                >
                  {/* Category bubble */}
                  <div className={`h-11 w-11 rounded-xl shrink-0 flex items-center justify-center font-bold text-lg border ${catColors[exp.category]}`}>
                    {catIcons[exp.category]}
                  </div>

                  {/* Expense Metadata details */}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-extrabold text-slate-900 text-sm truncate leading-snug">
                        {exp.description}
                      </h4>
                      <span className="font-mono text-slate-900 text-sm font-black pl-2 leading-snug shrink-0">
                        ₹{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-medium gap-2">
                      <p className="truncate leading-none">
                        Paid by <strong className="text-slate-700 font-bold">{exp.paidBy}</strong> • Split with {exp.splitWith.length} people {exp.splitWith.length === membersList.length ? '(Equally)' : ''}
                      </p>
                      
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[9px] font-mono text-slate-400">{exp.date}</span>
                        <button 
                          onClick={() => onDeleteExpense(exp.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 rounded-lg transition"
                          title="Delete Transaction"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Advanced Currency Exchange & Budget Goal Meter widgets */}
      <section className="bg-white border border-slate-200/95 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 text-left" id="splitter-advanced-widgets">
        
        {/* Column 1: Live Interactive Currency Exchange Converter */}
        <div className="space-y-4" id="currency-exchange-converter">
          <div>
            <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-650 px-2.5 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">
              Forex Simulator
            </span>
            <h3 className="font-display font-extrabold text-slate-900 text-base mt-1.5Packed">
              Interactive Multi-Currency Forex Simulator
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Easily convert Group Expenses from Indian Rupees (INR) to popular foreign tourist currencies.
            </p>
          </div>

          {/* Amount Slider input */}
          <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold uppercase font-mono">Convert Size (INR):</span>
              <strong className="text-blue-600 font-mono font-bold text-sm">
                ₹{customExchangeValue.toLocaleString()}
              </strong>
            </div>

            <input 
              type="range"
              min="500"
              max="100000"
              step="500"
              value={customExchangeValue}
              onChange={(e) => setCustomExchangeValue(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹500</span>
              <span>₹50,000</span>
              <span>₹100,000</span>
            </div>
          </div>

          {/* Generated Exchange outputs */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {[
              { code: 'USD', name: 'US Dollars', symbol: '$', rate: 0.012 },
              { code: 'EUR', name: 'Euros', symbol: '€', rate: 0.011 },
              { code: 'GBP', name: 'British Pounds', symbol: '£', rate: 0.0094 },
              { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 1.88 }
            ].map(curr => (
              <div 
                key={curr.code}
                className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {curr.code} ({curr.name})
                  </span>
                  <span className="font-display font-extrabold text-slate-800 text-sm mt-0.5 block">
                    {curr.symbol}{(customExchangeValue * curr.rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                  {curr.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Budget Safety Goal Meter */}
        <div className="space-y-4" id="budget-goal-safety-meter">
          <div>
            <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-650 px-2.5 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">
              Budget Goal Meter
            </span>
            <h3 className="font-display font-extrabold text-slate-900 text-base mt-1.5">
              Live Trip Allocation & Budget Safety Meter
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Compare your collective group expenses against a custom target ceiling threshold to detect budget fatigue.
            </p>
          </div>

          {/* Budget Limit Slider input */}
          <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold uppercase font-mono">Trip Target Budget Limit:</span>
              <strong className="text-emerald-600 font-mono font-bold text-sm">
                ₹{targetLimit.toLocaleString()}
              </strong>
            </div>

            <input 
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={targetLimit}
              onChange={(e) => setTargetLimit(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹10,000</span>
              <span>₹100,000</span>
              <span>₹200,000</span>
            </div>
          </div>

          {/* Progress Bar & alert warnings */}
          {(() => {
            const usagePercent = Math.min(100, Math.round((totalSpend / targetLimit) * 100));
            const isNearLimit = usagePercent >= 75 && usagePercent < 100;
            const isBreached = usagePercent >= 100;

            const progressColor = isBreached 
              ? 'bg-rose-500' 
              : isNearLimit 
              ? 'bg-amber-500' 
              : 'bg-emerald-500';

            const bannerBg = isBreached
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : isNearLimit
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-100 text-emerald-800';

            return (
              <div className="space-y-4">
                {/* Visual meter bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 font-mono">
                    <span>Total Expended: ₹{totalSpend.toLocaleString()}</span>
                    <span>{usagePercent}% utilized</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/40">
                    <div 
                      className={`h-full ${progressColor} transition-all duration-300 rounded-full`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>

                {/* Intelligent feedback banner */}
                <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-[11px] leading-normal ${bannerBg}`}>
                  <span className="text-base">🎒</span>
                  <div>
                    <strong className="font-mono text-[9px] uppercase block font-bold">
                      {isBreached ? '🎯 WARNING: TARGET BUDGET BREACHED!' : isNearLimit ? '⚠️ CAUTION: CEILING LIMIT APPROACHING!' : '✅ HEALTHY BUDGET REGION'}
                    </strong>
                    <p className="mt-0.5">
                      {isBreached 
                        ? 'Your group expenses exceed your pre-set budget limit. Check non-essential Stay or Shopping listings inside the splitter feed to identify saving avenues.'
                        : isNearLimit 
                        ? 'Expenditures are accumulating rapidly, having crossed 75% of your ceiling size. Hold a quick consensus review with Priya, Sanya, and Rahul to split high value dining costs.'
                        : 'Your current spending is perfectly paced inside a sustainable limit. Safe voyages ahead!'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

    </div>
  );
}
