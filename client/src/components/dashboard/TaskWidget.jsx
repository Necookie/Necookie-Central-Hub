import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Square } from 'lucide-react';

const TaskWidget = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Deploy API to Railway", completed: false },
    { id: 2, text: "Finish React Grid Layout", completed: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = (e) => {
    if (e.key === 'Enter' && newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <CheckSquare size={14} className="text-sky-600" />
          Today's Tasks
        </p>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
          {tasks.filter(t => t.completed).length}/{tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4">
        {tasks.map(task => (
          <div key={task.id} className="group flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => toggleTask(task.id)}>
            <div className={`relative flex items-center justify-center w-5 h-5 rounded border ${task.completed ? 'bg-sky-500 border-sky-500' : 'border-slate-300'}`}>
               {task.completed && <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 -translate-y-0.5" />}
            </div>
            <span className={`text-sm flex-1 ${task.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}>
              {task.text}
            </span>
            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={addTask}
          placeholder="Add a new task..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Plus size={18} />
        </div>
      </div>
    </div>
  );
};

export default TaskWidget;