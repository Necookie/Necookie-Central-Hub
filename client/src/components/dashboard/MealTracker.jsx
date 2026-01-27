import React, { useState, useEffect } from 'react';
import { Utensils, Flame, Plus, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const MealTracker = () => {
  const [meals, setMeals] = useState([]);
  const [totalCals, setTotalCals] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");

  useEffect(() => {
    fetchTodayMeals();
  }, []);

  const fetchTodayMeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get start/end of today in UTC to filter correctly
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMeals(data);
      const total = data.reduce((acc, curr) => acc + curr.calories, 0);
      setTotalCals(total);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async () => {
    if (!mealName || !calories) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('meals').insert([{
        user_id: user.id,
        meal_name: mealName,
        calories: parseInt(calories)
      }]);

      if (error) throw error;
      
      setIsAdding(false);
      setMealName("");
      setCalories("");
      fetchTodayMeals();
    } catch (error) {
      alert("Failed to add meal");
    }
  };

  const calorieGoal = 2200; // Hardcoded goal for now
  const progress = Math.min((totalCals / calorieGoal) * 100, 100);

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between relative">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Calories</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-mono text-slate-800">{totalCals.toLocaleString()}</h2>
            <span className="text-xs text-slate-400 font-mono">/ {calorieGoal} kcal</span>
          </div>
        </div>
        <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
          <Flame size={20} />
        </div>
      </div>

      {/* Content Area: List or Input Form */}
      <div className="flex-1 mt-4 overflow-y-auto custom-scrollbar max-h-[120px]">
        {isAdding ? (
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-bold text-slate-400 uppercase">New Meal</span>
               <button onClick={() => setIsAdding(false)}><X size={14} className="text-slate-400" /></button>
            </div>
            <input 
              type="text" 
              placeholder="Meal Name (e.g. Adobo)" 
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="w-full text-xs p-2 rounded border border-slate-200"
            />
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Kcal" 
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-20 text-xs p-2 rounded border border-slate-200"
              />
              <button 
                onClick={addMeal}
                className="flex-1 bg-slate-900 text-white text-xs rounded font-bold hover:bg-slate-800"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.length === 0 ? (
               <p className="text-xs text-slate-400 italic text-center mt-4">No meals logged today.</p>
            ) : (
               meals.map(meal => (
                <div key={meal.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="text-slate-600 truncate max-w-[100px]">{meal.meal_name}</span>
                  </div>
                  <span className="font-mono text-slate-400">{meal.calories}</span>
                </div>
               ))
            )}
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs hover:border-orange-300 hover:text-orange-500 transition-colors"
            >
              <Plus size={14} />
              Add Meal
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-orange-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default MealTracker;