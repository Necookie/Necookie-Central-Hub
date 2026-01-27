import React, { useState } from 'react';
import { Activity, Play, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const WorkoutCard = () => {
  const [mode, setMode] = useState('view'); // 'view', 'input', 'success'
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const logRun = async () => {
    if (!distance || !duration) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('exercise').insert([{
        user_id: user.id,
        type: 'Jogging',
        distance_km: parseFloat(distance),
        duration_mins: parseInt(duration),
        calories_burned: parseInt(duration) * 8 // Roughly 8 cals per minute of jogging
      }]);

      if (error) throw error;
      
      setMode('success');
      setTimeout(() => {
        setMode('view');
        setDistance("");
        setDuration("");
      }, 2000); // Show success message for 2s
    } catch (error) {
      alert("Error logging run");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full relative overflow-hidden group flex flex-col justify-between">
      {/* Background Decor */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start">
           <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Exercise</p>
              <h2 className="text-lg font-medium text-slate-800">Jogging</h2>
           </div>
           <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
             <Activity size={20} />
           </div>
        </div>

        {mode === 'view' && (
          <div className="mt-4">
             <p className="text-xs text-slate-500 mb-4">Ready to hit the road?</p>
             <button 
               onClick={() => setMode('input')}
               className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
             >
               <Play size={12} fill="currentColor" />
               Log Session
             </button>
          </div>
        )}

        {mode === 'input' && (
          <div className="mt-2 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">KM</label>
                <input 
                  type="number" 
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-mono"
                  placeholder="3.5"
                />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">MINS</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-mono"
                  placeholder="30"
                />
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setMode('view')} className="flex-1 py-2 text-xs text-slate-400 hover:text-slate-600">Cancel</button>
               <button 
                 onClick={logRun}
                 disabled={loading}
                 className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
               >
                 <Save size={14} />
                 Save
               </button>
            </div>
          </div>
        )}

        {mode === 'success' && (
          <div className="mt-6 flex flex-col items-center text-emerald-600 animate-pulse">
            <CheckCircle size={32} />
            <span className="text-xs font-bold mt-2">Run Logged!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;