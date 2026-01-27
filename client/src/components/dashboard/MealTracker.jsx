import React from 'react';
import { Utensils, Flame, PlusCircle } from 'lucide-react';

const MealTracker = () => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Calories</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-mono text-slate-800">1,250</h2>
            <span className="text-xs text-slate-400 font-mono">/ 2,200 kcal</span>
          </div>
        </div>
        <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
          <Flame size={20} />
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
             <span className="text-slate-600">Breakfast</span>
           </div>
           <span className="font-mono text-slate-400">450</span>
        </div>
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
             <span className="text-slate-600">Lunch (Adobo)</span>
           </div>
           <span className="font-mono text-slate-400">800</span>
        </div>
        
        <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors">
          <PlusCircle size={14} />
          Add Meal
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-orange-400 w-[56%]" />
        </div>
      </div>
    </div>
  );
};

export default MealTracker;