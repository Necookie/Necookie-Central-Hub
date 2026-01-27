import React from 'react';
import MainLayout from './components/MainLayout';
import DashboardHeader from './components/dashboard/DashboardHeader';
import QuickLog from './components/dashboard/QuickLog';
import BMIWidget from './components/dashboard/BMIWidget';
import SleepTracker from './components/dashboard/SleepTracker';
import RecentLogs from './components/dashboard/RecentLogs';
import AIBlogCard from './components/dashboard/AIBlogCard';
import TaskWidget from './components/dashboard/TaskWidget';
import MealTracker from './components/dashboard/MealTracker';
import WorkoutCard from './components/dashboard/WorkoutCard';
import AllowanceCard from './components/dashboard/AllowanceCard';

function App() {
  return (
    <MainLayout>
      <DashboardHeader />

      {/* MAIN BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">
        
        {/* --- ROW 1: INPUTS & STATUS --- */}
        {/* Quick Log: The most frequent action (Spans 8 cols) */}
        <div className="col-span-1 md:col-span-8">
          <QuickLog />
        </div>
        
        {/* BMI Widget: High-level health status (Spans 4 cols) */}
        <div className="col-span-1 md:col-span-4">
          <BMIWidget />
        </div>


        {/* --- ROW 2: INTELLIGENCE & METRICS --- */}
        {/* AI Blog: The "Hero" content (Spans 8 cols) */}
        <div className="col-span-1 md:col-span-8">
          <AIBlogCard />
        </div>

        {/* Vertical Stack for Side Stats (Spans 4 cols) */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <SleepTracker />
          <AllowanceCard />
        </div>


        {/* --- ROW 3: TRACKING & MANAGEMENT --- */}
        {/* Task Manager: Manual To-Dos */}
        <div className="col-span-1 md:col-span-4">
          <TaskWidget />
        </div>

        {/* Live Feed: What's happening now */}
        <div className="col-span-1 md:col-span-4">
          <RecentLogs />
        </div>

        {/* Health Stack: Meals & Workout */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <div className="flex-1">
             <MealTracker />
          </div>
          <div className="flex-1">
             <WorkoutCard />
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default App;