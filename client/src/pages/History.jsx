import React, { useState, useEffect } from 'react';
import { CheckCircle2, Moon, Book, Calendar, Utensils, Dumbbell, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const History = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const fetchAllHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch EVERYTHING
    const [tasks, sleep, journal, exercises, meals, sessions] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', user.id).eq('completed', true).order('created_at', { ascending: false }).limit(30),
      supabase.from('sleep_logs').select('*').eq('user_id', user.id).not('wake_time', 'is', null).order('bed_time', { ascending: false }).limit(10),
      supabase.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('exercise').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('meals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('activity_sessions').select('*').eq('user_id', user.id).not('end_time', 'is', null).order('created_at', { ascending: false }).limit(20)
    ]);

    // 2. Normalize Data
    const normalizedTasks = (tasks.data || []).map(t => ({
      type: 'task', id: t.id, date: t.created_at,
      title: 'Mission Complete', content: t.description,
      color: 'bg-emerald-100 text-emerald-600 border-emerald-200', icon: CheckCircle2
    }));

    const normalizedSleep = (sleep.data || []).map(s => {
      const hours = Math.floor(s.duration_minutes / 60);
      return {
        type: 'sleep', id: s.id, date: s.wake_time,
        title: 'Rest Log', content: `Slept for ${hours}h ${s.duration_minutes % 60}m`,
        color: 'bg-indigo-100 text-indigo-600 border-indigo-200', icon: Moon
      };
    });

    const normalizedJournal = (journal.data || []).map(j => ({
      type: 'journal', id: j.id, date: j.created_at,
      title: 'Journal Entry', content: j.content, mood: j.mood,
      color: 'bg-amber-100 text-amber-600 border-amber-200', icon: Book
    }));

    const normalizedWorkouts = (exercises.data || []).map(w => ({
      type: 'workout', id: w.id, date: w.created_at,
      title: w.type || 'Workout', 
      content: `${w.duration_mins || 0} mins • ${w.calories_burned || 0} kcal`,
      color: 'bg-orange-100 text-orange-600 border-orange-200', icon: Dumbbell
    }));

    const normalizedMeals = (meals.data || []).map(m => ({
      type: 'meal', id: m.id, date: m.created_at,
      title: 'Nutrition', content: `${m.meal_name} (${m.calories} kcal)`,
      color: 'bg-green-100 text-green-600 border-green-200', icon: Utensils
    }));

    // --- NEW: PRECISE DURATION FORMATTING ---
    const normalizedSessions = (sessions.data || []).map(s => {
      const start = format(parseISO(s.start_time), 'h:mm a');
      const end = format(parseISO(s.end_time), 'h:mm a');
      
      // Calculate precise H m s
      const totalSeconds = s.duration_seconds || 0;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const sec = totalSeconds % 60;

      // Build readable string (e.g., "1h 30m 15s" or "45s")
      let durationStr = "";
      if (h > 0) durationStr += `${h}h `;
      if (m > 0 || h > 0) durationStr += `${m}m `;
      durationStr += `${sec}s`;

      return {
        type: 'activity', 
        id: s.id, 
        date: s.end_time,
        title: 'Time Log', 
        content: `${start} - ${end} (${durationStr}) • ${s.activity_name} ${s.comments ? `— "${s.comments}"` : ''}`,
        color: 'bg-sky-100 text-sky-600 border-sky-200', 
        icon: Clock
      };
    });

    // 3. Merge & Sort
    const allEvents = [
      ...normalizedTasks, ...normalizedSleep, ...normalizedJournal, 
      ...normalizedWorkouts, ...normalizedMeals, ...normalizedSessions
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    setEvents(allEvents);
    setLoading(false);
  };

  const getDateHeader = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="p-8 h-screen overflow-y-auto bg-slate-50">
      <div className="max-w-3xl mx-auto pb-20">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-8">Activity Feed</h1>
        
        <div className="space-y-8 relative">
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200 -z-0" />

          {loading ? (
             <div className="ml-16 py-10 text-slate-400">Syncing logs...</div>
          ) : events.length === 0 ? (
             <div className="ml-16 py-10 text-slate-400">No history found. Start tracking!</div>
          ) : (
            events.map((event, index) => {
              const showHeader = index === 0 || getDateHeader(event.date) !== getDateHeader(events[index - 1].date);
              
              return (
                <div key={`${event.type}-${event.id}`} className="relative z-10">
                  {showHeader && (
                    <div className="flex items-center gap-4 mb-6 mt-8 -ml-2">
                      <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 shadow-sm flex items-center gap-2">
                        <Calendar size={12} /> {getDateHeader(event.date)}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-6 group mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 border-slate-50 shadow-sm transition-transform hover:scale-105 ${event.color}`}>
                      <event.icon size={24} />
                    </div>

                    <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {event.type} • {format(parseISO(event.date), 'h:mm a')}
                        </span>
                        {event.mood && (
                           <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full capitalize">{event.mood}</span>
                        )}
                      </div>
                      <p className="text-slate-700 font-medium">
                        {event.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default History;