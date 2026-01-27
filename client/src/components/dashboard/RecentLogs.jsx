import React from 'react';
import { Hash } from 'lucide-react';

const LogItem = ({ time, activity, tag }) => (
  <div className="flex gap-4 items-start group">
    <div className="min-w-[40px] text-right">
      <span className="text-[10px] font-mono text-slate-400 group-hover:text-sky-600 transition-colors">{time}</span>
    </div>
    <div className="relative pb-4 border-l border-slate-200 pl-4 last:border-0 last:pb-0">
      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-300 group-hover:border-sky-500 group-hover:bg-sky-500 transition-colors" />
      <p className="text-xs text-slate-700 font-medium leading-tight mb-1">{activity}</p>
      <span className="text-[9px] uppercase tracking-wider text-slate-500 border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded">{tag}</span>
    </div>
  </div>
);

const RecentLogs = () => (
  <div className="bg-white border border-slate-200/60 rounded-3xl p-0 flex flex-col overflow-hidden h-[400px] shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
        <Hash size={14} className="text-emerald-500" />
        Recent Logs
      </h3>
      <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">LIVE FEED</span>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      <LogItem time="09:30" activity="Starting React Light Mode" tag="Dev" />
      <LogItem time="08:15" activity="Breakfast: Pandesal & Coffee" tag="Meals" />
      <LogItem time="07:00" activity="Woke up" tag="Sleep" />
      <LogItem time="00:30" activity="Late night debugging" tag="Dev" />
    </div>
  </div>
);

export default RecentLogs;