import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import AllowanceCard from '../components/dashboard/AllowanceCard';
import BMIWidget from '../components/dashboard/BMIWidget';
import MealTracker from '../components/dashboard/MealTracker';
import SleepTracker from '../components/dashboard/SleepTracker';
import WorkoutCard from '../components/dashboard/WorkoutCard';
import ActivityTimer from '../components/dashboard/ActivityTimer';
import TaskWidget from '../components/dashboard/TaskWidget';
import RecentLogs from '../components/dashboard/RecentLogs';
import AIBlogCard from '../components/dashboard/AIBlogCard';

const Dashboard = () => {
  return (
    <div className="pb-10 space-y-6">
      
      {/* 1. Header */}
      <DashboardHeader />

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN (Wider) */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          
          {/* ROW 1: AI Insight */}
          {/* Mobile: Auto height | Desktop: Fixed 48 (192px) */}
          <div className="h-auto md:h-48">
            <AIBlogCard />
          </div>

          {/* ROW 2: Key Stats */}
          {/* Mobile: Auto height | Desktop: Fixed 64 (256px) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-64">
            <div className="md:col-span-2 min-h-[200px]">
               <AllowanceCard />
            </div>
            <div className="md:col-span-1 min-h-[200px]">
               <BMIWidget />
            </div>
          </div>

          {/* ROW 3: Trackers */}
          {/* Mobile: Auto height | Desktop: Fixed 80 (320px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-80">
            <div className="min-h-[300px] md:min-h-0">
              <SleepTracker />
            </div>
            <div className="min-h-[300px] md:min-h-0">
              <ActivityTimer /> 
            </div>
          </div>

          {/* ROW 4: Actions */}
          {/* Mobile: Auto height | Desktop: Fixed 64 (256px) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-64">
             <div className="md:col-span-1 min-h-[220px]">
                <MealTracker />
             </div>
             <div className="md:col-span-1 min-h-[220px]">
                <TaskWidget />
             </div>
             <div className="md:col-span-1 min-h-[220px]">
                <WorkoutCard />
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Tall Sidebar) */}
        {/* Mobile: Fixed Height 500px | Desktop: Full Height */}
        <div className="md:col-span-1 lg:col-span-1 h-[500px] md:h-full md:min-h-[500px]">
          <RecentLogs />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;