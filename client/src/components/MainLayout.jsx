import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Clock, Lock, BookOpen, LayoutGrid, Menu } from 'lucide-react';
import MiniChatbot from './MiniChatbot';

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/20 selection:text-primary overflow-hidden relative transition-theme">
      
      {/* 1. Dynamic Background Glows */}
      {/* Uses 'bg-primary' so the glow color matches the active theme automatically */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/15 blur-[120px] rounded-full mix-blend-screen opacity-100 dark:opacity-20 transition-all duration-1000" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-100 dark:opacity-20 transition-all duration-1000" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* 2. Navigation Rail (Sidebar) */}
        <aside className="w-20 hidden md:flex flex-col items-center py-6 border-r border-border bg-surface/70 backdrop-blur-xl z-50 transition-theme">
          <div className="mb-10 p-2">
            <Link to="/" className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </Link>
          </div>
          
          <nav className="flex flex-col gap-8 w-full items-center">
            <NavIcon to="/" icon={<LayoutGrid size={24} />} active={location.pathname === '/'} />
            <NavIcon to="/history" icon={<Clock size={24} />} active={location.pathname === '/history'} />
            <NavIcon to="/diary" icon={<BookOpen size={24} />} active={location.pathname === '/diary'} />
            
            <div className="h-px w-8 bg-border my-2" />
            
            <NavIcon to="/vault" icon={<Lock size={22} />} active={location.pathname === '/vault'} danger />
          </nav>

          <div className="mt-auto pb-4">
             <div className="w-8 h-8 rounded-full bg-surface-highlight border border-border flex items-center justify-center text-xs font-mono text-text-muted font-bold group hover:border-primary transition-colors cursor-pointer">
               NC
             </div>
          </div>
        </aside>

        {/* 3. Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Mobile Menu Trigger */}
          <div className="md:hidden p-4 flex justify-between items-center bg-surface/50 border-b border-border backdrop-blur-md">
             <Menu className="text-text-muted" />
             <span className="font-bold text-text-muted">Necookie Hub</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {children}
            </div>
          </div>
        </main>
      </div>

      <MiniChatbot />
    </div>
  );
};

// Helper Component for Sidebar Icons
const NavIcon = ({ to, icon, active, danger }) => (
  <Link to={to} className={`relative group p-3 rounded-2xl transition-all duration-300 ${
    active 
      ? 'bg-primary/10 text-primary' 
      : 'text-text-muted hover:text-text-main hover:bg-surface-highlight'
  } ${danger ? 'hover:text-red-500 hover:bg-red-500/10' : ''}`}>
    {icon}
    {/* Active Indicator Bar */}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(var(--primary),0.5)]" />}
  </Link>
);

export default MainLayout;