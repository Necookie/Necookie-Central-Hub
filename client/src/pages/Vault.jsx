import React from 'react';
import { Lock } from 'lucide-react';

const Vault = () => (
  <div className="h-full flex flex-col items-center justify-center text-slate-400">
    <div className="bg-slate-100 p-6 rounded-full mb-6">
      <Lock size={48} className="text-slate-300" />
    </div>
    <h2 className="text-xl font-bold text-slate-600 mb-2">Private Vault Locked</h2>
    <p className="text-sm">Please authenticate to view sensitive logs.</p>
  </div>
);
export default Vault;