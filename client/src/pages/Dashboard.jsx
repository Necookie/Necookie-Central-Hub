import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import BMIWidget from '../components/dashboard/BMIWidget';
import SleepTracker from '../components/dashboard/SleepTracker';
import RecentLogs from '../components/dashboard/RecentLogs';
import AIBlogCard from '../components/dashboard/AIBlogCard';
import ActivityTimer from '../components/dashboard/ActivityTimer'; // Updated import
import TaskWidget from '../components/dashboard/TaskWidget'; // Keep this too
import MealTracker from '../components/dashboard/MealTracker';
import WorkoutCard from '../components/dashboard/WorkoutCard';
import AllowanceCard from '../components/dashboard/AllowanceCard';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 px-2 md:px-0 max-w-7xl mx-auto w-full">
        {/* ROW 1 */}
        <div className="col-span-1 md:col-span-8 h-full min-h-[300px]"><AIBlogCard /></div>
        <div className="col-span-1 md:col-span-4 h-full"><BMIWidget /></div>

        {/* ROW 2 */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6 h-full"><SleepTracker /><AllowanceCard /></div>
        <div className="col-span-1 md:col-span-4 h-full"><ActivityTimer /></div>
        <div className="col-span-1 md:col-span-4 h-full"><RecentLogs /></div>

        {/* ROW 3 - Optional: Add TaskWidget back if you want a separate column, or just stick to Header logging */}
        <div className="col-span-1 md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-full"><MealTracker /></div>
          <div className="h-full"><WorkoutCard /></div>
          <div className="h-full"><TaskWidget /></div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;