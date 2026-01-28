import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { CheckCircle2, Utensils, Dumbbell, Clock, Activity, Calendar } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const History = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.fetchUnifiedHistory(50),
    refetchInterval: 10000
  });

  const getIcon = (type) => {
    switch(type) {
      // UPDATED: Using opacity-based colors for better Dark Mode contrast
      case 'meal': return { icon: Utensils, color: 'bg-green-500/10 text-green-600 dark:text-green-400' };
      case 'workout': return { icon: Dumbbell, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' };
      case 'task': return { icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
      case 'session': return { icon: Clock, color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' };
      default: return { icon: Activity, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' };
    }
  };

  const getDateHeader = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
  };

  if (isLoading) return <div className="p-8 text-text-muted">Loading history...</div>;

  return (
    // UPDATED: Removed 'bg-slate-50', added 'text-text-main'
    <div className="p-8 h-screen overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto pb-20">
        <h1 className="text-3xl font-bold text-text-main tracking-tight mb-8">Activity Feed</h1>
        
        <div className="space-y-8 relative">
          {/* UPDATED: Timeline line color */}
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-border -z-0" />
          
          {events.map((event, index) => {
             const style = getIcon(event.type);
             const showHeader = index === 0 || getDateHeader(event.timestamp) !== getDateHeader(events[index - 1].timestamp);
             
             return (
               <div key={`${event.type}-${event.id}`} className="relative z-10">
                 {showHeader && (
                   <div className="flex items-center gap-4 mb-6 mt-8 -ml-2">
                     {/* UPDATED: Date Badge */}
                     <div className="bg-surface text-text-muted px-3 py-1 rounded-full text-xs font-bold border border-border shadow-sm flex items-center gap-2">
                       <Calendar size={12} /> {getDateHeader(event.timestamp)}
                     </div>
                   </div>
                 )}
                 
                 <div className="flex gap-6 group mb-6">
                   {/* UPDATED: Icon Box border */}
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 border-background shadow-sm ${style.color}`}>
                     <style.icon size={24} />
                   </div>
                   
                   {/* UPDATED: Card styles (bg-surface, border-border, shadow-card) */}
                   <div className="flex-1 bg-surface p-5 rounded-2xl border border-border shadow-card transition-colors hover:border-primary/20">
                     <div className="flex justify-between items-start mb-1">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                         {event.type} • {format(parseISO(event.timestamp), 'h:mm a')}
                       </span>
                     </div>
                     <p className="text-text-main font-medium">{event.content}</p>
                     {event.secondary_info && <p className="text-xs text-text-muted mt-1">{event.secondary_info}</p>}
                   </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};
export default History;