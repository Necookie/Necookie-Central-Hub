import React from 'react';
import { Activity, Play } from 'lucide-react';

const WorkoutCard = () => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full relative overflow-hidden group">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
           <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Exercise</p>
              <h2 className="text-lg font-medium text-slate-800">Jogging</h2>
           </div>
           <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
             <Activity size={20} />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Distance</span>
            <p className="text-xl font-mono text-slate-700">3.2<span className="text-xs text-slate-400 ml-1">km</span></p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Time</span>
            <p className="text-xl font-mono text-slate-700">24<span className="text-xs text-slate-400 ml-1">min</span></p>
          </div>
        </div>

        <button className="mt-4 w-full bg-slate-900 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
          <Play size={12} fill="currentColor" />
          Start Session
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;