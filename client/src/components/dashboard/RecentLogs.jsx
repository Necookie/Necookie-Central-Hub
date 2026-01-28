import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Terminal, Activity, CheckCircle2, Utensils, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [tasks, meals, workouts] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', user.id).eq('is_completed', true).order('created_at', { ascending: false }).limit(5),
        supabase.from('meals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('workouts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      const normalizedTasks = (tasks.data || []).map(t => ({
        id: t.id, type: 'task', content: t.text, time: t.created_at, icon: CheckCircle2, color: 'text-slate-400'
      }));
      
      // FIXED: Using 'meal_name'
      const normalizedMeals = (meals.data || []).map(m => ({
        id: m.id, type: 'meal', content: `Ate ${m.meal_name || 'Food'} (${m.calories}kcal)`, time: m.created_at, icon: Utensils, color: 'text-emerald-400'
      }));
      
      const normalizedWorkouts = (workouts.data || []).map(w => ({
        id: w.id, type: 'workout', content: `${w.activity_type} • ${w.distance_km || 0}km`, time: w.created_at, icon: Zap, color: 'text-orange-400'
      }));

      const allLogs = [...normalizedTasks, ...normalizedMeals, ...normalizedWorkouts]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10);

      setLogs(allLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const channel = supabase.channel('dashboard_feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
        if(payload.new.is_completed) addNewLog({ id: payload.new.id, type: 'task', content: payload.new.text, time: payload.new.created_at, icon: CheckCircle2, color: 'text-slate-400' });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'meals' }, (payload) => {
        // FIXED: Using 'meal_name' from payload
        addNewLog({ id: payload.new.id, type: 'meal', content: `Ate ${payload.new.meal_name || 'Food'} (${payload.new.calories}kcal)`, time: payload.new.created_at, icon: Utensils, color: 'text-emerald-400' });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'workouts' }, (payload) => {
        addNewLog({ id: payload.new.id, type: 'workout', content: `${payload.new.activity_type}`, time: payload.new.created_at, icon: Zap, color: 'text-orange-400' });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addNewLog = (item) => setLogs(prev => [item, ...prev].slice(0, 10));

  return (
    <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 shadow-sm border border-slate-800 h-full flex flex-col font-mono relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <Terminal size={12} /> Live_Feed.sh
        </p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {loading ? <p className="text-xs text-slate-500 animate-pulse">{'>'} Scanning streams...</p> : 
          logs.map((log) => (
            <div key={`${log.type}-${log.id}`} className="flex gap-4 items-start opacity-80 hover:opacity-100 transition-opacity animate-in slide-in-from-left-2 duration-300">
              <span className="text-[10px] text-slate-600 pt-1 min-w-[50px] text-right font-sans">
                 {formatDistanceToNow(new Date(log.time), { addSuffix: true }).replace('about ', '')}
              </span>
              <div className="relative flex-1 pb-4 border-l border-slate-700/50 pl-4">
                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 border ${log.type === 'meal' ? 'border-emerald-500' : log.type === 'workout' ? 'border-orange-500' : 'border-slate-500'}`} />
                <div className="flex items-center gap-2">
                  <log.icon size={12} className={log.color} />
                  <p className="text-xs text-slate-300 font-bold">{log.type.toUpperCase()}</p>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{log.content}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default RecentLogs;