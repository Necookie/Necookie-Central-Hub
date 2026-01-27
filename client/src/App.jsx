import React from 'react';
import MainLayout from './components/MainLayout';
import DashboardHeader from './components/dashboard/DashboardHeader';
import QuickLog from './components/dashboard/QuickLog';
import SleepTracker from './components/dashboard/SleepTracker';
import RecentLogs from './components/dashboard/RecentLogs';
import AIBlogCard from './components/dashboard/AIBlogCard';
import AllowanceCard from './components/dashboard/AllowanceCard';

function App() {
  return (
    <MainLayout>
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Top Row: Quick Log (8) & Sleep (4) */}
        <div className="col-span-1 md:col-span-8">
          <QuickLog />
        </div>
        <div className="col-span-1 md:col-span-4">
          <SleepTracker />
        </div>

        {/* Middle/Bottom Row: Terminal (4) & AI Blog (8) & Allowance (4) */}
        {/* Note: RecentLogs spans 2 rows visually in the previous design, 
            so we use row-span-2 here if we want it tall */}
        
        <div className="col-span-1 md:col-span-4 row-span-2">
          <RecentLogs />
        </div>

        <div className="col-span-1 md:col-span-8">
          <AIBlogCard />
        </div>

        <div className="col-span-1 md:col-span-4">
          <AllowanceCard />
        </div>
        
        {/* If you want Allowance to sit under AIBlogCard, 
            you might need to adjust the grid flow or container logic 
            depending on exact placement preference. */}
            
      </div>
    </MainLayout>
  );
}

export default App;