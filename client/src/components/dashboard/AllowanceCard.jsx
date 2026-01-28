import React from 'react';

const AllowanceCard = () => {
  // Professional Currency Formatting
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  });

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-sm h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Allowance</p>
          <h2 className="text-2xl font-mono text-slate-800">{formatter.format(1300)}</h2>
        </div>
        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 border border-emerald-100">
          <span className="text-xs font-bold font-mono">+100%</span>
        </div>
      </div>
      
      {/* Spending Graph */}
      <div className="mt-6 flex items-end gap-1 h-12">
        <div className="w-1/5 bg-slate-100 h-[40%] rounded-t-sm" />
        <div className="w-1/5 bg-slate-100 h-[60%] rounded-t-sm" />
        <div className="w-1/5 bg-slate-100 h-[30%] rounded-t-sm" />
        <div className="w-1/5 bg-slate-100 h-[80%] rounded-t-sm" />
        <div className="w-1/5 bg-emerald-400 h-[100%] rounded-t-sm shadow-sm" />
      </div>
      <p className="text-slate-400 text-[10px] mt-2 text-center">Weekly Spending Trend</p>
    </div>
  );
};

export default AllowanceCard;