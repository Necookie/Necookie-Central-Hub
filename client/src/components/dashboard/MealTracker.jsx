import React, { useState } from 'react';
import { Utensils, Flame, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';

const MealTracker = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newMeal, setNewMeal] = useState({ meal_name: '', calories: '' });

  const { data: meals = [] } = useQuery({ queryKey: ['meals'], queryFn: api.fetchMeals });

  const addMutation = useMutation({
    mutationFn: api.addMeal,
    onSuccess: () => {
      queryClient.invalidateQueries(['meals']);
      queryClient.invalidateQueries(['history']);
      setIsAdding(false);
      setNewMeal({ meal_name: '', calories: '' });
    }
  });

  const totalCals = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const GOAL = 2200;
  const progress = Math.min((totalCals / GOAL) * 100, 100);

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Calories</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-mono text-slate-800">{totalCals.toLocaleString()}</h2>
            <span className="text-xs text-slate-400 font-mono">/ {GOAL}</span>
          </div>
        </div>
        <div className="bg-orange-50 p-2 rounded-lg text-orange-500"><Flame size={20} /></div>
      </div>

      <div className="flex-1 mt-4 overflow-y-auto custom-scrollbar max-h-[120px]">
        {isAdding ? (
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-bold text-slate-400 uppercase">New Meal</span>
               <button onClick={() => setIsAdding(false)}><X size={14} className="text-slate-400" /></button>
            </div>
            <input type="text" placeholder="Meal Name" value={newMeal.meal_name} autoFocus onChange={(e) => setNewMeal({...newMeal, meal_name: e.target.value})} className="w-full text-xs p-2 rounded border border-slate-200 outline-none focus:border-orange-400"/>
            <div className="flex gap-2">
              <input type="number" placeholder="Kcal" value={newMeal.calories} onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})} className="w-20 text-xs p-2 rounded border border-slate-200 outline-none focus:border-orange-400"/>
              <button onClick={() => addMutation.mutate({ meal_name: newMeal.meal_name, calories: parseInt(newMeal.calories) })} className="flex-1 bg-slate-900 text-white text-xs rounded font-bold hover:bg-slate-800">{addMutation.isPending ? '...' : 'Add'}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.length === 0 ? <p className="text-xs text-slate-400 italic text-center mt-4">No meals today.</p> : 
               meals.map(meal => (
                <div key={meal.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /><span className="text-slate-600 truncate max-w-[100px]">{meal.meal_name}</span></div>
                  <span className="font-mono text-slate-400">{meal.calories}</span>
                </div>
               ))
            }
            <button onClick={() => setIsAdding(true)} className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors"><Plus size={14} /> Add Meal</button>
          </div>
        )}
      </div>
      <div className="mt-4"><div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-orange-400 transition-all duration-500" style={{ width: `${progress}%` }} /></div></div>
    </div>
  );
};
export default MealTracker;