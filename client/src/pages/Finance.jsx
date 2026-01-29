import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Minus, 
  DollarSign, Calendar, CreditCard, ArrowUpRight, ArrowDownRight, Trash2, X, Clock 
} from 'lucide-react';
import { api } from '../api'; // <-- Now using your centralized API
import { format, isSameDay, isSameWeek, parseISO } from 'date-fns';

const Finance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income'); // 'income' or 'expense'
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Categories Config
  const INCOME_CATEGORIES = ['Allowance', 'Freelance', 'Gift', 'Salary', 'Other'];
  const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Games', 'Subscriptions', 'Other'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await api.fetchFinanceRecords();
    if (data) setLogs(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!amount || !category) return;
    
    // Call API to save to Supabase
    const { data, error } = await api.addFinanceRecord({
      type: modalType,
      amount: parseFloat(amount),
      category,
      description,
      date
    });

    if (!error && data) {
      setLogs([data[0], ...logs]);
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await api.deleteFinanceRecord(id);
    if (!error) {
      setLogs(logs.filter(log => log.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount("");
    setCategory("");
    setDescription("");
  };

  const openModal = (type) => {
    setModalType(type);
    setCategory(type === 'income' ? 'Allowance' : 'Food'); // Defaults
    setIsModalOpen(true);
  };

  // --- FINANCIAL ENGINE CALCULATIONS ---
  const calculateStats = () => {
    const today = new Date();
    
    let totalBalance = 0;
    let incomeToday = 0;
    let expenseToday = 0;
    let expenseWeek = 0;

    logs.forEach(log => {
      const logDate = parseISO(log.date);
      const val = parseFloat(log.amount);

      // 1. Net Balance (All Time)
      if (log.type === 'income') totalBalance += val;
      else totalBalance -= val;

      // 2. Today's Stats
      if (isSameDay(logDate, today)) {
        if (log.type === 'income') incomeToday += val;
        else expenseToday += val;
      }

      // 3. Weekly Expense (Mon-Sun)
      if (log.type === 'expense' && isSameWeek(logDate, today, { weekStartsOn: 1 })) {
        expenseWeek += val;
      }
    });

    return { totalBalance, incomeToday, expenseToday, expenseWeek };
  };

  const stats = calculateStats();

  return (
    <div className="p-8 h-screen overflow-y-auto custom-scrollbar pb-24">
      
      {/* HEADER & BALANCE CARD */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-text-main tracking-tight mb-6">Financial Command</h1>
        
        {/* Main Wallet Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <CreditCard size={150} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Net Available Balance</p>
              <h2 className="text-5xl md:text-6xl font-bold font-mono tracking-tighter">
                ₱{stats.totalBalance.toLocaleString()}
              </h2>
            </div>
            
            <div className="flex gap-3">
               <button 
                 onClick={() => openModal('income')}
                 className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
               >
                 <ArrowUpRight size={20} /> Add Income
               </button>
               <button 
                 onClick={() => openModal('expense')}
                 className="flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-900/20 active:scale-95"
               >
                 <ArrowDownRight size={20} /> Add Expense
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY & WEEKLY ANALYTICS */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Spend */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><TrendingDown size={20}/></div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Today's Burn</span>
          </div>
          <p className="text-2xl font-bold text-text-main">₱{stats.expenseToday.toLocaleString()}</p>
        </div>

        {/* Weekly Spend */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Calendar size={20}/></div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Weekly Burn</span>
          </div>
          <p className="text-2xl font-bold text-text-main">₱{stats.expenseWeek.toLocaleString()}</p>
        </div>

        {/* Today's Income */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><TrendingUp size={20}/></div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Income Today</span>
          </div>
          <p className="text-2xl font-bold text-text-main">₱{stats.incomeToday.toLocaleString()}</p>
        </div>
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="max-w-5xl mx-auto bg-surface border border-border rounded-3xl overflow-hidden shadow-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-text-main">Transaction Ledger</h3>
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-text-muted">Syncing with bank...</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-text-muted">No transactions found. Start logging!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-highlight text-xs font-bold text-text-muted uppercase tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-highlight/50 transition-colors group">
                    <td className="p-4 text-text-main text-sm font-medium whitespace-nowrap">
                      {format(parseISO(log.date), 'MMM d, yyyy')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                        log.type === 'income' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted text-sm">{log.description || '-'}</td>
                    <td className={`p-4 text-right font-mono font-bold ${
                      log.type === 'income' ? 'text-emerald-500' : 'text-text-main'
                    }`}>
                      {log.type === 'income' ? '+' : '-'} ₱{log.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                       <button onClick={() => handleDelete(log.id)} className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DYNAMIC TRANSACTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className={`p-6 border-b border-border flex justify-between items-center ${
              modalType === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
            }`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${
                modalType === 'income' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {modalType === 'income' ? <ArrowUpRight size={20}/> : <ArrowDownRight size={20}/>}
                Add {modalType === 'income' ? 'Income' : 'Expense'}
              </h3>
              <button onClick={closeModal} className="text-text-muted hover:text-text-main"><X size={20}/></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₱</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-background border border-border rounded-xl pl-8 p-3 text-text-main focus:outline-none focus:border-primary font-mono font-bold text-lg"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {(modalType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        category === cat 
                          ? 'bg-primary text-white border-primary shadow-md' 
                          : 'bg-background text-text-muted border-border hover:border-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Description</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. McDo"
                    className="w-full bg-background border border-border rounded-xl p-3 text-text-main text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-3 text-text-main text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-highlight border-t border-border flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 text-text-muted font-bold hover:bg-border rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={handleSave} 
                className={`px-6 py-2.5 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 ${
                  modalType === 'income' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                    : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                }`}
              >
                Confirm Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;