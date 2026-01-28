import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <--- IMPORTANT
import MainLayout from './components/MainLayout';
import { Zap } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import History from './pages/History';
import Diary from './pages/Diary';
import Vault from './pages/Vault';

const queryClient = new QueryClient(); // The Data Brain

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin text-sky-500"><Zap size={48} fill="currentColor" /></div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/*" element={session ? (
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/diary" element={<Diary />} />
                  <Route path="/vault" element={<Vault />} />
                </Routes>
              </MainLayout>
            ) : (<Navigate to="/login" />)} 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;