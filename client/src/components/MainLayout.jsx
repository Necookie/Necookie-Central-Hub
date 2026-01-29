import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Clock, Lock, BookOpen, LayoutGrid, Menu, Wallet, X } from 'lucide-react';
import MiniChatbot from './MiniChatbot';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    // ROOT: Locks the viewport height to prevent double scrollbars
    <div className="fixed inset-0 w-full h-full bg-background text-text-main font-sans overflow-hidden flex transition-theme">
      
      {/* LAYER 0: Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/15 blur-[120px] rounded-full mix-blend-screen opacity-100 dark:opacity-20 transition-all duration-1000" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-100 dark:opacity-20 transition-all duration-1000" />
      </div>

      {/* LAYER 1: Sidebar (Desktop) */}
      <aside className="hidden md:flex w-20 flex-col items-center py-6 border-r border-border bg-surface/80 backdrop-blur-xl z-20 relative">
        <div className="mb-10 p-2">
          <Link to="/" className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform">
            <Zap size={20} className="text-white fill-white" />
          </Link>
        </div>
        
        <nav className="flex flex-col gap-6 w-full items-center">
          <NavIcon to="/" icon={<LayoutGrid size={24} />} active={location.pathname === '/'} />
          <NavIcon to="/history" icon={<Clock size={24} />} active={location.pathname === '/history'} />
          <NavIcon to="/diary" icon={<BookOpen size={24} />} active={location.pathname === '/diary'} />
          <NavIcon to="/finance" icon={<Wallet size={24} />} active={location.pathname === '/finance'} />
          
          <div className="h-px w-8 bg-border my-2" />
          
          <NavIcon to="/vault" icon={<Lock size={22} />} active={location.pathname === '/vault'} danger />
        </nav>

        <div className="mt-auto pb-4">
           <div className="w-8 h-8 rounded-full bg-surface-highlight border border-border flex items-center justify-center text-xs font-mono text-text-muted font-bold group hover:border-primary transition-colors cursor-pointer">
             NC
           </div>
        </div>
      </aside>

      {/* LAYER 2: Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <div className="absolute inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="w-20 h-full bg-surface border-r border-border flex flex-col items-center py-6" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsMobileMenuOpen(false)} className="mb-8 p-2 text-text-muted hover:text-red-500">
                <X size={24} />
              </button>
              <nav className="flex flex-col gap-6 w-full items-center">
                <NavIcon to="/" icon={<LayoutGrid size={24} />} active={location.pathname === '/'} />
                <NavIcon to="/history" icon={<Clock size={24} />} active={location.pathname === '/history'} />
                <NavIcon to="/diary" icon={<BookOpen size={24} />} active={location.pathname === '/diary'} />
                <NavIcon to="/finance" icon={<Wallet size={24} />} active={location.pathname === '/finance'} />
                <NavIcon to="/vault" icon={<Lock size={22} />} active={location.pathname === '/vault'} danger />
              </nav>
           </div>
        </div>
      )}

      {/* LAYER 3: Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex justify-between items-center bg-surface/50 border-b border-border backdrop-blur-md shrink-0">
           <button onClick={() => setIsMobileMenuOpen(true)}>
             <Menu className="text-text-muted" />
           </button>
           <span className="font-bold text-text-muted">Necookie Hub</span>
           <div className="w-6" />
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth custom-scrollbar">
          {/* FIX: Removed 'h-full'. Added 'w-full' and 'min-h-min' to prevent stretching */}
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
            {children}
          </div>
        </div>
      </main>

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
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(var(--primary),0.5)]" />}
  </Link>
);

export default MainLayout;