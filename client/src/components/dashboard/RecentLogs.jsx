import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Clock, Terminal, Activity } from 'lucide-react';

const RecentLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch initial data
  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('minute_logs')
        .select('*')
        .eq('is_private', false) // Only show Public logs here!
        .order('start_time', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // 2. Setup Real-time Listener (The "Magic" part)
    const channel = supabase
      .channel('public:minute_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'minute_logs' },
        (payload) => {
          // If a new public log comes in, add it to the top of the list
          if (!payload.new.is_private) {
            setLogs((prevLogs) => [payload.new, ...prevLogs]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper to format time (e.g. "10:42 AM")
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 shadow-2xl shadow-slate-900/20 h-full flex flex-col font-mono relative overflow-hidden">
      {/* Decorative Terminal Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <Terminal size={12} />
          System_Log.sh
        </p>
      </div>

      {/* The Feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {loading ? (
          <p className="text-xs text-slate-500 animate-pulse">{'>'}{'>'} Fetching data stream...</p>
        ) : logs.length === 0 ? (
          <p className="text-xs text-slate-600 italic">{'>'}{'>'} No activity recorded today.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="group flex gap-4 items-start opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-xs text-slate-500 pt-1 min-w-[60px] text-right">
                {formatTime(log.start_time)}
              </span>
              <div className="relative flex-1 pb-4 border-l border-slate-700/50 pl-4">
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-800 border border-emerald-500/50 group-hover:bg-emerald-500 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
                
                <p className="text-sm text-slate-200 leading-relaxed">
                  {log.activity}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Status */}
      <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center text-[10px] text-slate-500">
        <span>USER: dheyn_admin</span>
        <span className="flex items-center gap-1.5">
          <Activity size={10} className="text-emerald-500" />
          SYNC_ACTIVE
        </span>
      </div>
    </div>
  );
};

export default RecentLogs;