import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api'; // <--- CONNECTED

const QuickLog = () => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  
  const mutation = useMutation({
    mutationFn: api.addTask, // Using task logic for generic logs
    onSuccess: () => {
      queryClient.invalidateQueries(['history']);
      api.generateDailySummary();
      setInput("");
      alert("Logged!");
    }
  });

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm h-full">
      <div className="flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && mutation.mutate(input)}
          placeholder="What are you doing?" 
          className="flex-1 bg-slate-50 border rounded-xl px-5 py-4 text-slate-700 outline-none focus:ring-2 border-slate-200 focus:border-sky-500"
        />
        <button onClick={() => mutation.mutate(input)} disabled={mutation.isPending} className="p-4 rounded-xl bg-sky-600 text-white hover:bg-sky-500 shadow-lg">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
export default QuickLog;