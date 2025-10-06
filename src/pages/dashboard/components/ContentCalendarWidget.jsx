import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentCalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const scheduledPosts = [
    {
      id: 1,
      title: "Product Launch Announcement",
      platform: "instagram",
      scheduledTime: new Date(2025, 9, 3, 14, 0), // Oct 3, 2025 2:00 PM
      status: "scheduled",
      type: "image"
    },
    {
      id: 2,
      title: "Weekly Newsletter Promotion",
      platform: "linkedin",
      scheduledTime: new Date(2025, 9, 3, 16, 30), // Oct 3, 2025 4:30 PM
      status: "scheduled",
      type: "article"
    },
    {
      id: 3,
      title: "Behind the Scenes Video",
      platform: "facebook",
      scheduledTime: new Date(2025, 9, 4, 10, 0), // Oct 4, 2025 10:00 AM
      status: "draft",
      type: "video"
    },
    {
      id: 4,
      title: "Customer Testimonial",
      platform: "twitter",
      scheduledTime: new Date(2025, 9, 4, 15, 0), // Oct 4, 2025 3:00 PM
      status: "scheduled",
      type: "text"
    },
    {
      id: 5,
      title: "Weekend Special Offer",
      platform: "instagram",
      scheduledTime: new Date(2025, 9, 5, 12, 0), // Oct 5, 2025 12:00 PM
      status: "scheduled",
      type: "carousel"
    }
  ];

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      linkedin: 'Linkedin',
      twitter: 'Twitter'
    };
    return icons?.[platform] || 'Globe';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
      facebook: 'bg-blue-600',
      linkedin: 'bg-blue-700',
      twitter: 'bg-sky-500'
    };
    return colors?.[platform] || 'bg-gray-500';
  };

  const getTypeIcon = (type) => {
    const icons = {
      image: 'Image',
      video: 'Video',
      article: 'FileText',
      text: 'MessageSquare',
      carousel: 'Layers'
    };
    return icons?.[type] || 'File';
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'text-success',
      draft: 'text-warning',
      published: 'text-primary',
      failed: 'text-error'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    
    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === tomorrow?.toDateString()) {
      return 'Tomorrow';
    } else {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const groupPostsByDate = (posts) => {
    const grouped = {};
    posts?.forEach(post => {
      const dateKey = post?.scheduledTime?.toDateString();
      if (!grouped?.[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped?.[dateKey]?.push(post);
    });
    
    // Sort posts within each date by time
    Object.keys(grouped)?.forEach(dateKey => {
      grouped?.[dateKey]?.sort((a, b) => a?.scheduledTime - b?.scheduledTime);
    });
    
    return grouped;
  };

  const groupedPosts = groupPostsByDate(scheduledPosts);
  const sortedDates = Object.keys(groupedPosts)?.sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Upcoming Posts</h3>
            <p className="text-sm text-muted-foreground">Your scheduled content for the next few days</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            iconName="Calendar" 
            iconPosition="left"
            onClick={() => window.location.href = '/content-calendar'}
          >
            View Calendar
          </Button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {sortedDates?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No scheduled posts</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Start creating and scheduling content to see it here
            </p>
            <Button 
              variant="default" 
              iconName="Plus" 
              iconPosition="left"
              onClick={() => window.location.href = '/content-creation'}
            >
              Create Post
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedDates?.map((dateKey) => (
              <div key={dateKey} className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-foreground">
                    {formatDate(new Date(dateKey))}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    ({groupedPosts?.[dateKey]?.length} post{groupedPosts?.[dateKey]?.length !== 1 ? 's' : ''})
                  </span>
                </div>
                
                <div className="space-y-3">
                  {groupedPosts?.[dateKey]?.map((post) => (
                    <div 
                      key={post?.id} 
                      className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPlatformColor(post?.platform)}`}>
                        <Icon name={getPlatformIcon(post?.platform)} size={14} color="white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="text-sm font-medium text-foreground truncate">
                            {post?.title}
                          </h5>
                          <Icon name={getTypeIcon(post?.type)} size={12} className="text-muted-foreground flex-shrink-0" />
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{formatTime(post?.scheduledTime)}</span>
                          <span>•</span>
                          <span className={`capitalize ${getStatusColor(post?.status)}`}>
                            {post?.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button className="p-1 hover:bg-muted rounded transition-smooth">
                          <Icon name="Edit" size={14} className="text-muted-foreground hover:text-foreground" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded transition-smooth">
                          <Icon name="MoreHorizontal" size={14} className="text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {scheduledPosts?.filter(p => p?.status === 'scheduled')?.length} posts scheduled
          </span>
          <button className="text-primary hover:text-primary/80 font-medium transition-smooth">
            Manage Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendarWidget;