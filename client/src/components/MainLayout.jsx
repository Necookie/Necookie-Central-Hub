import React from 'react';
import { Zap, Clock, Lock, BookOpen, LayoutGrid, Search, Bell, Menu } from 'lucide-react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-200 selection:text-sky-900 overflow-hidden relative">
      {/* Subtle Warm Glows for "Daylight" feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-sky-200/40 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/40 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Ceramic Navigation Rail */}
        <aside className="w-20 hidden md:flex flex-col items-center py-6 border-r border-slate-200 bg-white/70 backdrop-blur-2xl z-50 shadow-sm">
          <div className="mb-10 p-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Zap size={20} className="text-white fill-white" />
            </div>
          </div>
          
          <nav className="flex flex-col gap-8 w-full items-center">
            <NavIcon icon={<LayoutGrid size={24} />} active />
            <NavIcon icon={<Clock size={24} />} />
            <NavIcon icon={<BookOpen size={24} />} />
            <div className="h-px w-8 bg-slate-200 my-2" />
            <NavIcon icon={<Lock size={22} />} danger />
          </nav>

          <div className="mt-auto pb-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono text-slate-500 font-bold">
               NC
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Command Header */}
          <header className="h-16 border-b border-slate-200/60 bg-white/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
            <div className="flex items-center gap-4 text-slate-500">
              <Menu className="md:hidden text-slate-600" />
              <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full w-64 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all shadow-sm">
                <Search size={14} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search logs..." 
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder:text-slate-400 font-mono" 
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 font-mono">ONLINE</span>
                </div>
              </div>
              <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Bell size={18} className="text-slate-500" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-sky-500 rounded-full border border-white" />
              </button>
            </div>
          </header>

          {/* Scrollable Dashboard View */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const NavIcon = ({ icon, active, danger }) => (
  <button className={`relative group p-3 rounded-2xl transition-all duration-300 ${
    active ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
  } ${danger ? 'hover:text-red-500 hover:bg-red-50' : ''}`}>
    {icon}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-500 rounded-r-full shadow-lg shadow-sky-200" />}
  </button>
);

export default MainLayout;