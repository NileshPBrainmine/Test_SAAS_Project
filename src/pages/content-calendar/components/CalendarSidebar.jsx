import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CalendarSidebar = ({ isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    contentTypes: {
      posts: true,
      drafts: true,
      campaigns: true,
      holds: false
    },
    platforms: {
      instagram: true,
      facebook: true,
      linkedin: true,
      twitter: true
    },
    status: {
      scheduled: true,
      pending: true,
      published: false,
      failed: true
    }
  });

  const bestTimes = [
    { platform: 'Instagram', time: '11:00 AM', engagement: '85%', icon: 'Instagram' },
    { platform: 'Facebook', time: '1:00 PM', engagement: '78%', icon: 'Facebook' },
    { platform: 'LinkedIn', time: '9:00 AM', engagement: '92%', icon: 'Linkedin' },
    { platform: 'Twitter', time: '3:00 PM', engagement: '71%', icon: 'Twitter' }
  ];

  const upcomingDeadlines = [
    { title: 'Q4 Campaign Launch', date: '2025-10-15', priority: 'high' },
    { title: 'Product Announcement', date: '2025-10-20', priority: 'medium' },
    { title: 'Holiday Content Series', date: '2025-10-25', priority: 'low' }
  ];

  const handleFilterChange = (category, key) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [key]: !prev?.[category]?.[key]
      }
    }));
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: 'Instagram',
      facebook: 'Facebook', 
      linkedin: 'Linkedin',
      twitter: 'Twitter'
    };
    return icons?.[platform] || 'Globe';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error',
      medium: 'text-warning',
      low: 'text-success'
    };
    return colors?.[priority] || 'text-muted-foreground';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <div className={`fixed lg:relative top-0 right-0 h-full w-80 bg-surface border-l border-border z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Filters & Tools</h2>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onToggle}
              className="lg:hidden w-8 h-8"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Content Type Filters */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Filter" size={16} className="mr-2" />
                Content Types
              </h3>
              <div className="space-y-2">
                {Object.entries(filters?.contentTypes)?.map(([key, checked]) => (
                  <Checkbox
                    key={key}
                    label={key?.charAt(0)?.toUpperCase() + key?.slice(1)}
                    checked={checked}
                    onChange={() => handleFilterChange('contentTypes', key)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Platform Filters */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Globe" size={16} className="mr-2" />
                Platforms
              </h3>
              <div className="space-y-2">
                {Object.entries(filters?.platforms)?.map(([key, checked]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      checked={checked}
                      onChange={() => handleFilterChange('platforms', key)}
                      size="sm"
                    />
                    <Icon name={getPlatformIcon(key)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Status
              </h3>
              <div className="space-y-2">
                {Object.entries(filters?.status)?.map(([key, checked]) => (
                  <Checkbox
                    key={key}
                    label={key?.charAt(0)?.toUpperCase() + key?.slice(1)}
                    checked={checked}
                    onChange={() => handleFilterChange('status', key)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Best Times */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Clock" size={16} className="mr-2" />
                Best Times to Post
              </h3>
              <div className="space-y-3">
                {bestTimes?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name={item?.icon} size={16} className="text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item?.platform}</p>
                        <p className="text-xs text-muted-foreground">{item?.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-success">{item?.engagement}</p>
                      <p className="text-xs text-muted-foreground">engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="AlertTriangle" size={16} className="mr-2" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-2">
                {upcomingDeadlines?.map((deadline, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{deadline?.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{deadline?.date}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        deadline?.priority === 'high' ? 'bg-error' :
                        deadline?.priority === 'medium' ? 'bg-warning' : 'bg-success'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Zap" size={16} className="mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  fullWidth
                >
                  Create Post
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Copy"
                  iconPosition="left"
                  fullWidth
                >
                  Bulk Schedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  fullWidth
                >
                  Auto-Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarSidebar;