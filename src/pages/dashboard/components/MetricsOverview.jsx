import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { analyticsService } from '../../../utils/supabaseService';
import { useAuth } from '../../../contexts/AuthContext';

const MetricsOverview = () => {
  const { organization } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!organization?.id) {
        // Show default preview data if no organization
        setMetrics([
          {
            id: 1,
            title: "Total Reach",
            value: "2.4M",
            change: "+12.5%",
            changeType: "positive",
            icon: "Users",
            description: "Across all platforms"
          },
          {
            id: 2,
            title: "Engagement Rate",
            value: "4.8%",
            change: "+0.3%",
            changeType: "positive",
            icon: "Heart",
            description: "Average engagement"
          },
          {
            id: 3,
            title: "Follower Growth",
            value: "+1,247",
            change: "+8.2%",
            changeType: "positive",
            icon: "TrendingUp",
            description: "This month"
          },
          {
            id: 4,
            title: "Posts Published",
            value: "156",
            change: "-2.1%",
            changeType: "negative",
            icon: "FileText",
            description: "This month"
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error: metricsError } = await analyticsService?.getMetricsOverview(organization?.id);
        
        if (metricsError) {
          setError(metricsError?.message);
          return;
        }

        if (data) {
          const formattedMetrics = [
            {
              id: 1,
              title: "Total Followers",
              value: formatNumber(data?.totalFollowers),
              change: "+12.5%",
              changeType: "positive",
              icon: "Users",
              description: "Across all platforms"
            },
            {
              id: 2,
              title: "Engagement Rate",
              value: `${data?.averageEngagement}%`,
              change: "+0.3%",
              changeType: "positive",
              icon: "Heart",
              description: "Average engagement"
            },
            {
              id: 3,
              title: "Total Reach",
              value: formatNumber(data?.totalReach),
              change: "+8.2%",
              changeType: "positive",
              icon: "TrendingUp",
              description: "This month"
            },
            {
              id: 4,
              title: "Posts Published",
              value: data?.postsThisMonth?.toString(),
              change: "+5.4%",
              changeType: "positive",
              icon: "FileText",
              description: "This month"
            }
          ];
          setMetrics(formattedMetrics);
        }
      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [organization?.id]);

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000)?.toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000)?.toFixed(1)}K`;
    return num?.toString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="w-16 h-4 bg-muted rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="w-20 h-8 bg-muted rounded"></div>
              <div className="w-24 h-4 bg-muted rounded"></div>
              <div className="w-16 h-3 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Failed to load metrics</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              metric?.changeType === 'positive' ? 'bg-success/10' : 'bg-error/10'
            }`}>
              <Icon 
                name={metric?.icon} 
                size={24} 
                color={metric?.changeType === 'positive' ? 'var(--color-success)' : 'var(--color-error)'} 
              />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              metric?.changeType === 'positive' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={metric?.changeType === 'positive' ? 'ArrowUp' : 'ArrowDown'} 
                size={16} 
              />
              <span>{metric?.change}</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{metric?.value}</h3>
            <p className="text-sm font-medium text-foreground">{metric?.title}</p>
            <p className="text-xs text-muted-foreground">{metric?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;