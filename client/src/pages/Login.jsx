import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Zap, Lock, Mail, AlertCircle, ArrowLeft, LayoutGrid } from 'lucide-react';

const Login = () => {
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
    } else {
      console.log("Logged in:", data.user);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/20 flex flex-col items-center justify-center relative overflow-hidden transition-theme">
      
      {/* --- BACKGROUND FX (Matches Landing Page) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* --- NAVIGATION --- */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors text-sm font-bold group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to System
        </Link>
      </div>

      {/* --- LOGIN CARD --- */}
      <div className="w-full max-w-md bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Card Header */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-4">
              <LayoutGrid size={28} className="text-white" />
           </div>
           <h2 className="text-2xl font-bold text-text-main">Welcome Back</h2>
           <p className="text-text-muted text-sm">Enter your credentials to access the hub.</p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 bg-red-500/10 text-red-500 text-xs font-bold p-3 rounded-xl flex items-center gap-2 border border-red-500/20 animate-shake">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@necookie.dev"
                className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/50"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/50"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-text-main text-background hover:bg-primary hover:text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 active:scale-95"
          >
            {loading ? <Zap size={18} className="animate-spin" /> : 'Authenticate'}
          </button>
        </form>
      </div>

      {/* --- FOOTER --- */}
      <p className="mt-8 text-text-muted text-[10px] uppercase tracking-widest font-bold opacity-50">
        Secure System v2.0 • Authorized Personnel Only
      </p>

    </div>
  );
};

export default Login;