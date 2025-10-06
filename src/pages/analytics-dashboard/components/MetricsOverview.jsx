import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverview = ({ metrics, selectedPlatform, dateRange }) => {
  const getMetricIcon = (type) => {
    const icons = {
      engagement: 'Heart',
      reach: 'Eye',
      followers: 'Users',
      posts: 'FileText'
    };
    return icons?.[type] || 'BarChart3';
  };

  const getMetricColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000)?.toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000)?.toFixed(1)}K`;
    return num?.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              metric?.type === 'engagement' ? 'bg-primary/10 text-primary' :
              metric?.type === 'reach' ? 'bg-secondary/10 text-secondary' :
              metric?.type === 'followers'? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'
            }`}>
              <Icon name={getMetricIcon(metric?.type)} size={24} />
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 text-sm ${getMetricColor(metric?.change)}`}>
                <Icon 
                  name={metric?.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                />
                <span>{Math.abs(metric?.change)}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {metric?.label}
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {formatNumber(metric?.value)}
            </p>
            <p className="text-sm text-muted-foreground">
              vs {formatNumber(metric?.previousValue)} last {dateRange?.toLowerCase()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsOverview;