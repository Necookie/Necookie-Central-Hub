import React from 'react';
import { Sparkles } from 'lucide-react';

const DashboardHeader = () => (
  <div className="mb-8 flex items-end justify-between">
    <div>
      <h1 className="text-3xl font-light text-slate-800 mb-1">
        Good Morning, <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Dheyn</span>
      </h1>
      <p className="text-slate-500 text-sm font-mono">Wednesday, Jan 28 • 09:30 AM</p>
    </div>
    <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full text-xs transition-all shadow-lg shadow-slate-200">
      <Sparkles size={14} />
      <span>Generate Daily Summary</span>
    </button>
  </div>
);

export default DashboardHeader;