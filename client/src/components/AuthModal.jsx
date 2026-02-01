import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Zap, Lock, Mail, AlertCircle, X, LayoutGrid, User, ArrowRight } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState(''); // <--- NEW FIELD
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setFullName('');
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        // --- VALIDATION ---
        if (!fullName.trim()) throw new Error("Please enter your full name.");

        // --- SIGN UP LOGIC ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // This data is passed to the SQL Trigger we created!
            data: { 
              full_name: fullName,
              avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}` // Auto-generate avatar
            } 
          }
        });
        if (error) throw error;
        setErrorMsg('Account created! Logging you in...');
      } else {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-xl transition-all duration-300"
        onClick={onClose} 
      />

      {/* CARD */}
      <div className="w-full max-w-md bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20 relative z-10 animate-in fade-in zoom-in-95 duration-300 ring-1 ring-white/20">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-8">
           <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-4 ring-4 ring-sky-500/10">
              <LayoutGrid size={28} className="text-white" />
           </div>
           <h2 className="text-2xl font-bold text-text-main tracking-tight">
             {isSignUp ? 'Initialize Account' : 'Welcome Back'}
           </h2>
           <p className="text-text-muted text-sm mt-1">
             {isSignUp ? 'Create your secure identity.' : 'Enter credentials to decrypt vault.'}
           </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-500/10 text-red-500 text-xs font-bold p-3 rounded-xl flex items-center gap-2 border border-red-500/20 animate-shake">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* --- NEW: FULL NAME INPUT (Only shows in Sign Up) --- */}
          {isSignUp && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/50"
                  required={isSignUp}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/50"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-background/50 border border-border rounded-xl pl-12 pr-4 py-3.5 text-text-main text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/50"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-text-main text-background hover:bg-primary hover:text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2 active:scale-95 group"
          >
            {loading ? <Zap size={18} className="animate-spin" /> : (
              <>
                {isSignUp ? 'Create Access ID' : 'Authenticate'} 
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-text-muted hover:text-primary transition-colors font-semibold"
          >
            {isSignUp 
              ? "Already have an identity? Log In" 
              : "New to the system? Create Account"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;