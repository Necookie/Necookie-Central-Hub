import React from 'react';
import { ChevronRight } from 'lucide-react';

const AIBlogCard = () => (
  <div className="bg-white border border-slate-200/60 rounded-3xl p-8 relative overflow-hidden shadow-sm h-full">
    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-50 rounded-full blur-[80px] pointer-events-none" />
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md shadow-sky-200">
          AI GENERATED
        </div>
        <span className="text-slate-400 text-xs font-mono">Yesterday's Summary</span>
      </div>
      
      <h2 className="text-2xl text-slate-800 font-light mb-4 leading-relaxed">
        "You crushed the <span className="text-sky-600 font-medium">AutoShop Capstone</span> logic, but your sleep schedule needs a rescue."
      </h2>
      <p className="text-slate-600 text-sm leading-6 mb-6 max-w-2xl">
        Yesterday was heavy on coding blocks. You spent 4.5 hours on the backend, which is great progress. However, you skipped the afternoon jog and stayed up until 3 AM debugging. 
        <br/><br/>
        <span className="text-indigo-500 font-medium italic bg-indigo-50 px-2 py-1 rounded">Suggestion: Move the coding block to 10 AM to catch the daylight window.</span>
      </p>

      <button className="group flex items-center gap-2 text-sky-600 text-sm font-bold hover:text-sky-500 transition-colors mt-2">
        Read Full Blog Post
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

export default AIBlogCard;