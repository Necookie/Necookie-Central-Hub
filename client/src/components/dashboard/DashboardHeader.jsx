import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';

const DashboardHeader = () => {
  // State for real-time clock
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  // Format Date: "Wednesday, Jan 28"
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Format Time: "09:30 AM"
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Dynamic Greeting based on time
  const hour = currentDate.getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
  if (hour >= 18) greeting = "Good Evening";

  return (
    <header className="h-20 border-b border-slate-200/60 bg-white/50 backdrop-blur-md flex items-center justify-between px-6 z-40 sticky top-0 mb-6">
      
      {/* LEFT: Greeting & Time */}
      <div>
        <h1 className="text-xl md:text-2xl font-light text-slate-800">
          {greeting}, <span className="font-bold text-sky-600">Dheyn</span>
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
          {formattedDate} • <span className="text-slate-600 font-bold">{formattedTime}</span>
        </p>
      </div>

      {/* RIGHT: Search, Status & Notifications */}
      <div className="flex items-center gap-6">
        
        {/* Search Bar (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl w-64 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all shadow-sm">
          <Search size={14} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder:text-slate-400 font-mono" 
          />
        </div>

        {/* System Status & Version Badge */}
        <div className="hidden md:block text-right">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">System Status</p>
          <div className="flex items-center justify-end gap-3">
            
            {/* The ALPHA Badge */}
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-200 text-amber-600 text-[9px] font-bold tracking-tight">
              ALPHA v0.1
            </span>

            {/* Online Indicator */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                 <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <span className="text-xs font-bold text-emerald-600 font-mono">ONLINE</span>
            </div>
          </div>
        </div>

        <button className="relative p-2.5 bg-white border border-slate-100 hover:bg-slate-50 hover:border-slate-200 rounded-full transition-all shadow-sm group">
          <Bell size={18} className="text-slate-400 group-hover:text-slate-600" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;