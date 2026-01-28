import React, { useState } from 'react';

// Define constants outside the component so they aren't re-created on every render
const HEIGHT_CM = 162;
const HEIGHT_M = HEIGHT_CM / 100;
const BIRTH_DATE = new Date('2004-11-19');

const BMIWidget = () => {
  const [weight, setWeight] = useState(60);

  // 1. DERIVED STATE (The "Google Way")
  // No useEffect needed. Just calculate it right here.
  const bmi = (weight / (HEIGHT_M * HEIGHT_M)).toFixed(1);
  const age = Math.abs(new Date(Date.now() - BIRTH_DATE.getTime()).getUTCFullYear() - 1970);

  // 2. Status Helper
  const getStatus = (value) => {
    if (value < 18.5) return { label: 'Underweight', color: 'bg-sky-400', text: 'text-sky-600' };
    if (value < 24.9) return { label: 'Healthy', color: 'bg-emerald-500', text: 'text-emerald-600' };
    if (value < 29.9) return { label: 'Overweight', color: 'bg-orange-400', text: 'text-orange-600' };
    return { label: 'Obese', color: 'bg-red-500', text: 'text-red-600' };
  };

  const status = getStatus(bmi);
  const progress = Math.min((bmi / 40) * 100, 100);

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
         <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Health Index</p>
            <h3 className="text-sm font-semibold text-slate-700">Body Mass Index</h3>
         </div>
         <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-slate-100 ${status.text} bg-slate-50`}>
           {status.label}
         </div>
      </div>

      {/* Main Number */}
      <div className="flex items-end gap-1 mt-2 mb-4">
        <span className={`text-5xl font-light tracking-tighter ${status.text}`}>{bmi}</span>
        <span className="text-xs text-slate-400 font-mono mb-2">kg/m²</span>
      </div>

      {/* Input */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500 font-medium">Today's Weight</span>
        <div className="flex items-center gap-1">
          <input 
            type="number" 
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-sm font-mono text-slate-700 focus:outline-none focus:border-sky-500 transition-colors"
          />
          <span className="text-[10px] text-slate-400 font-bold">KG</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-3">
         <div>HEIGHT: <span className="text-slate-600">{HEIGHT_CM}cm</span></div>
         <div className="text-right">AGE: <span className="text-slate-600">{age}</span></div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex">
        <div className={`h-full transition-all duration-500 ${status.color}`} style={{ width: `${progress}%` }} />
        <div className="h-full bg-slate-100 flex-1" />
      </div>
    </div>
  );
};

export default BMIWidget;