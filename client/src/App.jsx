import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import MainLayout from './components/MainLayout';
import { Zap } from 'lucide-react';

// Pages
import Landing from './pages/Landing'; // <--- NEW IMPORT
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import History from './pages/History';
import Diary from './pages/Diary';
import Vault from './pages/Vault';
import Finance from './pages/finance'; 

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Check active session on load
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
          
          {/* 1. PUBLIC LANDING PAGE (Root) */}
          {/* If logged out: Show Landing. If logged in: Go straight to Dashboard. */}
          <Route path="/" element={!session ? <Landing /> : <Navigate to="/dashboard" />} />

          {/* 2. LOGIN PAGE */}
          {/* If logged out: Show Login. If logged in: Go straight to Dashboard. */}
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />

          {/* 3. PROTECTED APP ROUTES */}
          {/* Catches /dashboard, /finance, etc. */}
          <Route path="/*" element={session ? (
              <MainLayout>
                <Routes>
                  {/* The main view is now at /dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Handle sidebar links that might still point to "/" */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/history" element={<History />} />
                  <Route path="/diary" element={<Diary />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/vault" element={<Vault />} />
                  
                  {/* Catch 404s inside the app and send to Dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              // If trying to access app while logged out -> Login
              <Navigate to="/login" />
            )} 
          />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;