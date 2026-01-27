import React, { useState, useEffect } from 'react';
import { Activity, ChevronRight } from 'lucide-react';

const BMIWidget = () => {
  // CONSTANTS FROM PRD/USER PROFILE
  const HEIGHT_CM = 162;
  const BIRTH_DATE = new Date('2004-11-19');

  // Calculate Age Dynamically
  const calculateAge = (dob) => {
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };
  const age = calculateAge(BIRTH_DATE);

  // State
  const [weight, setWeight] = useState(60); // Default placeholder
  const [bmi, setBmi] = useState(0);
  const [status, setStatus] = useState({ label: 'Normal', color: 'bg-emerald-500', text: 'text-emerald-600' });

  useEffect(() => {
    // Formula: weight (kg) / [height (m)]^2
    const heightInMeters = HEIGHT_CM / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    // Determine Category & Color
    if (bmiValue < 18.5) {
      setStatus({ label: 'Underweight', color: 'bg-sky-400', text: 'text-sky-600' });
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setStatus({ label: 'Healthy Weight', color: 'bg-emerald-500', text: 'text-emerald-600' });
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setStatus({ label: 'Overweight', color: 'bg-orange-400', text: 'text-orange-600' });
    } else {
      setStatus({ label: 'Obese', color: 'bg-red-500', text: 'text-red-600' });
    }
  }, [weight]);

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex justify-between items-start mb-2">
         <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Health Index</p>
            <h3 className="text-sm font-semibold text-slate-700">Body Mass Index</h3>
         </div>
         <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-slate-100 ${status.text} bg-slate-50`}>
           {status.label}
         </div>
      </div>

      {/* The Hero BMI Number */}
      <div className="flex items-end gap-1 mt-2 mb-4">
        <span className={`text-5xl font-light tracking-tighter ${status.text}`}>
          {bmi}
        </span>
        <span className="text-xs text-slate-400 font-mono mb-2">kg/m²</span>
      </div>

      {/* Weight Input Area */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500 font-medium">Today's Weight</span>
        <div className="flex items-center gap-1">
          <input 
            type="number" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-sm font-mono text-slate-700 focus:outline-none focus:border-sky-500 transition-colors"
          />
          <span className="text-[10px] text-slate-400 font-bold">KG</span>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-3">
         <div>HEIGHT: <span className="text-slate-600">{HEIGHT_CM}cm</span></div>
         <div className="text-right">AGE: <span className="text-slate-600">{age}</span></div>
      </div>

      {/* Visual Gauge Bar at very bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex">
        <div className={`h-full transition-all duration-500 ${status.color}`} style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }} />
        <div className="h-full bg-slate-100 flex-1" />
      </div>
    </div>
  );
};

export default BMIWidget;