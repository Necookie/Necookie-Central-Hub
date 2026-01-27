import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Diary from './pages/Diary';
import Vault from './pages/Vault';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/vault" element={<Vault />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;