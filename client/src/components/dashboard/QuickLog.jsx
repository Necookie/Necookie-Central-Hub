import React, { useState } from 'react';
import { Send, Activity, Lock, Unlock } from 'lucide-react';

const Badge = ({ text, onClick }) => (
  <span onClick={onClick} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-medium hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 cursor-pointer transition-all">
    {text}
  </span>
);

const QuickLog = () => {
  const [input, setInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className={`bg-white border transition-all duration-300 rounded-3xl p-6 relative group overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full ${
      isPrivate ? 'border-purple-200 shadow-purple-100' : 'border-slate-200/60'
    }`}>
      {/* Background Icon */}
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${isPrivate ? 'text-purple-900' : 'text-slate-900'}`}>
        {isPrivate ? <Lock size={100} /> : <Activity size={100} />}
      </div>

      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isPrivate ? 'text-purple-500' : 'text-slate-400'}`}>
          <div className={`w-2 h-2 rounded-full animate-ping ${isPrivate ? 'bg-purple-500' : 'bg-sky-500'}`} />
          {isPrivate ? 'Private Vault Log' : 'Live Activity Logger'}
        </h3>
        
        {/* PRIVACY TOGGLE */}
        <button 
          onClick={() => setIsPrivate(!isPrivate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
            isPrivate 
              ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {isPrivate ? <Lock size={12} /> : <Unlock size={12} />}
          {isPrivate ? 'Private On' : 'Public'}
        </button>
      </div>
      
      <div className="flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isPrivate ? "Log thoughts securely..." : "What are you doing right now?"} 
          className={`flex-1 bg-slate-50 border rounded-xl px-5 py-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-mono text-sm ${
            isPrivate 
              ? 'border-purple-200 focus:border-purple-500 focus:ring-purple-100' 
              : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'
          }`}
        />
        <button className={`p-4 rounded-xl transition-colors shadow-lg flex items-center justify-center text-white ${
            isPrivate 
              ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-200' 
              : 'bg-sky-600 hover:bg-sky-500 shadow-sky-200'
        }`}>
          <Send size={20} />
        </button>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Badge text="Coding" onClick={() => setInput("Coding ")} />
        <Badge text="Gaming" onClick={() => setInput("Playing MLBB ")} />
        <Badge text="Coffee" onClick={() => setInput("Drinking Coffee ")} />
      </div>
    </div>
  );
};

export default QuickLog;