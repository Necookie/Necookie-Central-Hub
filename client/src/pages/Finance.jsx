import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Trash2, X, CreditCard, TrendingUp, TrendingDown, Calendar 
} from 'lucide-react';
import { api } from '../api';
import { format, isSameDay, isSameWeek, parseISO } from 'date-fns';

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================
const CATEGORIES = {
  INCOME: ['Allowance', 'Freelance', 'Gift', 'Salary', 'Other'],
  EXPENSE: ['Food', 'Transport', 'Shopping', 'Games', 'Subscriptions', 'Other']
};

// ==========================================
// 2. CUSTOM HOOK (Business Logic Layer)
// ==========================================
const useFinance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const data = await api.fetchFinanceRecords();
        if (mounted && data) setLogs(data);
      } catch (err) {
        console.error("Failed to load finance records", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // CRUD Actions
  const addTransaction = async (payload) => {
    const { data, error } = await api.addFinanceRecord(payload);
    if (!error && data) {
      setLogs(prevLogs => [data[0], ...prevLogs]);
      return true;
    }
    return false;
  };

  const deleteTransaction = async (id) => {
    const { error } = await api.deleteFinanceRecord(id);
    if (!error) {
      setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    }
  };

  /**
   * Memoized Stats Calculation
   * Complexity: O(n) - Iterates logs once.
   * Optimization: Only runs when 'logs' dependency changes.
   */
  const stats = useMemo(() => {
    const today = new Date();
    let acc = {
      totalBalance: 0,
      incomeToday: 0,
      expenseToday: 0,
      expenseWeek: 0
    };

    logs.forEach(log => {
      const val = parseFloat(log.amount);
      const logDate = parseISO(log.date);

      // 1. Net Balance
      if (log.type === 'income') acc.totalBalance += val;
      else acc.totalBalance -= val;

      // 2. Today's Stats
      if (isSameDay(logDate, today)) {
        if (log.type === 'income') acc.incomeToday += val;
        else acc.expenseToday += val;
      }

      // 3. Weekly Stats (Mon-Sun)
      if (log.type === 'expense' && isSameWeek(logDate, today, { weekStartsOn: 1 })) {
        acc.expenseWeek += val;
      }
    });

    return acc;
  }, [logs]);

  return { logs, loading, stats, addTransaction, deleteTransaction };
};

// ==========================================
// 3. SUB-COMPONENTS (Presentation Layer)
// ==========================================

const StatCards = ({ stats, onOpenModal }) => (
  <>
    {/* MAIN BALANCE CARD */}
    <div className="max-w-5xl mx-auto mb-8">
      <h1 className="text-3xl font-bold text-text-main tracking-tight mb-6">Financial Command</h1>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-slate-700">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
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
            <ActionButton 
              icon={<ArrowUpRight size={20} />} 
              label="Add Income" 
              colorClass="bg-emerald-500 hover:bg-emerald-400 shadow-emerald-900/20" 
              onClick={() => onOpenModal('income')} 
            />
            <ActionButton 
              icon={<ArrowDownRight size={20} />} 
              label="Add Expense" 
              colorClass="bg-rose-500 hover:bg-rose-400 shadow-rose-900/20" 
              onClick={() => onOpenModal('expense')} 
            />
          </div>
        </div>
      </div>
    </div>

    {/* ANALYTICS GRID */}
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MiniStatCard 
        label="Today's Burn" 
        amount={stats.expenseToday} 
        icon={<TrendingDown size={20}/>} 
        color="rose" 
      />
      <MiniStatCard 
        label="Weekly Burn" 
        amount={stats.expenseWeek} 
        icon={<Calendar size={20}/>} 
        color="orange" 
      />
      <MiniStatCard 
        label="Income Today" 
        amount={stats.incomeToday} 
        icon={<TrendingUp size={20}/>} 
        color="emerald" 
      />
    </div>
  </>
);

const TransactionTable = ({ logs, loading, onDelete }) => (
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
                  <CategoryBadge type={log.type} category={log.category} />
                </td>
                <td className="p-4 text-text-muted text-sm">{log.description || '-'}</td>
                <td className={`p-4 text-right font-mono font-bold ${
                  log.type === 'income' ? 'text-emerald-500' : 'text-text-main'
                }`}>
                  {log.type === 'income' ? '+' : '-'} ₱{log.amount.toLocaleString()}
                </td>
                <td className="p-4 text-right">
                    <button onClick={() => onDelete(log.id)} className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
);

const TransactionModal = ({ isOpen, type, onClose, onConfirm }) => {
  // Isolate form state here to prevent parent re-renders
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Reset or Set Defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: type === 'income' ? 'Allowance' : 'Food'
      });
    }
  }, [isOpen, type]);

  const handleSubmit = () => {
    if (!formData.amount || !formData.category) return;
    onConfirm({
      type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    });
  };

  if (!isOpen) return null;

  const categories = type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE;
  const colorTheme = type === 'income' ? 'emerald' : 'rose';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* HEADER */}
        <div className={`p-6 border-b border-border flex justify-between items-center bg-${colorTheme}-500/10`}>
          <h3 className={`text-lg font-bold flex items-center gap-2 text-${colorTheme}-600`}>
            {type === 'income' ? <ArrowUpRight size={20}/> : <ArrowDownRight size={20}/>}
            Add {type === 'income' ? 'Income' : 'Expense'}
          </h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-main"><X size={20}/></button>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₱</span>
              <input 
                type="number" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                className="w-full bg-background border border-border rounded-xl pl-8 p-3 text-text-main focus:outline-none focus:border-primary font-mono font-bold text-lg"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                    formData.category === cat 
                      ? 'bg-primary text-white border-primary shadow-md' 
                      : 'bg-background text-text-muted border-border hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Description</label>
              <input 
                type="text" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="e.g. McDo"
                className="w-full bg-background border border-border rounded-xl p-3 text-text-main text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5">Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-background border border-border rounded-xl p-3 text-text-main text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-surface-highlight border-t border-border flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-text-muted font-bold hover:bg-border rounded-xl transition-colors">Cancel</button>
          <button 
            onClick={handleSubmit} 
            className={`px-6 py-2.5 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 bg-${colorTheme}-500 hover:bg-${colorTheme}-600 shadow-${colorTheme}-500/20`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS (For cleaner JSX) ---

const ActionButton = ({ icon, label, colorClass, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 ${colorClass}`}
  >
    {icon} {label}
  </button>
);

const MiniStatCard = ({ label, amount, icon, color }) => (
  <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 bg-${color}-500/10 rounded-lg text-${color}-500`}>{icon}</div>
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-2xl font-bold text-text-main">₱{amount.toLocaleString()}</p>
  </div>
);

const CategoryBadge = ({ type, category }) => {
  const isIncome = type === 'income';
  const color = isIncome ? 'emerald' : 'rose';
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border bg-${color}-500/10 text-${color}-600 border-${color}-500/20`}>
      {category}
    </span>
  );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
const Finance = () => {
  // Use Custom Hook
  const { logs, loading, stats, addTransaction, deleteTransaction } = useFinance();
  
  // UI State (Modal)
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'income' });

  const openModal = (type) => setModalConfig({ isOpen: true, type });
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const handleConfirmTransaction = async (payload) => {
    const success = await addTransaction(payload);
    if (success) closeModal();
  };

  return (
    <div className="p-8 h-screen overflow-y-auto custom-scrollbar pb-24">
      <StatCards stats={stats} onOpenModal={openModal} />
      
      <TransactionTable 
        logs={logs} 
        loading={loading} 
        onDelete={deleteTransaction} 
      />

      <TransactionModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        onClose={closeModal}
        onConfirm={handleConfirmTransaction}
      />
    </div>
  );
};

export default Finance;