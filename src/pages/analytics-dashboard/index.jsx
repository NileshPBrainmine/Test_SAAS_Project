import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsOverview from './components/MetricsOverview';
import EngagementChart from './components/EngagementChart';
import TopPerformingContent from './components/TopPerformingContent';
import PlatformComparison from './components/PlatformComparison';
import BestTimePosting from './components/BestTimePosting';
import ExportPanel from './components/ExportPanel';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'facebook', 'linkedin', 'twitter']);
  const [dateRange, setDateRange] = useState('30d');
  const [comparisonMetric, setComparisonMetric] = useState('engagement');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for metrics overview
  const metricsData = [
    {
      id: 1,
      type: 'engagement',
      label: 'Total Engagement',
      value: 45672,
      previousValue: 38945,
      change: 17.3
    },
    {
      id: 2,
      type: 'reach',
      label: 'Total Reach',
      value: 234567,
      previousValue: 198432,
      change: 18.2
    },
    {
      id: 3,
      type: 'followers',
      label: 'New Followers',
      value: 1234,
      previousValue: 1456,
      change: -15.3
    },
    {
      id: 4,
      type: 'posts',
      label: 'Posts Published',
      value: 28,
      previousValue: 24,
      change: 16.7
    }
  ];

  // Mock data for engagement chart
  const engagementChartData = [
    { date: '2024-09-04', instagram: 2400, facebook: 1800, linkedin: 1200, twitter: 900 },
    { date: '2024-09-05', instagram: 2100, facebook: 1900, linkedin: 1100, twitter: 1100 },
    { date: '2024-09-06', instagram: 2800, facebook: 2200, linkedin: 1400, twitter: 800 },
    { date: '2024-09-07', instagram: 2600, facebook: 2100, linkedin: 1300, twitter: 1200 },
    { date: '2024-09-08', instagram: 3200, facebook: 2400, linkedin: 1600, twitter: 1000 },
    { date: '2024-09-09', instagram: 2900, facebook: 2300, linkedin: 1500, twitter: 1300 },
    { date: '2024-09-10', instagram: 3400, facebook: 2600, linkedin: 1700, twitter: 1100 },
    { date: '2024-09-11', instagram: 3100, facebook: 2500, linkedin: 1600, twitter: 1400 },
    { date: '2024-09-12', instagram: 3600, facebook: 2800, linkedin: 1800, twitter: 1200 },
    { date: '2024-09-13', instagram: 3300, facebook: 2700, linkedin: 1700, twitter: 1500 },
    { date: '2024-09-14', instagram: 3800, facebook: 3000, linkedin: 1900, twitter: 1300 },
    { date: '2024-09-15', instagram: 3500, facebook: 2900, linkedin: 1800, twitter: 1600 },
    { date: '2024-09-16', instagram: 4000, facebook: 3200, linkedin: 2000, twitter: 1400 },
    { date: '2024-09-17', instagram: 3700, facebook: 3100, linkedin: 1900, twitter: 1700 },
    { date: '2024-09-18', instagram: 4200, facebook: 3400, linkedin: 2100, twitter: 1500 },
    { date: '2024-09-19', instagram: 3900, facebook: 3300, linkedin: 2000, twitter: 1800 },
    { date: '2024-09-20', instagram: 4400, facebook: 3600, linkedin: 2200, twitter: 1600 },
    { date: '2024-09-21', instagram: 4100, facebook: 3500, linkedin: 2100, twitter: 1900 },
    { date: '2024-09-22', instagram: 4600, facebook: 3800, linkedin: 2300, twitter: 1700 },
    { date: '2024-09-23', instagram: 4300, facebook: 3700, linkedin: 2200, twitter: 2000 },
    { date: '2024-09-24', instagram: 4800, facebook: 4000, linkedin: 2400, twitter: 1800 },
    { date: '2024-09-25', instagram: 4500, facebook: 3900, linkedin: 2300, twitter: 2100 },
    { date: '2024-09-26', instagram: 5000, facebook: 4200, linkedin: 2500, twitter: 1900 },
    { date: '2024-09-27', instagram: 4700, facebook: 4100, linkedin: 2400, twitter: 2200 },
    { date: '2024-09-28', instagram: 5200, facebook: 4400, linkedin: 2600, twitter: 2000 },
    { date: '2024-09-29', instagram: 4900, facebook: 4300, linkedin: 2500, twitter: 2300 },
    { date: '2024-09-30', instagram: 5400, facebook: 4600, linkedin: 2700, twitter: 2100 },
    { date: '2024-10-01', instagram: 5100, facebook: 4500, linkedin: 2600, twitter: 2400 },
    { date: '2024-10-02', instagram: 5600, facebook: 4800, linkedin: 2800, twitter: 2200 },
    { date: '2024-10-03', instagram: 5300, facebook: 4700, linkedin: 2700, twitter: 2500 }
  ];

  // Mock data for top performing content
  const topPerformingPosts = [
    {
      id: 1,
      title: "Behind the scenes of our latest product launch - the team worked tirelessly to bring this vision to life!",
      platform: 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
      likes: 2847,
      comments: 156,
      shares: 89,
      reach: 15420,
      engagementRate: 18.5,
      publishedAt: '2024-10-02T14:30:00Z'
    },
    {
      id: 2,
      title: "Exciting news! We\'re expanding our services to three new markets this quarter. Here\'s what you need to know.",
      platform: 'linkedin',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
      likes: 1923,
      comments: 234,
      shares: 167,
      reach: 12890,
      engagementRate: 16.2,
      publishedAt: '2024-10-01T09:15:00Z'
    },
    {
      id: 3,
      title: "Customer spotlight: How Sarah transformed her business using our platform. Read her inspiring story!",
      platform: 'facebook',
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      likes: 1654,
      comments: 98,
      shares: 203,
      reach: 18750,
      engagementRate: 15.8,
      publishedAt: '2024-09-30T16:45:00Z'
    },
    {
      id: 4,
      title: "Quick tip Tuesday: 5 ways to boost your productivity using our latest features. Thread below 👇",
      platform: 'twitter',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop',
      likes: 892,
      comments: 67,
      shares: 145,
      reach: 8940,
      engagementRate: 14.3,
      publishedAt: '2024-09-29T11:20:00Z'
    },
    {
      id: 5,
      title: "Team building day was a huge success! Nothing beats good food, great games, and amazing colleagues.",
      platform: 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=400&fit=crop',
      likes: 1456,
      comments: 89,
      shares: 34,
      reach: 9870,
      engagementRate: 13.7,
      publishedAt: '2024-09-28T18:00:00Z'
    }
  ];

  // Mock data for platform comparison
  const platformComparisonData = [
    { platform: 'Instagram', value: 45672, change: 12.5 },
    { platform: 'Facebook', value: 38945, change: 8.3 },
    { platform: 'LinkedIn', value: 23456, change: 15.7 },
    { platform: 'Twitter', value: 18934, change: -3.2 }
  ];

  // Mock data for best time posting
  const bestTimeData = {
    heatmap: [
      {
        day: 'Mon',
        hours: [
          { hour: 0, engagement: 15 }, { hour: 2, engagement: 12 }, { hour: 4, engagement: 8 },
          { hour: 6, engagement: 25 }, { hour: 8, engagement: 45 }, { hour: 10, engagement: 65 },
          { hour: 12, engagement: 78 }, { hour: 14, engagement: 85 }, { hour: 16, engagement: 72 },
          { hour: 18, engagement: 68 }, { hour: 20, engagement: 55 }, { hour: 22, engagement: 35 }
        ]
      },
      {
        day: 'Tue',
        hours: [
          { hour: 0, engagement: 18 }, { hour: 2, engagement: 14 }, { hour: 4, engagement: 10 },
          { hour: 6, engagement: 28 }, { hour: 8, engagement: 48 }, { hour: 10, engagement: 68 },
          { hour: 12, engagement: 82 }, { hour: 14, engagement: 88 }, { hour: 16, engagement: 75 },
          { hour: 18, engagement: 71 }, { hour: 20, engagement: 58 }, { hour: 22, engagement: 38 }
        ]
      },
      {
        day: 'Wed',
        hours: [
          { hour: 0, engagement: 16 }, { hour: 2, engagement: 13 }, { hour: 4, engagement: 9 },
          { hour: 6, engagement: 26 }, { hour: 8, engagement: 46 }, { hour: 10, engagement: 66 },
          { hour: 12, engagement: 80 }, { hour: 14, engagement: 86 }, { hour: 16, engagement: 73 },
          { hour: 18, engagement: 69 }, { hour: 20, engagement: 56 }, { hour: 22, engagement: 36 }
        ]
      },
      {
        day: 'Thu',
        hours: [
          { hour: 0, engagement: 17 }, { hour: 2, engagement: 15 }, { hour: 4, engagement: 11 },
          { hour: 6, engagement: 29 }, { hour: 8, engagement: 49 }, { hour: 10, engagement: 69 },
          { hour: 12, engagement: 83 }, { hour: 14, engagement: 89 }, { hour: 16, engagement: 76 },
          { hour: 18, engagement: 72 }, { hour: 20, engagement: 59 }, { hour: 22, engagement: 39 }
        ]
      },
      {
        day: 'Fri',
        hours: [
          { hour: 0, engagement: 14 }, { hour: 2, engagement: 11 }, { hour: 4, engagement: 7 },
          { hour: 6, engagement: 23 }, { hour: 8, engagement: 43 }, { hour: 10, engagement: 63 },
          { hour: 12, engagement: 76 }, { hour: 14, engagement: 83 }, { hour: 16, engagement: 70 },
          { hour: 18, engagement: 66 }, { hour: 20, engagement: 53 }, { hour: 22, engagement: 33 }
        ]
      },
      {
        day: 'Sat',
        hours: [
          { hour: 0, engagement: 22 }, { hour: 2, engagement: 19 }, { hour: 4, engagement: 15 },
          { hour: 6, engagement: 35 }, { hour: 8, engagement: 55 }, { hour: 10, engagement: 75 },
          { hour: 12, engagement: 88 }, { hour: 14, engagement: 95 }, { hour: 16, engagement: 82 },
          { hour: 18, engagement: 78 }, { hour: 20, engagement: 65 }, { hour: 22, engagement: 45 }
        ]
      },
      {
        day: 'Sun',
        hours: [
          { hour: 0, engagement: 20 }, { hour: 2, engagement: 17 }, { hour: 4, engagement: 13 },
          { hour: 6, engagement: 33 }, { hour: 8, engagement: 53 }, { hour: 10, engagement: 73 },
          { hour: 12, engagement: 86 }, { hour: 14, engagement: 93 }, { hour: 16, engagement: 80 },
          { hour: 18, engagement: 76 }, { hour: 20, engagement: 63 }, { hour: 22, engagement: 43 }
        ]
      }
    ],
    top: [
      { day: 'Saturday', hour: 14, platform: 'Instagram', engagement: 95, improvement: 23 },
      { day: 'Sunday', hour: 14, platform: 'Facebook', engagement: 93, improvement: 21 },
      { day: 'Thursday', hour: 14, platform: 'LinkedIn', engagement: 89, improvement: 18 },
      { day: 'Saturday', hour: 12, platform: 'Twitter', engagement: 88, improvement: 16 }
    ]
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: 'Instagram', color: 'text-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: 'Facebook', color: 'text-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: 'text-blue-700' },
    { id: 'twitter', name: 'Twitter', icon: 'Twitter', color: 'text-blue-400' }
  ];

  const dateRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ];

  const comparisonMetrics = [
    { id: 'engagement', label: 'Engagement' },
    { id: 'reach', label: 'Reach' },
    { id: 'followers', label: 'Followers' },
    { id: 'engagement_rate', label: 'Engagement Rate' }
  ];

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => 
      prev?.includes(platformId) 
        ? prev?.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleExport = async (exportConfig) => {
    setIsLoading(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Exporting with config:', exportConfig);
    setIsLoading(false);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive insights into your social media performance across all platforms
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={handleRefreshData}
                loading={isLoading}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh Data
              </Button>
              <Button
                onClick={() => navigate('/content-creation')}
                iconName="Plus"
                iconPosition="left"
              >
                Create Content
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-elevation-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Platform Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground mr-2">Platforms:</span>
                {platforms?.map((platform) => (
                  <button
                    key={platform?.id}
                    onClick={() => handlePlatformToggle(platform?.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                      selectedPlatforms?.includes(platform?.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name={platform?.icon} size={16} />
                    <span>{platform?.name}</span>
                  </button>
                ))}
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">Period:</span>
                <div className="flex space-x-1">
                  {dateRanges?.map((range) => (
                    <button
                      key={range?.id}
                      onClick={() => setDateRange(range?.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                        dateRange === range?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {range?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <MetricsOverview 
            metrics={metricsData} 
            selectedPlatform={selectedPlatforms} 
            dateRange={dateRange} 
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Charts */}
            <div className="xl:col-span-2 space-y-8">
              {/* Engagement Chart */}
              <EngagementChart 
                data={engagementChartData} 
                selectedPlatforms={selectedPlatforms} 
              />

              {/* Platform Comparison */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Platform Comparison</h3>
                <div className="flex space-x-1">
                  {comparisonMetrics?.map((metric) => (
                    <button
                      key={metric?.id}
                      onClick={() => setComparisonMetric(metric?.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-smooth ${
                        comparisonMetric === metric?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {metric?.label}
                    </button>
                  ))}
                </div>
              </div>
              <PlatformComparison 
                data={platformComparisonData} 
                metric={comparisonMetric} 
              />

              {/* Best Time to Post */}
              <BestTimePosting recommendations={bestTimeData} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Top Performing Content */}
              <TopPerformingContent posts={topPerformingPosts} />

              {/* Export Panel */}
              <ExportPanel onExport={handleExport} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/content-creation')}
                iconName="PenTool"
                iconPosition="left"
                fullWidth
              >
                Create New Post
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/content-calendar')}
                iconName="Calendar"
                iconPosition="left"
                fullWidth
              >
                View Calendar
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/social-account-management')}
                iconName="Settings"
                iconPosition="left"
                fullWidth
              >
                Manage Accounts
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/team-collaboration')}
                iconName="Users"
                iconPosition="left"
                fullWidth
              >
                Team Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;