import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldAlert, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Vault = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simple "Client-side" security for the UI feel
  // In a real high-security app, you'd re-authenticate with Supabase here.
  const ACCESS_PIN = "2004"; // Simple Year of Birth PIN based on your profile

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === ACCESS_PIN) {
      setIsUnlocked(true);
      fetchPrivateLogs();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 1000);
    }
  };

  const fetchPrivateLogs = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('private_logs') // Fetches from the dedicated table or minute_logs(is_private) depending on your choice.
        // Note: Your PRD mentions a separate 'private_logs' table, but we also have 'minute_logs' with an is_private flag.
        // Let's query the 'private_logs' table for deep secrets, AND 'minute_logs' that are private.
        // For simplicity in this version, let's pull from the 'private_logs' table we created.
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Vault access error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOCKED STATE ---
  if (!isUnlocked) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-purple-500/10 text-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            {error ? <ShieldAlert size={32} className="text-red-500" /> : <Lock size={32} />}
          </div>
          
          <h2 className="text-2xl font-light text-slate-800 mb-2">Vault Locked</h2>
          <p className="text-sm text-slate-400 mb-8">This area contains sensitive logs excluded from AI processing.</p>
          
          <form onSubmit={handleUnlock} className="relative">
             <input 
               type="password" 
               value={pin}
               onChange={(e) => setPin(e.target.value)}
               placeholder="Enter Access PIN" 
               className={`w-full bg-slate-50 border text-center text-2xl tracking-[0.5em] font-bold p-4 rounded-xl focus:outline-none transition-all ${
                 error ? 'border-red-300 bg-red-50 text-red-500 placeholder:text-red-300' : 'border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 text-slate-700'
               }`}
               maxLength={4}
               autoFocus
             />
             <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
               <Fingerprint size={20} />
               Authenticate
             </button>
          </form>
        </div>
      </div>
    );
  }

  // --- UNLOCKED STATE ---
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Unlock size={24} className="text-purple-600" />
            Private Vault
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">SECURE_CONNECTION_ESTABLISHED</p>
        </div>
        <button 
          onClick={() => setIsUnlocked(false)} 
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
        >
          Lock Vault
        </button>
      </div>

      {/* Content Feed */}
      <div className="grid gap-4">
        {loading ? (
           <div className="text-center py-20 text-slate-400 animate-pulse">Decrypting data...</div>
        ) : logs.length === 0 ? (
           <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
             <p className="text-slate-400 italic">Vault is empty.</p>
           </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="bg-white border border-purple-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              {/* Decorative Stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
              
              <div className="flex justify-between items-start mb-2 pl-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-50 px-2 py-1 rounded-md">
                  {log.type || 'Secret'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(log.created_at || log.timestamp).toLocaleString()}
                </span>
              </div>
              
              <p className="text-slate-700 leading-relaxed pl-4 font-medium">
                {log.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vault;