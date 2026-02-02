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
    <div className="p-4 md:p-8 pb-24 space-y-6 max-w-[1600px] mx-auto">
      
      <DashboardHeader />

      {/* 2. THE GRID SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        
        {/* --- LEFT SECTION (Spans 3 cols on Desktop) --- */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* A. AI INSIGHT (Crucial Fix: min-h added) */}
          <div className="w-full min-h-[240px]">
            <AIBlogCard />
          </div>

          {/* B. KEY STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 min-h-[240px]">
               <AllowanceCard />
            </div>
            <div className="md:col-span-1 min-h-[240px]">
               <BMIWidget />
            </div>
          </div>

          {/* C. TRACKERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="min-h-[320px]">
              <SleepTracker />
            </div>
            <div className="min-h-[320px]">
              <ActivityTimer /> 
            </div>
          </div>

          {/* D. ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="min-h-[240px]">
                <MealTracker />
             </div>
             <div className="min-h-[240px]">
                <TaskWidget />
             </div>
             <div className="min-h-[240px]">
                <WorkoutCard />
             </div>
          </div>

        </div>

        {/* --- RIGHT SECTION (Side Feed) --- */}
        <div className="lg:col-span-1 lg:h-full">
          <div className="h-[500px] lg:h-full lg:sticky lg:top-6">
            <RecentLogs />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;