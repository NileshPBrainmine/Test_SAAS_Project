import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, Download, Plus, ExternalLink, AlertTriangle } from 'lucide-react';
import { LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabaseService } from '../../utils/supabaseService';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for preview mode
const mockPerformanceData = [
  { date: '2025-01-03', platform: 'Facebook Ads', impressions: 12500, clicks: 438, conversions: 23, spend: 125.50, revenue: 1150.00, ctr: 3.5, roas: 9.16 },
  { date: '2025-01-02', platform: 'Facebook Ads', impressions: 11200, clicks: 392, conversions: 19, spend: 118.20, revenue: 950.00, ctr: 3.5, roas: 8.04 },
  { date: '2025-01-01', platform: 'Facebook Ads', impressions: 10800, clicks: 367, conversions: 21, spend: 112.40, revenue: 1050.00, ctr: 3.4, roas: 9.34 },
  { date: '2025-01-03', platform: 'Google Ads', impressions: 8900, clicks: 356, conversions: 28, spend: 168.75, revenue: 1400.00, ctr: 4.0, roas: 8.30 },
  { date: '2025-01-02', platform: 'Google Ads', impressions: 8100, clicks: 324, conversions: 25, spend: 162.50, revenue: 1250.00, ctr: 4.0, roas: 7.69 },
  { date: '2025-01-01', platform: 'Google Ads', impressions: 7800, clicks: 312, conversions: 22, spend: 156.00, revenue: 1100.00, ctr: 4.0, roas: 7.05 },
];

const mockAdAccounts = [
  { id: 1, platform: 'Facebook Ads', account_name: 'Main Facebook Ad Account', status: 'connected', spend_today: 125.50, campaigns: 3 },
  { id: 2, platform: 'Google Ads', account_name: 'Primary Google Ads Account', status: 'connected', spend_today: 168.75, campaigns: 2 },
  { id: 3, platform: 'LinkedIn Ads', account_name: 'LinkedIn Business Account', status: 'disconnected', spend_today: 0, campaigns: 0 },
  { id: 4, platform: 'Twitter Ads', account_name: 'Twitter Ads Manager', status: 'disconnected', spend_today: 0, campaigns: 0 },
];

