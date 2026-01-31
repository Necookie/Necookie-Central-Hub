import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Zap, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  // 1. SECURITY FIX: Initialize with empty strings, NOT your real password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      // Optional: Shake animation logic could go here
    } else {
      console.log("Logged in:", data.user);
      // App.jsx handles the redirect automatically
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
        
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Zap size={24} className="text-white fill-white" />
           </div>
        </div>

        <h2 className="text-2xl font-light text-center text-slate-800 mb-2">Private Access</h2>
        <p className="text-center text-slate-400 text-sm mb-8">Restricted to authorized personnel only.</p>

        {errorMsg && (
          <div className="mb-6 bg-red-50 text-red-500 text-sm p-3 rounded-xl flex items-center gap-2 border border-red-100 animate-pulse">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-400"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-400"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Enter Hub'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;