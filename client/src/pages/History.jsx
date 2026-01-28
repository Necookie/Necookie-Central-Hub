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
      case 'meal': return { icon: Utensils, color: 'bg-green-100 text-green-600' };
      case 'workout': return { icon: Dumbbell, color: 'bg-orange-100 text-orange-600' };
      case 'task': return { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' };
      case 'session': return { icon: Clock, color: 'bg-sky-100 text-sky-600' };
      default: return { icon: Activity, color: 'bg-slate-100 text-slate-600' };
    }
  };

  const getDateHeader = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'MMMM d, yyyy');
  };

  if (isLoading) return <div className="p-8 text-slate-400">Loading history...</div>;

  return (
    <div className="p-8 h-screen overflow-y-auto bg-slate-50">
      <div className="max-w-3xl mx-auto pb-20">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-8">Activity Feed</h1>
        <div className="space-y-8 relative">
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200 -z-0" />
          {events.map((event, index) => {
             const style = getIcon(event.type);
             const showHeader = index === 0 || getDateHeader(event.timestamp) !== getDateHeader(events[index - 1].timestamp);
             return (
               <div key={`${event.type}-${event.id}`} className="relative z-10">
                 {showHeader && (
                   <div className="flex items-center gap-4 mb-6 mt-8 -ml-2">
                     <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 shadow-sm flex items-center gap-2"><Calendar size={12} /> {getDateHeader(event.timestamp)}</div>
                   </div>
                 )}
                 <div className="flex gap-6 group mb-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-4 border-slate-50 shadow-sm ${style.color}`}><style.icon size={24} /></div>
                   <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                     <div className="flex justify-between items-start mb-1"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{event.type} • {format(parseISO(event.timestamp), 'h:mm a')}</span></div>
                     <p className="text-slate-700 font-medium">{event.content}</p>
                     {event.secondary_info && <p className="text-xs text-slate-400 mt-1">{event.secondary_info}</p>}
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