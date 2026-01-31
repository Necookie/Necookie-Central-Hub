import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, Clock, BookOpen, Wallet, Lock, 
  Menu, X, Zap, LogOut // <--- Import LogOut icon
} from 'lucide-react';
import { supabase } from '../supabaseClient'; // <--- Import Supabase

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    // 1. Sign out from Supabase
    await supabase.auth.signOut();
    // 2. That's it! App.jsx listens to the auth change and redirects automatically.
  };

  return (
    // ROOT: Locks viewport height to prevent double scrollbars
    <div className="fixed inset-0 w-full h-full bg-slate-50 text-slate-800 font-sans overflow-hidden flex">
      
      {/* LAYER 0: Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-sky-100/50 blur-[120px] rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/50 blur-[120px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      {/* LAYER 1: Sidebar (Desktop) */}
      <aside className="hidden md:flex w-20 flex-col items-center py-6 border-r border-slate-200/60 bg-white/50 backdrop-blur-xl z-20 relative">
        <div className="mb-10 p-2">
          <Link to="/" className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform">
            <Zap size={20} className="text-white fill-white" />
          </Link>
        </div>
        
        <nav className="flex flex-col gap-6 w-full items-center">
          <NavIcon to="/dashboard" icon={<LayoutGrid size={24} />} active={location.pathname === '/dashboard'} />
          <NavIcon to="/history" icon={<Clock size={24} />} active={location.pathname === '/history'} />
          <NavIcon to="/diary" icon={<BookOpen size={24} />} active={location.pathname === '/diary'} />
          <NavIcon to="/finance" icon={<Wallet size={24} />} active={location.pathname === '/finance'} />
          
          <div className="h-px w-8 bg-slate-200 my-2" />
          
          <NavIcon to="/vault" icon={<Lock size={22} />} active={location.pathname === '/vault'} danger />
        </nav>

        {/* LOGOUT BUTTON (Desktop) */}
        <div className="mt-auto pb-4">
           <button 
             onClick={handleLogout}
             className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
             title="Logout"
           >
             <LogOut size={20} />
           </button>
        </div>
      </aside>

      {/* LAYER 2: Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <div className="absolute inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="w-20 h-full bg-white border-r border-slate-200 flex flex-col items-center py-6" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsMobileMenuOpen(false)} className="mb-8 p-2 text-slate-400 hover:text-red-500">
                <X size={24} />
              </button>
              <nav className="flex flex-col gap-6 w-full items-center">
                <NavIcon to="/dashboard" icon={<LayoutGrid size={24} />} active={location.pathname === '/dashboard'} />
                <NavIcon to="/history" icon={<Clock size={24} />} active={location.pathname === '/history'} />
                <NavIcon to="/diary" icon={<BookOpen size={24} />} active={location.pathname === '/diary'} />
                <NavIcon to="/finance" icon={<Wallet size={24} />} active={location.pathname === '/finance'} />
                <NavIcon to="/vault" icon={<Lock size={22} />} active={location.pathname === '/vault'} danger />
                
                <div className="h-px w-8 bg-slate-200 my-2" />
                
                {/* LOGOUT BUTTON (Mobile) */}
                <button 
                  onClick={handleLogout}
                  className="p-3 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={22} />
                </button>
              </nav>
           </div>
        </div>
      )}

      {/* LAYER 3: Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex justify-between items-center bg-white/50 border-b border-slate-200/60 backdrop-blur-md shrink-0">
           <button onClick={() => setIsMobileMenuOpen(true)}>
             <Menu className="text-slate-500" />
           </button>
           <span className="font-bold text-slate-500">Necookie Hub</span>
           <div className="w-6" />
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};

// Helper Component for Sidebar Icons
const NavIcon = ({ to, icon, active, danger }) => (
  <Link to={to} className={`relative group p-3 rounded-2xl transition-all duration-300 ${
    active 
      ? 'bg-sky-50 text-sky-600' 
      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
  } ${danger ? 'hover:text-amber-500 hover:bg-amber-50' : ''}`}>
    {icon}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-500 rounded-r-full shadow-[0_0_12px_rgba(14,165,233,0.4)]" />}
  </Link>
);

export default MainLayout;