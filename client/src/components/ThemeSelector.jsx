import React, { useEffect, useState, useRef } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';

// Define the Theme Options with preview colors
const themes = [
  { id: 'light',    name: 'Crisp',    isDark: false, bg: 'bg-slate-100', dot: 'bg-sky-500' },
  { id: 'dark',     name: 'Zinc',     isDark: true,  bg: 'bg-zinc-900',  dot: 'bg-sky-400' },
  { id: 'midnight', name: 'Midnight', isDark: true,  bg: 'bg-slate-900', dot: 'bg-indigo-500' },
  { id: 'forest',   name: 'Forest',   isDark: true,  bg: 'bg-emerald-950', dot: 'bg-emerald-400' },
  { id: 'orken',    name: 'Orken',    isDark: true,  bg: 'bg-neutral-800', dot: 'bg-[#FF6B01]' }, // Custom Orange
  { id: 'goth',     name: 'Goth',     isDark: true,  bg: 'bg-black',       dot: 'bg-red-600' },
];

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyTheme = (themeId) => {
    const themeObj = themes.find(t => t.id === themeId);
    if (!themeObj) return;

    setActiveTheme(themeId);
    localStorage.setItem('theme', themeId);
    
    const html = document.documentElement;
    html.className = 'transition-theme'; // Reset class list but keep transition
    
    if (themeObj.isDark) {
      html.classList.add('dark');
    }
    
    if (themeId !== 'light' && themeId !== 'dark') {
      html.classList.add(`theme-${themeId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl bg-surface border border-border text-text-muted hover:text-text-main hover:bg-surface-highlight transition-all shadow-sm group"
        title="Change Theme"
      >
        <Palette size={18} className="group-hover:text-primary transition-colors" />
        <span className="text-xs font-bold hidden md:block">{themes.find(t => t.id === activeTheme)?.name}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl shadow-black/20 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 space-y-1">
            <p className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider opacity-70">Select Aesthetic</p>
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => { applyTheme(theme.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTheme === theme.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-muted hover:bg-surface-highlight hover:text-text-main'
                }`}
              >
                {/* Theme Preview Dot */}
                <div className={`relative w-4 h-4 rounded-full border border-gray-400/20 shadow-sm ${theme.bg} overflow-hidden`}>
                  <div className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                </div>
                
                <span className="flex-1 text-left">{theme.name}</span>
                {activeTheme === theme.id && <Check size={14} className="animate-in zoom-in spin-in-90 duration-300" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;