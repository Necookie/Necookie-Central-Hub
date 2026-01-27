import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import MainLayout from './components/MainLayout';
import { Zap } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import History from './pages/History';
import Diary from './pages/Diary';
import Vault from './pages/Vault';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Setup the listener FIRST (This catches the token exchange)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false); // Stop loading only when we get a definitive answer
    });

    // 2. Check current status
    // Hack: If there is a hash in the URL, we might be in the middle of a login.
    // So we don't assume "No Session" yet. We let onAuthStateChange handle it.
    const isRedirectLink = window.location.hash.includes("access_token");

    if (!isRedirectLink) {
       supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
           // Only stop loading if we definitely aren't waiting for a redirect
           setLoading(false);
        }
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="animate-spin text-sky-500">
             <Zap size={48} fill="currentColor" />
           </div>
           <p className="text-slate-400 text-sm font-mono animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        
        <Route
          path="/*"
          element={
            session ? (
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/diary" element={<Diary />} />
                  <Route path="/vault" element={<Vault />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;