const mockCampaignData = [
  { name: 'Brand Awareness', platform: 'Facebook', spend: 245.50, conversions: 42, roas: 8.5, status: 'Active' },
  { name: 'Lead Generation', platform: 'Google', spend: 387.25, conversions: 53, roas: 7.2, status: 'Active' },
  { name: 'Product Sales', platform: 'Facebook', spend: 156.75, conversions: 28, roas: 12.3, status: 'Active' },
  { name: 'Retargeting', platform: 'Google', spend: 98.40, conversions: 15, roas: 6.8, status: 'Paused' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdPerformanceAnalytics = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['all']);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    } else {
      // Use mock data for preview
      setPerformanceData(mockPerformanceData);
      setAdAccounts(mockAdAccounts);
      setCampaignData(mockCampaignData);
      setLoading(false);
    }
  }, [user, selectedDateRange, selectedPlatforms]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load ad accounts
      const accountsResult = await supabaseService?.from('ad_accounts')?.select('*')?.eq('is_active', true);

      if (accountsResult?.data) {
        setAdAccounts(accountsResult?.data);
        setIsPreviewMode(false);
      } else {
        // Fallback to mock data
        setAdAccounts(mockAdAccounts);
        setIsPreviewMode(true);
      }

      // Load performance data
      const performanceResult = await supabaseService?.from('ad_performance')?.select(`
          *,
          ad_accounts!inner(platform, account_name),
          ad_campaigns(campaign_name)
        `)?.gte('date', getDateRange(selectedDateRange));

      if (performanceResult?.data && performanceResult?.data?.length > 0) {
        setPerformanceData(performanceResult?.data);
      } else {
        setPerformanceData(mockPerformanceData);
      }

      // Load campaign data
      const campaignsResult = await supabaseService?.from('ad_campaigns')?.select(`
          *,
          ad_accounts!inner(platform, account_name),
          ad_performance!inner(spend, conversions)
        `);

      if (campaignsResult?.data && campaignsResult?.data?.length > 0) {
        const processedCampaigns = campaignsResult?.data?.map(campaign => ({
          name: campaign?.campaign_name,
          platform: campaign?.ad_accounts?.platform,
          spend: campaign?.ad_performance?.reduce((sum, p) => sum + parseFloat(p?.spend || 0), 0),
          conversions: campaign?.ad_performance?.reduce((sum, p) => sum + parseInt(p?.conversions || 0), 0),
          roas: campaign?.ad_performance?.reduce((sum, p) => sum + parseFloat(p?.roas || 0), 0) / campaign?.ad_performance?.length,
          status: campaign?.status === 'active' ? 'Active' : 'Paused'
        }));
        setCampaignData(processedCampaigns);
      } else {
        setCampaignData(mockCampaignData);
      }

    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Fallback to mock data on error
      setPerformanceData(mockPerformanceData);
      setAdAccounts(mockAdAccounts);
      setCampaignData(mockCampaignData);
      setIsPreviewMode(true);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range) => {
    const today = new Date();
    const daysAgo = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }?.[range] || 7;
    
    const startDate = new Date(today);
    startDate?.setDate(today?.getDate() - daysAgo);
    return startDate?.toISOString()?.split('T')?.[0];
  };

  const calculateTotals = () => {
    const totals = performanceData?.reduce((acc, item) => ({
      impressions: acc?.impressions + (item?.impressions || 0),
      clicks: acc?.clicks + (item?.clicks || 0),
      conversions: acc?.conversions + (item?.conversions || 0),
      spend: acc?.spend + parseFloat(item?.spend || 0),
      revenue: acc?.revenue + parseFloat(item?.revenue || 0)
    }), { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });

    return {
      ...totals,
      ctr: totals?.impressions > 0 ? ((totals?.clicks / totals?.impressions) * 100)?.toFixed(2) : '0.00',
      roas: totals?.spend > 0 ? (totals?.revenue / totals?.spend)?.toFixed(2) : '0.00',
      conversionRate: totals?.clicks > 0 ? ((totals?.conversions / totals?.clicks) * 100)?.toFixed(2) : '0.00'
    };
  };

  const totals = calculateTotals();

  const connectAdAccount = (platform) => {
    // In a real app, this would initiate OAuth flow for the respective platform
    alert(`Connecting to ${platform}... (This would open OAuth flow in a real implementation)`);
    setShowConnectModal(false);
  };

  const exportData = () => {
    const csvContent = performanceData?.map(row => 
      Object.values(row)?.join(',')
    )?.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ad-performance-${selectedDateRange}.csv`;
    a?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ad Performance Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive advertising campaign insights across all platforms</p>
            {isPreviewMode && (
              <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full inline-block">
                Preview Mode - Connect your ad accounts to see real data
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e?.target?.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Connect Ad Account
            </button>
            
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Spend</p>
              <p className="text-2xl font-bold text-gray-900">${totals?.spend?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <DollarSign className="text-red-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">+12.5%</span>
            <span className="text-gray-500 text-sm">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totals?.revenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">+18.2%</span>
            <span className="text-gray-500 text-sm">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">ROAS</p>
              <p className="text-2xl font-bold text-gray-900">{totals?.roas || '0.00'}x</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">+5.8%</span>
            <span className="text-gray-500 text-sm">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Conversions</p>
              <p className="text-2xl font-bold text-gray-900">{totals?.conversions?.toLocaleString() || '0'}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">+22.1%</span>
            <span className="text-gray-500 text-sm">vs last period</span>
          </div>
        </div>
      </div>
      {/* Connected Ad Accounts Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Connected Ad Accounts</h2>
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adAccounts?.map((account) => (
            <div key={account?.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    account?.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="font-medium text-gray-900">{account?.platform}</span>
                </div>
                {account?.status === 'connected' && (
                  <ExternalLink size={16} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{account?.account_name}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Today's Spend</p>
                  <p className="font-semibold text-gray-900">${account?.spend_today?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Campaigns</p>
                  <p className="font-semibold text-gray-900">{account?.campaigns || 0}</p>
                </div>
              </div>
              
              {account?.status === 'disconnected' && (
                <button
                  onClick={() => connectAdAccount(account?.platform)}
                  className="w-full mt-3 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Connect Account
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Performance Trends</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">Spend</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Revenue</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">ROAS</button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} name="Spend ($)" />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Revenue ($)" />
            <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#3b82f6" strokeWidth={2} name="ROAS (x)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Platform Performance & Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Platform Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Performance</h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={performanceData?.reduce((acc, item) => {
                  const platform = item?.platform || 'Unknown';
                  const existing = acc?.find(p => p?.platform === platform);
                  if (existing) {
                    existing.spend += parseFloat(item?.spend || 0);
                  } else {
                    acc?.push({ platform, spend: parseFloat(item?.spend || 0) });
                  }
                  return acc;
                }, [])}
                dataKey="spend"
                nameKey="platform"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {performanceData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value?.toFixed(2)}`, 'Spend']} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Campaigns</h2>
          
          <div className="space-y-4">
            {campaignData?.slice(0, 5)?.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{campaign?.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign?.status === 'Active' ?'bg-green-100 text-green-700' :'bg-yellow-100 text-yellow-700'
                    }`}>
                      {campaign?.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{campaign?.platform}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${campaign?.spend?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm text-gray-600">{campaign?.roas?.toFixed(2) || '0.00'}x ROAS</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Audience Insights & Budget Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Audience Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Audience Insights</h2>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">Age Group 25-34</h3>
                <span className="text-green-600 font-semibold">85% Performance</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">Business Software Interest</h3>
                <span className="text-blue-600 font-semibold">78% Performance</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">Lookalike Audience</h3>
                <span className="text-purple-600 font-semibold">72% Performance</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Alerts</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded">
              <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Budget Exceeded</h3>
                <p className="text-sm text-gray-600">Brand Awareness Campaign exceeded daily budget by $5.00</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 border-l-4 border-red-400 bg-red-50 rounded">
              <AlertTriangle size={20} className="text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">High CPA Alert</h3>
                <p className="text-sm text-gray-600">Lead Generation Campaign CPA is $3.50, above target of $2.00</p>
                <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 border-l-4 border-green-400 bg-green-50 rounded">
              <TrendingUp size={20} className="text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Performance Improvement</h3>
                <p className="text-sm text-gray-600">Product Sales Campaign ROAS increased to 12.3x</p>
                <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Connect Ad Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Connect Ad Account</h2>
            <p className="text-gray-600 mb-6">Choose a platform to connect your advertising account</p>
            
            <div className="space-y-3">
              {[
                { name: 'Facebook Ads', icon: '📘', connected: adAccounts?.some(a => a?.platform === 'Facebook Ads' && a?.status === 'connected') },
                { name: 'Google Ads', icon: '🔍', connected: adAccounts?.some(a => a?.platform === 'Google Ads' && a?.status === 'connected') },
                { name: 'LinkedIn Ads', icon: '💼', connected: adAccounts?.some(a => a?.platform === 'LinkedIn Ads' && a?.status === 'connected') },
                { name: 'Twitter Ads', icon: '🐦', connected: adAccounts?.some(a => a?.platform === 'Twitter Ads' && a?.status === 'connected') },
                { name: 'TikTok Ads', icon: '🎵', connected: false },
                { name: 'Snapchat Ads', icon: '👻', connected: false },
              ]?.map((platform) => (
                <button
                  key={platform?.name}
                  onClick={() => connectAdAccount(platform?.name)}
                  disabled={platform?.connected}
                  className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    platform?.connected
                      ? 'border-green-200 bg-green-50 text-green-700 cursor-not-allowed' :'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{platform?.icon}</span>
                    <span className="font-medium">{platform?.name}</span>
                  </div>
                  {platform?.connected ? (
                    <span className="text-sm text-green-600">Connected</span>
                  ) : (
                    <ExternalLink size={16} className="text-gray-400" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConnectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdPerformanceAnalytics;