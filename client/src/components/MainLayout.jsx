import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Clock, Lock, BookOpen, LayoutGrid, Menu } from 'lucide-react';
import MiniChatbot from './MiniChatbot'; // Import the chatbot

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-200 selection:text-sky-900 overflow-hidden relative">
      {/* 1. Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-sky-200/40 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* 2. Navigation Rail (Sidebar) */}
        <aside className="w-20 hidden md:flex flex-col items-center py-6 border-r border-slate-200 bg-white/70 backdrop-blur-2xl z-50 shadow-sm">
          <div className="mb-10 p-2">
            <Link to="/" className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Zap size={20} className="text-white fill-white" />
            </Link>
          </div>
          
          <nav className="flex flex-col gap-8 w-full items-center">
            <NavIcon to="/" icon={<LayoutGrid size={24} />} active={location.pathname === '/'} />
            <NavIcon to="/history" icon={<Clock size={24} />} active={location.pathname === '/history'} />
            <NavIcon to="/diary" icon={<BookOpen size={24} />} active={location.pathname === '/diary'} />
            <div className="h-px w-8 bg-slate-200 my-2" />
            <NavIcon to="/vault" icon={<Lock size={22} />} active={location.pathname === '/vault'} danger />
          </nav>

          <div className="mt-auto pb-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono text-slate-500 font-bold">
               NC
             </div>
          </div>
        </aside>

        {/* 3. Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Mobile Menu Trigger (Visible only on small screens) */}
          <div className="md:hidden p-4 flex justify-between items-center bg-white/50 border-b border-slate-200">
             <Menu className="text-slate-600" />
             <span className="font-bold text-slate-500">Necookie Hub</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* 4. AI Assistant (Floating) */}
      <MiniChatbot />
    </div>
  );
};

// Helper Component for Sidebar Icons
const NavIcon = ({ to, icon, active, danger }) => (
  <Link to={to} className={`relative group p-3 rounded-2xl transition-all duration-300 ${
    active ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
  } ${danger ? 'hover:text-red-500 hover:bg-red-50' : ''}`}>
    {icon}
    {/* Active Indicator Bar */}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-500 rounded-r-full shadow-lg shadow-sky-200" />}
  </Link>
);

export default MainLayout;