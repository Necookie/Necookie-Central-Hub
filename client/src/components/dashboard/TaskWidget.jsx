import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const TaskWidget = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('is_completed', { ascending: true }) // Pending first
      .order('created_at', { ascending: false });

    setTasks(data || []);
    setLoading(false);
  };

  const addTask = async (e) => {
    if (e.key === 'Enter' && newTask.trim()) {
      const text = newTask.trim();
      setNewTask(""); 
      const { data: { user } } = await supabase.auth.getUser();
      
      // FIXED: Using 'text' and 'is_completed'
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ user_id: user.id, text: text, is_completed: false }])
        .select();

      if (!error) setTasks([data[0], ...tasks]);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id);
  };

  const deleteTask = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete task?")) return;
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  const completedCount = tasks.filter(t => t.is_completed).length;

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <CheckSquare size={14} className="text-sky-600" /> Mission Log
        </p>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
          {completedCount}/{tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4 pr-1">
        {loading ? <div className="flex justify-center py-4"><Loader2 className="animate-spin text-slate-300" /></div> : 
          tasks.length === 0 ? <p className="text-xs text-slate-400 text-center py-4 italic">No active missions.</p> :
          tasks.map(task => (
            <div key={task.id} className="group flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => toggleTask(task.id, task.is_completed)}>
              <div className={`flex items-center justify-center w-5 h-5 rounded border transition-colors ${task.is_completed ? 'bg-sky-500 border-sky-500' : 'border-slate-300 bg-white'}`}>
                 {task.is_completed && <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 -translate-y-0.5" />}
              </div>
              <span className={`text-sm flex-1 truncate ${task.is_completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}>
                {task.text}
              </span>
              <button onClick={(e) => deleteTask(task.id, e)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        }
      </div>

      <div className="relative">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={addTask} placeholder="Add new objective..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500 transition-colors font-mono"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Plus size={18} /></div>
      </div>
    </div>
  );
};

export default TaskWidget;