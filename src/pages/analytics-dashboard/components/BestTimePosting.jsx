import React from 'react';
import Icon from '../../../components/AppIcon';

const BestTimePosting = ({ recommendations }) => {
  const getDayColor = (engagement) => {
    if (engagement >= 80) return 'bg-success text-success-foreground';
    if (engagement >= 60) return 'bg-warning text-warning-foreground';
    if (engagement >= 40) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Best Time to Post</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Based on engagement data</span>
        </div>
      </div>
      {/* Heatmap */}
      <div className="mb-6">
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div></div>
          {days?.map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground text-center py-2">
              {day}
            </div>
          ))}
        </div>
        
        {hours?.filter((_, index) => index % 2 === 0)?.map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs text-muted-foreground text-right pr-2 py-1">
              {formatTime(hour)}
            </div>
            {days?.map((day) => {
              const dayData = recommendations?.heatmap?.find(d => d?.day === day);
              const hourData = dayData?.hours?.find(h => h?.hour === hour);
              const engagement = hourData?.engagement || 0;
              
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`w-full h-6 rounded text-xs flex items-center justify-center font-medium ${getDayColor(engagement)}`}
                  title={`${day} ${formatTime(hour)}: ${engagement}% engagement`}
                >
                  {engagement > 0 ? engagement : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">Engagement Rate</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <div className="w-4 h-4 bg-accent rounded"></div>
            <div className="w-4 h-4 bg-warning rounded"></div>
            <div className="w-4 h-4 bg-success rounded"></div>
          </div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
      {/* Top Recommendations */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Top Recommendations</h4>
        {recommendations?.top?.map((rec, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {rec?.day} at {formatTime(rec?.hour)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rec?.platform} • Avg {rec?.engagement}% engagement
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Icon name="TrendingUp" size={14} className="text-success" />
                <span className="text-sm font-medium text-success">+{rec?.improvement}%</span>
              </div>
              <p className="text-xs text-muted-foreground">vs current avg</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestTimePosting;