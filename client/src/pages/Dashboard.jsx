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
    <>
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">
        {/* ROW 1 */}
        <div className="col-span-1 md:col-span-8">
          <QuickLog />
        </div>
        <div className="col-span-1 md:col-span-4">
          <BMIWidget />
        </div>

        {/* ROW 2 */}
        <div className="col-span-1 md:col-span-8">
          <AIBlogCard />
        </div>
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <SleepTracker />
          <AllowanceCard />
        </div>

        {/* ROW 3 */}
        <div className="col-span-1 md:col-span-4">
          <TaskWidget />
        </div>
        <div className="col-span-1 md:col-span-4">
          <RecentLogs />
        </div>
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <div className="flex-1"><MealTracker /></div>
          <div className="flex-1"><WorkoutCard /></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;