import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
// import QuickLog from '../components/dashboard/QuickLog'; // Removed!
import BMIWidget from '../components/dashboard/BMIWidget';
import SleepTracker from '../components/dashboard/SleepTracker';
import RecentLogs from '../components/dashboard/RecentLogs';
import AIBlogCard from '../components/dashboard/AIBlogCard';
import TaskWidget from '../components/dashboard/TaskWidget';
import MealTracker from '../components/dashboard/MealTracker';
import WorkoutCard from '../components/dashboard/WorkoutCard';
import AllowanceCard from '../components/dashboard/AllowanceCard';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* 1. THE HEADER (Now contains the Smart Input) */}
      <DashboardHeader />

      {/* 2. THE MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 px-2 md:px-0 max-w-7xl mx-auto w-full">
        
        {/* --- ROW 1: INTELLIGENCE & HEALTH --- */}
        {/* AI Insight (Takes the spot of old QuickLog) */}
        <div className="col-span-1 md:col-span-8 h-full min-h-[300px]">
          <AIBlogCard />
        </div>
        
        {/* BMI & Quick Stats */}
        <div className="col-span-1 md:col-span-4 h-full">
          <BMIWidget />
        </div>


        {/* --- ROW 2: SIDE STATS & TRACKING --- */}
        {/* Sleep & Money */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6 h-full">
          <SleepTracker />
          <AllowanceCard />
        </div>

        {/* Task Manager */}
        <div className="col-span-1 md:col-span-4 h-full">
          <TaskWidget />
        </div>

        {/* Live Feed */}
        <div className="col-span-1 md:col-span-4 h-full">
          <RecentLogs />
        </div>


        {/* --- ROW 3: PHYSICAL HEALTH --- */}
        {/* Full width split for Meals/Workouts */}
        <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-full">
             <MealTracker />
          </div>
          <div className="h-full">
             <WorkoutCard />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;