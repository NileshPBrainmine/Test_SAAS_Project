import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const PlatformComparison = ({ data, metric }) => {
  const platformColors = {
    Instagram: '#E4405F',
    Facebook: '#1877F2',
    LinkedIn: '#0A66C2',
    Twitter: '#1DA1F2'
  };

  const formatTooltipValue = (value) => {
    if (metric === 'engagement_rate') return `${value}%`;
    if (value >= 1000000) return `${(value / 1000000)?.toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000)?.toFixed(1)}K`;
    return value?.toLocaleString();
  };

  const getMetricLabel = (metric) => {
    const labels = {
      followers: 'Followers',
      engagement: 'Total Engagement',
      reach: 'Total Reach',
      engagement_rate: 'Engagement Rate'
    };
    return labels?.[metric] || metric;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Platform Comparison</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="BarChart3" size={16} />
          <span>{getMetricLabel(metric)}</span>
        </div>
      </div>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="platform" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatTooltipValue}
            />
            <Tooltip 
              formatter={(value) => [formatTooltipValue(value), getMetricLabel(metric)]}
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={platformColors?.[entry?.platform]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((platform) => (
          <div key={platform?.platform} className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: platformColors?.[platform?.platform] }}
              />
              <span className="text-sm font-medium text-foreground">{platform?.platform}</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatTooltipValue(platform?.value)}
            </p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <Icon 
                name={platform?.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={14}
                className={platform?.change >= 0 ? 'text-success' : 'text-error'}
              />
              <span className={`text-xs ${platform?.change >= 0 ? 'text-success' : 'text-error'}`}>
                {Math.abs(platform?.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformComparison;