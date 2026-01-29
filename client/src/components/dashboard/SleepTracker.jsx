import React, { useState, useEffect } from 'react';
import { Moon, Sun, BarChart2, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

const SleepTracker = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState('tracker');
  const [elapsed, setElapsed] = useState("0h 0m");

  const { data: sleepHistory = [] } = useQuery({ queryKey: ['sleepHistory'], queryFn: api.fetchSleepLogs });
  const { data: activeSleep } = useQuery({ queryKey: ['activeSleep'], queryFn: api.fetchActiveSleep });

  const isSleeping = !!activeSleep;

  const startMutation = useMutation({
    mutationFn: api.startSleep,
    onSuccess: () => queryClient.invalidateQueries(['activeSleep'])
  });

  const wakeMutation = useMutation({
    mutationFn: api.wakeUp,
    onSuccess: () => {
      queryClient.invalidateQueries(['activeSleep']);
      queryClient.invalidateQueries(['sleepHistory']);
      queryClient.invalidateQueries(['history']);
      api.generateDailySummary();
    }
  });

  useEffect(() => {
    const updateTimer = () => {
      if (activeSleep) {
        const diffMs = new Date() - new Date(activeSleep.bed_time);
        const diffMins = Math.floor(diffMs / 60000);
        setElapsed(`${Math.floor(diffMins/60)}h ${diffMins%60}m`);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [activeSleep]);

  // --- SUM ALL SLEEP SESSIONS PER DAY ---
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dayLogs = sleepHistory.filter(l => l.wake_time && isSameDay(parseISO(l.bed_time), d));
    const totalMinutes = dayLogs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);

    return { 
      dayName: format(d, 'EEE'), 
      hours: parseFloat((totalMinutes / 60).toFixed(1)) 
    };
  });

  const lastSleep = sleepHistory[sleepHistory.length - 1];

  // --- FIX: CALCULATE AVERAGE ONLY FOR DAYS WITH DATA ---
  const daysWithData = last7Days.filter(day => day.hours > 0).length;
  const totalHours = last7Days.reduce((acc, curr) => acc + curr.hours, 0);
  
  // Prevent divide by zero if no data exists
  const avgSleep = daysWithData > 0 
    ? (totalHours / daysWithData).toFixed(1) 
    : "0.0";

  return (
    <div className={`relative h-full border rounded-3xl p-6 transition-all duration-500 overflow-hidden flex flex-col justify-between ${
      isSleeping ? 'bg-indigo-950 border-indigo-800' : 'bg-surface border-border shadow-sm'
    }`}>
      
      <div className="flex justify-between items-start z-10 relative">
        <div>
          {view === 'tracker' ? (
             <>
               <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isSleeping ? 'text-indigo-300' : 'text-text-muted'}`}>
                 {isSleeping ? 'Currently Sleeping' : "Last Night's Sleep"}
               </p>
               {isSleeping ? (
                 <h2 className="text-4xl font-mono text-white tracking-tighter mt-1">{elapsed}</h2>
               ) : (
                 <h2 className="text-3xl font-light text-text-main tracking-tight flex items-baseline gap-2">
                   {Math.floor((lastSleep?.duration_minutes || 0) / 60)}<span className="text-sm font-bold text-text-muted">h</span>
                   {(lastSleep?.duration_minutes || 0) % 60}<span className="text-sm font-bold text-text-muted">m</span>
                 </h2>
               )}
             </>
          ) : (
             <>
               <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Weekly Average</p>
               <h2 className="text-3xl font-light text-text-main tracking-tight">{avgSleep}<span className="text-sm font-bold text-text-muted">h / night</span></h2>
             </>
          )}
        </div>
        {!isSleeping && (
          <button onClick={() => setView(view === 'tracker' ? 'trends' : 'tracker')} className="p-2 bg-surface-highlight text-text-muted rounded-xl hover:bg-border transition-colors">
            {view === 'tracker' ? <BarChart2 size={18} /> : <ArrowLeft size={18} />}
          </button>
        )}
      </div>

      <div className="flex-1 mt-4 relative z-10">
        {view === 'tracker' && (
          isSleeping ? (
            <div className="mt-8">
              <p className="text-indigo-400 text-xs mb-4 text-center">Sweet dreams.</p>
              <button onClick={() => wakeMutation.mutate({ id: activeSleep.id, bed_time: activeSleep.bed_time })} className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 shadow-lg">
                <Sun size={18} /> I'm Awake
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-end">
              <div className="mb-4">
                 <div className="flex justify-between text-[10px] text-text-muted mb-1"><span>Sleep Goal</span><span>8h</span></div>
                 <div className="w-full bg-surface-highlight h-2 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(((lastSleep?.duration_minutes || 0) / 480) * 100, 100)}%` }} />
                 </div>
              </div>
              <button onClick={() => startMutation.mutate()} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                <Moon size={18} /> Good Night
              </button>
            </div>
          )
        )}
        {view === 'trends' && (
          <div className="h-40 w-full mt-2 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <XAxis dataKey="dayName" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                <YAxis hide domain={[0, 12]} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)', radius: 4}} contentStyle={{borderRadius: '12px', background: '#1e293b', border: 'none', color: '#fff', fontSize: '12px'}} />
                <Bar dataKey="hours" radius={[4, 4, 4, 4]}>
                  {last7Days.map((entry, index) => <Cell key={index} fill={entry.hours >= 7 ? '#6366f1' : '#475569'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {isSleeping && <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />}
    </div>
  );
};
export default SleepTracker;