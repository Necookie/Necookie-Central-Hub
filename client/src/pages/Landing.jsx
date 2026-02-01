import React, { useState } from 'react';
import { 
  LayoutGrid, ArrowRight, Wallet, BookOpen, 
  Activity, Terminal, Lock, Zap 
} from 'lucide-react';
import AuthModal from '../components/AuthModal'; // <--- Import the new modal

const Landing = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false); // <--- State for modal

  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/20 transition-theme overflow-x-hidden">
      
      {/* MOUNT MODAL */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-40">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <LayoutGrid size={20} />
          </div>
          Necookie Hub
        </div>
        
        {/* LOGIN BUTTON (Triggers Modal) */}
        <button 
          onClick={() => setIsAuthOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-surface border border-border hover:border-primary/50 hover:text-primary transition-all font-bold text-sm shadow-sm group"
        >
          Login <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </button>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32 text-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-highlight border border-border text-xs font-mono text-primary font-bold animate-in fade-in slide-in-from-bottom-4">
            <Zap size={12} fill="currentColor" /> v2.0 SYSTEM ONLINE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main animate-in fade-in slide-in-from-bottom-6 duration-500">
            Your Life, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
              Operating System.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
            A centralized command center for finance, health, coding, and thoughts. 
            Powered by AI, built for peak performance.
          </p>

          <div className="pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* CTA BUTTON (Triggers Modal) */}
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-text-main text-background rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
            >
              Initialize System <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* BENTO GRID FEATURES (Unchanged) */}
      <div className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: Finance */}
          <div className="bg-surface border border-border p-8 rounded-3xl hover:border-emerald-500/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">Financial Command</h3>
            <p className="text-text-muted text-sm leading-relaxed">Track income, expense patterns, and set savings goals with real-time analytics and alerts.</p>
          </div>

          {/* Feature 2: Journal */}
          <div className="bg-surface border border-border p-8 rounded-3xl hover:border-indigo-500/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">Thought Stream</h3>
            <p className="text-text-muted text-sm leading-relaxed">A private, mood-tracked journal to capture ideas and reflections securely.</p>
          </div>

          {/* Feature 3: Health */}
          <div className="bg-surface border border-border p-8 rounded-3xl hover:border-rose-500/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-rose-500/5">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">Bio-Metrics</h3>
            <p className="text-text-muted text-sm leading-relaxed">Sleep tracking, calorie counting, and workout logs synced in one place for total health.</p>
          </div>

          {/* Feature 4: Wide Card (Dev) */}
          <div className="md:col-span-2 bg-surface border border-border p-8 rounded-3xl hover:border-sky-500/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-sky-500/5 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
            <div className="flex-1">
              <div className="w-12 h-12 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-text-main">Developer Focus</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Integrated task management for coding projects, session timers, and automated GitHub-style contribution graphs to keep you shipping code every day.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-32 bg-background border border-border rounded-xl p-4 font-mono text-[10px] md:text-xs text-text-muted opacity-80 select-none shadow-inner">
              <p><span className="text-purple-500">const</span> <span className="text-yellow-500">life</span> = <span className="text-sky-500">new</span> System();</p>
              <p className="pl-4"><span className="text-purple-500">await</span> life.<span className="text-blue-500">optimize</span>(&#123;</p>
              <p className="pl-8 text-emerald-500">focus: "100%",</p>
              <p className="pl-8 text-emerald-500">health: "optimized"</p>
              <p className="pl-4">&#125;);</p>
              <p><span className="text-text-muted">// System ready...</span> <span className="animate-pulse">_</span></p>
            </div>
          </div>

          {/* Feature 5: Security */}
          <div className="bg-surface border border-border p-8 rounded-3xl hover:border-amber-500/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-amber-500/5">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-main">Secure Vault</h3>
            <p className="text-text-muted text-sm leading-relaxed">PIN-protected storage with local encryption for your most sensitive data, secrets, and ideas.</p>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 text-center text-text-muted text-sm bg-surface/50">
        <p>© 2026 Necookie Hub. Engineered by Dheyn.</p>
      </footer>
    </div>
  );
};

export default Landing;