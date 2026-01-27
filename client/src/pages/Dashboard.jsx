import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import QuickLog from '../components/dashboard/QuickLog';
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
    <div className="flex flex-col h-full">
      {/* 1. THE HEADER */}
      <DashboardHeader />

      {/* 2. THE MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 px-2 md:px-0">
        
        {/* --- ROW 1: INPUTS & STATUS --- */}
        {/* Quick Log (Spans 8 cols) */}
        <div className="col-span-1 md:col-span-8 h-full">
          <QuickLog />
        </div>
        
        {/* BMI Widget (Spans 4 cols) */}
        <div className="col-span-1 md:col-span-4 h-full">
          <BMIWidget />
        </div>


        {/* --- ROW 2: INTELLIGENCE & METRICS --- */}
        {/* AI Blog (Spans 8 cols) */}
        <div className="col-span-1 md:col-span-8 h-full">
          <AIBlogCard />
        </div>

        {/* Side Stats Stack (Spans 4 cols) */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6 h-full">
          <SleepTracker />
          <AllowanceCard />
        </div>


        {/* --- ROW 3: TRACKING & MANAGEMENT --- */}
        {/* Task Manager */}
        <div className="col-span-1 md:col-span-4 h-full">
          <TaskWidget />
        </div>

        {/* Live Feed Terminal */}
        <div className="col-span-1 md:col-span-4 h-full">
          <RecentLogs />
        </div>

        {/* Health Stack (Meals & Workout) */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6 h-full">
          <div className="flex-1">
             <MealTracker />
          </div>
          <div className="flex-1">
             <WorkoutCard />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;