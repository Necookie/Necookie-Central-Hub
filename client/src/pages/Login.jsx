import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Zap, Lock, Mail } from 'lucide-react';

const Login = () => {
  // Hardcoded defaults for speed
  const [email, setEmail] = useState('dheyn.main@gmail.com');
  const [password, setPassword] = useState('@tto20Dm04ca!');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Using Password Auth instead of Magic Link
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      // Login successful! App.jsx will auto-redirect because session changed
      console.log("Logged in as:", data.user);
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

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Hub'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;