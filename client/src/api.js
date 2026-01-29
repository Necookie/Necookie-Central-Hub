import { supabase } from './supabaseClient';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No user logged in");
  return user;
};

const getLocalYYYYMMDD = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const api = {
  // --- AI INTELLIGENCE ---
  fetchLatestSummary: async () => {
    const user = await getUser();
    const today = getLocalYYYYMMDD(); 
    
    const { data } = await supabase
      .from('daily_summaries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today) 
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    return data;
  },

  generateDailySummary: async () => {
    console.log("🧠 GATHERING DATA FOR AI...");
    const user = await getUser();
    
    // 1. Fetch History
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); 
    
    const { data: history } = await supabase
      .from('unified_history')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', startOfDay.toISOString())
      .order('timestamp', { ascending: true });

    if (!history || history.length === 0) {
        console.warn("⚠️ No history found today.");
        return;
    }

    // 2. Format Data
    const activityLog = history.map(h => 
      `- [${new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}] ${h.type.toUpperCase()}: ${h.content} ${h.secondary_info ? `(${h.secondary_info})` : ''}`
    ).join('\n');

    console.log("📝 SENDING CONTEXT TO AI:\n", activityLog);

    // 3. Prompt
    const prompt = `
      You are Dheyn's personal AI life narrator.
      Here is his ENTIRE activity log for today (from 12:00 AM to now):
      ${activityLog}
      
      INSTRUCTIONS:
      1. Analyze Mood (Journal), Diet (Meals), and Productivity (Tasks/Sessions).
      2. Write a short, witty, "Blog-Style" daily recap (max 3-4 sentences).
      TONE: Gen-Z, unfiltered, supportive but real. Use emojis.
    `;

    try {
      const response = await fetch('/api/openai/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error(`AI Request Failed`);
      
      const aiData = await response.json();
      const summaryText = aiData.choices[0].message.content;

      await supabase.from('daily_summaries').insert([
        { user_id: user.id, content: summaryText, date: getLocalYYYYMMDD() }
      ]);
      
      return summaryText;
    } catch (error) {
      console.error("❌ AI Generation Error:", error);
      return null;
    }
  },

  // --- STANDARD FETCHES ---
  fetchUnifiedHistory: async (limit = 50) => {
    const { data } = await supabase.from('unified_history').select('*').order('timestamp', { ascending: false }).limit(limit);
    return data;
  },
  
  fetchMeals: async () => {
    const user = await getUser();
    const today = new Date(); today.setHours(0,0,0,0);
    const { data } = await supabase.from('meals').select('*').eq('user_id', user.id).gte('created_at', today.toISOString()).order('created_at', { ascending: false });
    return data;
  },
  
  addMeal: async ({ meal_name, calories }) => {
    const user = await getUser();
    return supabase.from('meals').insert([{ user_id: user.id, meal_name, calories }]);
  },

  fetchTasks: async () => {
    const user = await getUser();
    const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('completed', { ascending: true }).order('created_at', { ascending: false });
    return data;
  },

  addTask: async (description) => {
    const user = await getUser();
    return supabase.from('tasks').insert([{ user_id: user.id, description, completed: false }]);
  },

  toggleTask: async ({ id, status }) => {
    return supabase.from('tasks').update({ completed: status }).eq('id', id);
  },

  deleteTask: async (id) => {
    return supabase.from('tasks').delete().eq('id', id);
  },

  logWorkout: async ({ type, distance_km, duration_mins }) => {
    const user = await getUser();
    return supabase.from('exercise').insert([{ user_id: user.id, type, distance_km, duration_mins, calories_burned: duration_mins * 8 }]);
  },

  // --- SESSIONS & SLEEP ---
  fetchActiveSession: async () => {
    const user = await getUser();
    const { data } = await supabase.from('activity_sessions').select('*').eq('user_id', user.id).is('end_time', null).maybeSingle();
    return data;
  },

  startSession: async (activity_name) => {
    const user = await getUser();
    return supabase.from('activity_sessions').insert([{ user_id: user.id, activity_name }]).select().single();
  },

  stopSession: async ({ id, start_time, comments }) => {
    const endTime = new Date();
    const startTime = new Date(start_time);
    const durationSecs = Math.floor((endTime - startTime) / 1000);
    return supabase.from('activity_sessions').update({ end_time: endTime.toISOString(), duration_seconds: durationSecs, comments }).eq('id', id);
  },

  fetchSleepLogs: async () => {
    const user = await getUser();
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data } = await supabase.from('sleep_logs').select('*').eq('user_id', user.id).gte('bed_time', sevenDaysAgo.toISOString()).order('bed_time', { ascending: true });
    return data;
  },

  fetchActiveSleep: async () => {
    const user = await getUser();
    const { data } = await supabase.from('sleep_logs').select('*').eq('user_id', user.id).is('wake_time', null).maybeSingle();
    return data;
  },

  startSleep: async () => {
    const user = await getUser();
    return supabase.from('sleep_logs').insert([{ user_id: user.id, bed_time: new Date().toISOString() }]);
  },

  wakeUp: async ({ id, bed_time }) => {
    const wakeTime = new Date();
    const start = new Date(bed_time);
    let durationMins = Math.floor((wakeTime - start) / 60000);
    if (durationMins > 20) durationMins -= 15; 
    return supabase.from('sleep_logs').update({ wake_time: wakeTime.toISOString(), duration_minutes: durationMins }).eq('id', id);
  },

  // --- JOURNAL & PRIVATE ---
  fetchJournal: async () => {
    const user = await getUser();
    const { data } = await supabase.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    return data;
  },

  addJournalEntry: async ({ content, mood }) => {
    const user = await getUser();
    return supabase.from('journal_entries').insert([{ user_id: user.id, content, mood }]);
  },

  deleteJournalEntry: async (id) => {
    return supabase.from('journal_entries').delete().eq('id', id);
  },

  fetchPrivateLogs: async () => {
    const user = await getUser();
    const { data } = await supabase.from('private_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    return data;
  },

  // --- FINANCE / BANKING SYSTEM (NEW) ---
  fetchFinanceRecords: async () => {
    const user = await getUser();
    const { data } = await supabase
      .from('finance_records')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    return data;
  },

  addFinanceRecord: async ({ type, amount, category, description, date }) => {
    const user = await getUser();
    return supabase.from('finance_records').insert([{ 
      user_id: user.id, 
      type, 
      amount, 
      category, 
      description, 
      date 
    }]).select();
  },

  deleteFinanceRecord: async (id) => {
    return supabase.from('finance_records').delete().eq('id', id);
  }
};