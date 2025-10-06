import React from 'react';
import Header from '../../components/ui/Header';
import MetricsOverview from './components/MetricsOverview';
import EngagementChart from './components/EngagementChart';
import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import PlatformStatus from './components/PlatformStatus';
import ContentCalendarWidget from './components/ContentCalendarWidget';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, John! 👋
                </h1>
                <p className="text-muted-foreground mt-2">
                  Here's what's happening with your social media accounts today.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
                Last updated: {new Date()?.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="mb-8">
            <MetricsOverview />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Charts and Analytics */}
            <div className="lg:col-span-2 space-y-8">
              <EngagementChart />
              <PlatformStatus />
            </div>

            {/* Right Column - Activity and Actions */}
            <div className="space-y-8">
              <RecentActivity />
              <ContentCalendarWidget />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Footer Stats */}
          <div className="border-t border-border pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Connected Platforms</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-secondary">156</div>
                <div className="text-sm text-muted-foreground">Posts This Month</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-success">2.4M</div>
                <div className="text-sm text-muted-foreground">Total Reach</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-accent">4.8%</div>
                <div className="text-sm text-muted-foreground">Avg Engagement</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;