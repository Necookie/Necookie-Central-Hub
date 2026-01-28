import React, { useState, useEffect } from 'react';
import { Bell, Zap, Activity, Utensils, CheckCircle2, Send } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const DashboardHeader = () => {
  // --- CLOCK & GREETING STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const hour = currentDate.getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  if (hour >= 18) greeting = "Good Evening";

  // --- SMART INPUT STATE ---
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [detectedType, setDetectedType] = useState('task'); // 'task', 'meal', 'workout'

  // Simple "AI" to detect what you are typing
  const detectType = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('ate') || lower.includes('drink') || lower.includes('kcal') || lower.includes('food')) return 'meal';
    if (lower.includes('run') || lower.includes('walk') || lower.includes('gym') || lower.includes('workout') || lower.includes('lift')) return 'workout';
    return 'task';
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setStatus(text);
    setDetectedType(detectType(text));
  };

  const handleSmartLog = async (e) => {
    if (e.key !== 'Enter' || !status.trim()) return;
    
    setSaving(true);
    const text = status;
    const lower = text.toLowerCase();
    const { data: { user } } = await supabase.auth.getUser();

    try {
      // STRATEGY 1: LOGGING FOOD
      // Input: "Ate Adobo 500" -> Name: "Adobo", Cals: 500
      if (detectedType === 'meal') {
        const caloriesMatch = text.match(/(\d+)/); // Find first number
        const calories = caloriesMatch ? parseInt(caloriesMatch[0]) : 0;
        
        // Remove keywords and numbers to get the food name
        let cleanName = text
          .replace(/ate/gi, '')
          .replace(/kcal/gi, '')
          .replace(/calories/gi, '')
          .replace(/(\d+)/g, '') // Remove numbers
          .trim();
          
        if (!cleanName) cleanName = "Quick Meal";

        await supabase.from('meals').insert([{
          user_id: user.id,
          name: cleanName,
          calories: calories
        }]);
      }

      // STRATEGY 2: LOGGING WORKOUTS
      // Input: "Ran 5km" -> Type: "Run", Dist: 5
      else if (detectedType === 'workout') {
        const distanceMatch = text.match(/(\d+)\s*km/i);
        const durationMatch = text.match(/(\d+)\s*min/i);
        
        let type = 'Workout';
        if (lower.includes('run')) type = 'Run';
        else if (lower.includes('walk')) type = 'Walk';
        else if (lower.includes('lift') || lower.includes('gym')) type = 'Weightlifting';
        else if (lower.includes('swim')) type = 'Swim';

        await supabase.from('workouts').insert([{
          user_id: user.id,
          activity_type: type,
          distance_km: distanceMatch ? parseFloat(distanceMatch[1]) : null,
          duration_minutes: durationMatch ? parseInt(durationMatch[1]) : 30, // Default 30m
          calories: 0 
        }]);
      }

      // STRATEGY 3: GENERIC TASKS
      else {
        await supabase.from('tasks').insert([{ 
          user_id: user.id, 
          text: text, 
          is_completed: true 
        }]);
      }

      // Reset
      setStatus("");
      setDetectedType('task');

    } catch (error) {
      console.error("Log error:", error);
    } finally {
      setSaving(false);
    }
  };

  // Icon switcher for visual feedback
  const TypeIcon = () => {
    if (detectedType === 'meal') return <Utensils size={14} className="text-emerald-500" />;
    if (detectedType === 'workout') return <Activity size={14} className="text-orange-500" />;
    return <CheckCircle2 size={14} className="text-slate-400" />;
  };

  return (
    <header className="h-20 border-b border-slate-200/60 bg-white/50 backdrop-blur-md flex items-center justify-between px-6 z-40 sticky top-0 mb-6">
      
      {/* LEFT: Greeting & Time */}
      <div>
        <h1 className="text-xl md:text-2xl font-light text-slate-800">
          {greeting}, <span className="font-bold text-sky-600">Dheyn</span>
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
          {formattedDate} • <span className="text-slate-600 font-bold">{formattedTime}</span>
        </p>
      </div>

      {/* RIGHT: Input, Status & Notifications */}
      <div className="flex items-center gap-6">
        
        {/* --- THE SMART INPUT BAR --- */}
        <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl w-80 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all shadow-sm relative">
          <div className="shrink-0 transition-colors duration-300">
             <TypeIcon />
          </div>
          <input 
            type="text" 
            value={status}
            onChange={handleInputChange}
            onKeyDown={handleSmartLog}
            placeholder={detectedType === 'meal' ? "e.g. Ate Adobo 600" : detectedType === 'workout' ? "e.g. Ran 5km" : "What are you doing?"}
            className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder:text-slate-400 font-sans" 
          />
          {saving && <Zap size={14} className="animate-spin text-sky-500 shrink-0" />}
        </div>

        {/* System Status */}
        <div className="hidden md:block text-right">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">System Status</p>
          <div className="flex items-center justify-end gap-3">
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-200 text-amber-600 text-[9px] font-bold tracking-tight">
              ALPHA v0.1
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                 <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <span className="text-xs font-bold text-emerald-600 font-mono">ONLINE</span>
            </div>
          </div>
        </div>

        <button className="relative p-2.5 bg-white border border-slate-100 hover:bg-slate-50 hover:border-slate-200 rounded-full transition-all shadow-sm group">
          <Bell size={18} className="text-slate-400 group-hover:text-slate-600" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;