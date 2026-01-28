import React, { useState, useEffect } from 'react';
import { Moon, Sun, BarChart2, Clock, History, ArrowLeft } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, startOfDay, isSameDay, parseISO } from 'date-fns';

const SleepTracker = () => {
  const [view, setView] = useState('tracker'); // 'tracker' or 'trends'
  const [loading, setLoading] = useState(true);
  
  // Tracker State
  const [isSleeping, setIsSleeping] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [bedTime, setBedTime] = useState(null);
  const [elapsed, setElapsed] = useState("0h 0m");
  
  // Data State
  const [lastSleep, setLastSleep] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [averageSleep, setAverageSleep] = useState(0);

  const SOL_DEDUCTION_MINUTES = 15; 

  useEffect(() => {
    fetchSleepData();
    const interval = setInterval(updateElapsedTimer, 60000);
    return () => clearInterval(interval);
  }, [isSleeping, bedTime]);

  const updateElapsedTimer = () => {
    if (isSleeping && bedTime) {
      const diffMs = new Date() - new Date(bedTime);
      const diffMins = Math.floor(diffMs / 60000);
      setElapsed(`${Math.floor(diffMins/60)}h ${diffMins%60}m`);
    }
  };

  const fetchSleepData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Check Active Session
      const { data: active } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .is('wake_time', null)
        .maybeSingle();

      if (active) {
        setIsSleeping(true);
        setCurrentSessionId(active.id);
        setBedTime(active.bed_time);
        // Instant timer update
        const diffMs = new Date() - new Date(active.bed_time);
        const diffMins = Math.floor(diffMs / 60000);
        setElapsed(`${Math.floor(diffMins/60)}h ${diffMins%60}m`);
      }

      // 2. Fetch History (Last 7 Days)
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { data: history } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('bed_time', sevenDaysAgo)
        .not('wake_time', 'is', null)
        .order('bed_time', { ascending: true });

      // 3. Process Data for Chart
      processChartData(history || []);
      
      // 4. Set Last Sleep
      if (history && history.length > 0) {
        setLastSleep(history[history.length - 1]);
      }

    } catch (error) {
      console.error('Error fetching sleep:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (logs) => {
    // Generate empty last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return {
        date: d,
        dayName: format(d, 'EEE'), // "Mon", "Tue"
        minutes: 0,
        hours: 0,
        fullDate: format(d, 'MMM d')
      };
    });

    // Fill with actual data
    logs.forEach(log => {
      const logDate = parseISO(log.bed_time);
      const dayEntry = last7Days.find(d => isSameDay(d.date, logDate));
      if (dayEntry) {
        // Add duration (in case of multiple naps, we sum them)
        dayEntry.minutes += log.duration_minutes || 0;
      }
    });

    // Convert minutes to hours for the chart
    const finalData = last7Days.map(d => ({
      ...d,
      hours: parseFloat((d.minutes / 60).toFixed(1))
    }));

    setWeeklyData(finalData);

    // Calculate Average
    const totalMins = finalData.reduce((acc, curr) => acc + curr.minutes, 0);
    const daysWithData = finalData.filter(d => d.minutes > 0).length || 1;
    setAverageSleep(Math.round(totalMins / daysWithData / 60 * 10) / 10); // Round to 1 decimal
  };

  const handleStartSleep = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('sleep_logs')
      .insert([{ user_id: user.id, bed_time: now }])
      .select();

    if (!error) {
      setIsSleeping(true);
      setCurrentSessionId(data[0].id);
      setBedTime(now);
      setElapsed("0h 0m");
    }
  };

  const handleWakeUp = async () => {
    if (!currentSessionId) return;
    const wakeTime = new Date();
    const start = new Date(bedTime);
    let durationMins = Math.floor((wakeTime - start) / 60000);

    // Research logic: Deduct latency if sleep > 20m
    if (durationMins > 20) durationMins -= SOL_DEDUCTION_MINUTES;

    await supabase
      .from('sleep_logs')
      .update({ wake_time: wakeTime.toISOString(), duration_minutes: durationMins })
      .eq('id', currentSessionId);

    setIsSleeping(false);
    setCurrentSessionId(null);
    setBedTime(null);
    fetchSleepData(); // Refresh chart
  };

  // --- RENDERING ---

  if (loading) return <div className="h-full bg-white rounded-3xl animate-pulse" />;

  return (
    <div className={`relative h-full border rounded-3xl p-6 transition-all duration-500 overflow-hidden flex flex-col justify-between
      ${isSleeping ? 'bg-indigo-900 border-indigo-800' : 'bg-white border-slate-200/60 shadow-sm'}`}>

      {/* HEADER */}
      <div className="flex justify-between items-start z-10 relative">
        <div>
          {view === 'tracker' ? (
             <>
               <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isSleeping ? 'text-indigo-300' : 'text-slate-400'}`}>
                 {isSleeping ? 'Currently Sleeping' : "Last Night's Sleep"}
               </p>
               {isSleeping ? (
                 <h2 className="text-4xl font-mono text-white tracking-tighter mt-1">{elapsed}</h2>
               ) : (
                 <h2 className="text-3xl font-light text-slate-800 tracking-tight flex items-baseline gap-2">
                   {Math.floor((lastSleep?.duration_minutes || 0) / 60)}<span className="text-sm font-bold text-slate-400">h</span>
                   {(lastSleep?.duration_minutes || 0) % 60}<span className="text-sm font-bold text-slate-400">m</span>
                 </h2>
               )}
             </>
          ) : (
             <>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Weekly Average</p>
               <h2 className="text-3xl font-light text-slate-800 tracking-tight">
                 {averageSleep}<span className="text-sm font-bold text-slate-400">h / night</span>
               </h2>
             </>
          )}
        </div>

        {/* View Switcher Button */}
        {!isSleeping && (
          <button 
            onClick={() => setView(view === 'tracker' ? 'trends' : 'tracker')}
            className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
          >
            {view === 'tracker' ? <BarChart2 size={18} /> : <ArrowLeft size={18} />}
          </button>
        )}
      </div>

      {/* BODY CONTENT */}
      <div className="flex-1 mt-4 relative z-10">
        
        {/* VIEW 1: SLEEP TRACKER */}
        {view === 'tracker' && (
          isSleeping ? (
            <div className="mt-8">
              <p className="text-indigo-400 text-xs mb-4 text-center">Sweet dreams, Dheyn.</p>
              <button 
                onClick={handleWakeUp}
                className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 shadow-lg"
              >
                <Sun size={18} /> I'm Awake
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-end">
              {/* Progress Bar */}
              <div className="mb-4">
                 <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                   <span>Sleep Goal</span>
                   <span>8h</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min(((lastSleep?.duration_minutes || 0) / 480) * 100, 100)}%` }} 
                   />
                 </div>
              </div>
              
              <button 
                onClick={handleStartSleep}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                <Moon size={18} /> Good Night
              </button>
            </div>
          )
        )}

        {/* VIEW 2: CHART (TRENDS) */}
        {view === 'trends' && (
          <div className="h-40 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="dayName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#94a3b8'}} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{fill: '#f1f5f9', radius: 4}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="hours" radius={[4, 4, 4, 4]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours >= 7 ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Background Decor for Sleep Mode */}
      {isSleeping && (
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default SleepTracker;