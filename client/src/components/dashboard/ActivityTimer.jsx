import React, { useState, useEffect } from 'react';
import { Play, Square, Clock, Save, Hash, Timer } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const ActivityTimer = () => {
  const [session, setSession] = useState(null); 
  const [activityName, setActivityName] = useState("");
  const [elapsed, setElapsed] = useState("00:00:00");
  const [isStopping, setIsStopping] = useState(false);
  const [comment, setComment] = useState("");

  // 1. INITIAL LOAD: Check for active session ONLY ONCE
  useEffect(() => {
    checkActiveSession();
  }, []);

  // 2. TIMER LOGIC: Runs only when a session exists
  useEffect(() => {
    let interval;
    if (session?.start_time) {
      // Run immediately to avoid 1s delay
      calculateTime(); 
      interval = setInterval(calculateTime, 1000);
    }
    return () => clearInterval(interval);
  }, [session]); // Re-runs only if session object changes (e.g. Start/Stop)

  const checkActiveSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('activity_sessions')
      .select('*')
      .eq('user_id', user.id)
      .is('end_time', null)
      .maybeSingle();

    if (data) setSession(data);
  };

  const calculateTime = () => {
    if (!session?.start_time) return;
    const start = new Date(session.start_time).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, Math.floor((now - start) / 1000)); // Prevent negative numbers

    const h = Math.floor(diff / 3600).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    setElapsed(`${h}:${m}:${s}`);
  };

  const startSession = async () => {
    if (!activityName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('activity_sessions')
      .insert([{ user_id: user.id, activity_name: activityName }])
      .select()
      .single();

    if (!error) {
      setSession(data);
      setActivityName("");
    }
  };

  const confirmStop = async () => {
    const endTime = new Date();
    const startTime = new Date(session.start_time);
    const durationSecs = Math.floor((endTime - startTime) / 1000);

    await supabase
      .from('activity_sessions')
      .update({ 
        end_time: endTime.toISOString(),
        duration_seconds: durationSecs,
        comments: comment
      })
      .eq('id', session.id);

    setSession(null);
    setIsStopping(false);
    setComment("");
    setElapsed("00:00:00");
  };

  // --- UI RENDER ---
  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative Background */}
      {session && !isStopping && (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl animate-pulse opacity-50 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <Clock size={14} className={session ? "text-sky-500 animate-spin-slow" : "text-slate-400"} />
          {session ? "Live Tracker" : "Activity Timer"}
        </div>
        {session && (
          <div className="flex items-center gap-1.5 bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-2 z-10">
        {session ? (
          // ACTIVE STATE
          <div className="w-full text-center space-y-4">
            
            {/* The Timer Display */}
            <div className="relative inline-block">
                <h2 className="text-6xl font-light text-slate-800 tracking-tighter tabular-nums font-mono">
                {elapsed}
                </h2>
                <p className="text-sky-600 font-bold text-sm mt-1 uppercase tracking-wide bg-sky-50 inline-block px-3 py-1 rounded-full border border-sky-100">
                {session.activity_name}
                </p>
            </div>
            
            {isStopping ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 w-full pt-4">
                <input 
                  type="text" 
                  autoFocus
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Result? (e.g. '5x Win Streak')"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-sky-500 text-center placeholder:text-slate-400"
                />
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsStopping(false)}
                        className="flex-1 bg-slate-100 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-xs"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmStop}
                        className="flex-[2] bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs"
                    >
                        <Save size={14} /> Finish
                    </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsStopping(true)}
                className="w-full mt-6 bg-red-50 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 group border border-red-100"
              >
                <Square size={18} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
                Stop Session
              </button>
            )}
          </div>
        ) : (
          // IDLE STATE
          <div className="w-full space-y-4">
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Timer size={32} strokeWidth={1.5} />
                </div>
                <p className="text-slate-400 text-sm">Start focusing on a new task.</p>
            </div>

            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="What are you doing?" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && startSession()}
              />
            </div>
            <button 
              onClick={startSession}
              disabled={!activityName.trim()}
              className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-200"
            >
              <Play size={18} fill="currentColor" /> Start Timing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimer;