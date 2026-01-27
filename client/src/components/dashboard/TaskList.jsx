import React, { useState } from 'react';
import { CheckSquare, Plus, X } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish AutoShop Capstone logic", done: false },
    { id: 2, text: "Jogging (3km goal)", done: true },
    { id: 3, text: "Deploy n8n to Railway", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <CheckSquare size={14} className="text-sky-500" />
          Daily Tasks
        </h3>
        <button className="text-slate-400 hover:text-sky-600 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {tasks.map((task) => (
          <div key={task.id} className="group flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => toggleTask(task.id)}>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.done ? 'bg-sky-500 border-sky-500' : 'border-slate-300 group-hover:border-sky-400'}`}>
              {task.done && <Plus size={12} className="text-white rotate-45" />}
            </div>
            <span className={`text-sm font-medium transition-all ${task.done ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
              {task.text}
            </span>
            <button className="ml-auto opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;