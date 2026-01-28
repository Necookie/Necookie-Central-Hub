import React, { useState } from 'react';
import { Plus, X, Smile, Meh, Frown, Zap, Coffee, Trash2, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { format } from 'date-fns';

const moodConfig = {
  happy: { icon: Smile, color: 'bg-emerald-100 text-emerald-600 border-emerald-200', label: 'Great' },
  neutral: { icon: Meh, color: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Okay' },
  stressed: { icon: Frown, color: 'bg-rose-100 text-rose-600 border-rose-200', label: 'Stressed' },
  excited: { icon: Zap, color: 'bg-amber-100 text-amber-600 border-amber-200', label: 'Excited' },
  tired: { icon: Coffee, color: 'bg-indigo-100 text-indigo-600 border-indigo-200', label: 'Tired' },
};

const Diary = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState('neutral');

  const { data: entries = [], isLoading } = useQuery({ queryKey: ['journal'], queryFn: api.fetchJournal });

  const addMutation = useMutation({
    mutationFn: api.addJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries(['journal']);
      queryClient.invalidateQueries(['history']);
      setIsModalOpen(false); setContent(""); setSelectedMood('neutral');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteJournalEntry,
    onSuccess: () => queryClient.invalidateQueries(['journal'])
  });

  const handleSave = () => { if (content.trim()) addMutation.mutate({ content, mood: selectedMood }); };

  return (
    <div className="p-8 h-screen overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div><h1 className="text-3xl font-bold text-slate-800 tracking-tight">Personal Journal</h1><p className="text-slate-500 mt-1">Capture your ideas, feelings, and daily reflections.</p></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"><Plus size={20} /> New Entry</button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? <p className="text-slate-400">Loading your thoughts...</p> : entries.length === 0 ? 
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300"><p className="text-slate-400 mb-2">Your journal is empty.</p><button onClick={() => setIsModalOpen(true)} className="text-indigo-600 font-bold hover:underline">Write your first note</button></div> : 
          entries.map(entry => {
            const MoodIcon = moodConfig[entry.mood]?.icon || Meh;
            const style = moodConfig[entry.mood] || moodConfig.neutral;
            return (
              <div key={entry.id} className="group bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${style.color}`}><MoodIcon size={12} /> {style.label}</div>
                    <button onClick={() => deleteMutation.mutate(entry.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-sans">{entry.content}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-400 text-xs font-mono"><Calendar size={12} />{format(new Date(entry.created_at), "MMMM d, yyyy • h:mm a")}</div>
              </div>
            );
          })
        }
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-lg font-bold text-slate-800">New Entry</h3><button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button></div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2 justify-center pb-4">
                {Object.keys(moodConfig).map((moodKey) => {
                   const Icon = moodConfig[moodKey].icon;
                   const isSelected = selectedMood === moodKey;
                   return <button key={moodKey} onClick={() => setSelectedMood(moodKey)} className={`p-3 rounded-xl transition-all ${isSelected ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`} title={moodKey}><Icon size={20} /></button>;
                })}
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="How was your day? What's on your mind?" className="w-full h-40 bg-slate-50 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" autoFocus />
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3"><button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button><button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Save Entry</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Diary;