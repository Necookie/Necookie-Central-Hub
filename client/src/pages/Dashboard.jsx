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
          
          {/* ROW 1: AI Insight (Daily Briefing) */}
          <div className="h-48">
            <AIBlogCard />
          </div>

          {/* ROW 2: Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
            <div className="md:col-span-2">
               <AllowanceCard />
            </div>
            <div className="md:col-span-1">
               <BMIWidget />
            </div>
          </div>

          {/* ROW 3: Trackers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
            <SleepTracker />
            <ActivityTimer /> 
          </div>

          {/* ROW 4: Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
             <div className="md:col-span-1">
                <MealTracker />
             </div>
             <div className="md:col-span-1">
                <TaskWidget />
             </div>
             <div className="md:col-span-1">
                <WorkoutCard />
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Tall Sidebar) */}
        <div className="md:col-span-1 lg:col-span-1 h-full min-h-[500px]">
          <RecentLogs />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;