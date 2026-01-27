import React, { useState } from 'react';
import { Send, Activity } from 'lucide-react';

const Badge = ({ text, onClick }) => (
  <span onClick={onClick} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-medium hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 cursor-pointer transition-all">
    {text}
  </span>
);

const QuickLog = () => {
  const [input, setInput] = useState("");

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 relative group overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity size={100} className="text-slate-900" />
      </div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
        Live Activity Logger
      </h3>
      
      <div className="flex gap-4">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you doing right now?" 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-mono text-sm"
        />
        <button className="bg-sky-600 hover:bg-sky-500 text-white p-4 rounded-xl transition-colors shadow-lg shadow-sky-200 flex items-center justify-center">
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