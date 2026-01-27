import React, { useState } from 'react';
import { Send, Activity, Lock, Unlock } from 'lucide-react';
import { supabase } from '../../supabaseClient'; // Import the client

const Badge = ({ text, onClick }) => (
  <span onClick={onClick} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-medium hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 cursor-pointer transition-all">
    {text}
  </span>
);

const QuickLog = () => {
  const [input, setInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLog = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      // 1. Get current user (Supabase requires a user for RLS)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first! (Auth not setup yet)");
        setLoading(false);
        return;
      }

      // 2. Decide which table to insert into
      if (isPrivate) {
        // Insert into Private Vault [cite: 76-77]
        const { error } = await supabase.from('private_logs').insert([
          { user_id: user.id, content: input, type: 'thought' }
        ]);
        if (error) throw error;
      } else {
        // Insert into Public Activity Feed [cite: 70-71]
        const { error } = await supabase.from('minute_logs').insert([
          { user_id: user.id, activity: input, is_private: false }
        ]);
        if (error) throw error;
      }

      // 3. Cleanup
      setInput("");
      alert(isPrivate ? "Saved to Vault 🔒" : "Logged to Timeline ⚡");
      
    } catch (error) {
      console.error("Error logging:", error.message);
      alert("Error saving log!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white border transition-all duration-300 rounded-3xl p-6 relative group overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full ${
      isPrivate ? 'border-purple-200 shadow-purple-100' : 'border-slate-200/60'
    }`}>
      {/* ... (Keep your existing UI layout) ... */}
      
      <div className="flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLog()} // Allow Enter key
          disabled={loading}
          placeholder={isPrivate ? "Log thoughts securely..." : "What are you doing right now?"} 
          className={`flex-1 bg-slate-50 border rounded-xl px-5 py-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all font-mono text-sm ${
            isPrivate ? 'border-purple-200 focus:border-purple-500' : 'border-slate-200 focus:border-sky-500'
          }`}
        />
        <button 
          onClick={handleLog}
          disabled={loading}
          className={`p-4 rounded-xl transition-colors shadow-lg flex items-center justify-center text-white ${
            isPrivate ? 'bg-purple-600 hover:bg-purple-500' : 'bg-sky-600 hover:bg-sky-500'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Send size={20} />
        </button>
      </div>

      {/* ... (Keep your Badges) ... */}
    </div>
  );
};

export default QuickLog;