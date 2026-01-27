import React from 'react';
import { Moon } from 'lucide-react';

const SleepTracker = () => (
  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl" />
    
    <div className="flex justify-between items-start z-10">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Last Night's Sleep</p>
        <h2 className="text-3xl font-mono text-slate-800">6h 42m</h2>
      </div>
      <div className="bg-indigo-50 p-2 rounded-lg text-indigo-500">
        <Moon size={20} />
      </div>
    </div>

    <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
      <div className="h-full bg-indigo-500 w-[75%]" />
    </div>
    <p className="text-right text-[10px] text-indigo-500 mt-2 font-mono font-bold">75% of 8h Goal</p>
  </div>
);

export default SleepTracker;