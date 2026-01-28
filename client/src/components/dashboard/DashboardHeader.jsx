import React, { useState, useEffect } from 'react';
import { Bell, Zap, Activity, Utensils, Edit3 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const DashboardHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [detectedType, setDetectedType] = useState('general');

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  const hour = currentDate.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const handleInputChange = (e) => {
    const text = e.target.value;
    setStatus(text);
    const lower = text.toLowerCase();
    
    if (lower.startsWith('ate ') || lower.includes('kcal')) setDetectedType('meal');
    else if (lower.startsWith('ran ') || lower.includes('km') || lower.includes('workout')) setDetectedType('workout');
    else setDetectedType('general');
  };

  const handleLog = async (e) => {
    if (e.key !== 'Enter' || !status.trim()) return;
    setSaving(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    const text = status;

    try {
      if (detectedType === 'meal') {
        const cals = parseInt((text.match(/(\d+)/) || [0])[0]);
        const name = text.replace(/ate/gi, '').replace(/kcal/gi, '').replace(/(\d+)/g, '').trim() || "Quick Meal";
        
        // FIXED: Using 'meal_name'
        await supabase.from('meals').insert([{ 
          user_id: user.id, 
          meal_name: name, 
          calories: cals 
        }]);
      } 
      else if (detectedType === 'workout') {
        const dist = parseFloat((text.match(/(\d+)\s*km/i) || [null, null])[1]);
        const dur = parseInt((text.match(/(\d+)\s*min/i) || [null, 30])[1]);
        const type = text.toLowerCase().includes('run') ? 'Run' : 'Workout';
        
        await supabase.from('workouts').insert([{
          user_id: user.id, activity_type: type, distance_km: dist, duration_minutes: dur, calories: 0 
        }]);
      } 
      else {
        await supabase.from('tasks').insert([{ user_id: user.id, text, is_completed: true }]);
      }

      setStatus("");
      setDetectedType('general');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const InputIcon = () => {
    if (detectedType === 'meal') return <Utensils size={14} className="text-emerald-500" />;
    if (detectedType === 'workout') return <Activity size={14} className="text-orange-500" />;
    return <Edit3 size={14} className="text-slate-400" />;
  };

  return (
    <header className="h-20 border-b border-slate-200/60 bg-white/50 backdrop-blur-md flex items-center justify-between px-6 z-40 sticky top-0 mb-6">
      <div>
        <h1 className="text-xl md:text-2xl font-light text-slate-800">
          {greeting}, <span className="font-bold text-sky-600">Dheyn</span>
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
          {formattedDate} • <span className="text-slate-600 font-bold">{formattedTime}</span>
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl w-96 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all shadow-sm relative">
          <div className="shrink-0 transition-colors duration-300"><InputIcon /></div>
          <input 
            type="text" 
            value={status}
            onChange={handleInputChange}
            onKeyDown={handleLog}
            placeholder="Log anything... (e.g., 'Coding', 'Ate Pizza', 'Ran 5km')" 
            className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder:text-slate-400 font-sans" 
          />
          {saving && <Zap size={14} className="animate-spin text-sky-500 shrink-0" />}
        </div>

        <div className="hidden md:block text-right">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">System Status</p>
          <div className="flex items-center justify-end gap-3">
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-200 text-amber-600 text-[9px] font-bold tracking-tight">v0.1</span>
            <div className="flex items-center gap-1.5">
               <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              <span className="text-xs font-bold text-emerald-600 font-mono">ONLINE</span>
            </div>
          </div>
        </div>

        <button className="relative p-2.5 bg-white border border-slate-100 hover:bg-slate-50 rounded-full transition-all shadow-sm group">
          <Bell size={18} className="text-slate-400 group-hover:text-slate-600" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;