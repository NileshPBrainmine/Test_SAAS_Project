import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ActivityFeed = ({ activities, onLoadMore, hasMore }) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Activities', icon: 'Activity' },
    { value: 'content', label: 'Content', icon: 'FileText' },
    { value: 'approval', label: 'Approvals', icon: 'CheckCircle' },
    { value: 'team', label: 'Team', icon: 'Users' },
    { value: 'schedule', label: 'Scheduling', icon: 'Calendar' }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      content_created: 'Plus',
      content_edited: 'Edit',
      content_deleted: 'Trash2',
      content_approved: 'CheckCircle',
      content_rejected: 'XCircle',
      content_scheduled: 'Calendar',
      content_published: 'Send',
      team_member_added: 'UserPlus',
      team_member_removed: 'UserMinus',
      role_changed: 'Shield',
      comment_added: 'MessageCircle'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    if (type?.includes('approved') || type?.includes('published')) return 'text-success';
    if (type?.includes('rejected') || type?.includes('deleted')) return 'text-error';
    if (type?.includes('edited') || type?.includes('scheduled')) return 'text-warning';
    if (type?.includes('team')) return 'text-secondary';
    return 'text-primary';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activity) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredActivities = activities?.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'content') return activity?.type?.includes('content');
    if (filter === 'approval') return activity?.type?.includes('approved') || activity?.type?.includes('rejected');
    if (filter === 'team') return activity?.type?.includes('team') || activity?.type?.includes('role');
    if (filter === 'schedule') return activity?.type?.includes('scheduled');
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Team Activity</h2>
        <div className="flex items-center space-x-2">
          {filterOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                filter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={option?.icon} size={16} />
              <span className="hidden sm:inline">{option?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg">
        {filteredActivities?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">No activities found</h3>
            <p className="text-muted-foreground">Try adjusting your filter or check back later.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredActivities?.map((activity, index) => (
              <div key={activity?.id} className="p-4 hover:bg-muted/50 transition-smooth">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                    <Icon name={getActivityIcon(activity?.type)} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Image
                        src={activity?.user?.avatar}
                        alt={activity?.user?.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-sm font-medium text-card-foreground">
                        {activity?.user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity?.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity?.description}
                    </p>
                    
                    {activity?.metadata && (
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {activity?.metadata?.contentTitle && (
                          <span>Content: {activity?.metadata?.contentTitle}</span>
                        )}
                        {activity?.metadata?.platform && (
                          <span>Platform: {activity?.metadata?.platform}</span>
                        )}
                        {activity?.metadata?.role && (
                          <span>Role: {activity?.metadata?.role}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {hasMore && filteredActivities?.length > 0 && (
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              fullWidth
              iconName="ChevronDown"
              onClick={onLoadMore}
            >
              Load More Activities
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;