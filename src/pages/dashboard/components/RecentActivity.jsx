import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { activityService } from '../../../utils/supabaseService';
import { useAuth } from '../../../contexts/AuthContext';

const RecentActivity = () => {
  const { organization } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      if (!organization?.id) {
        // Show default preview data if no organization
        setActivities([
          {
            id: 1,
            type: "content_created",
            description: "created a new Instagram post for the holiday campaign",
            user_profiles: {
              full_name: "Sarah Johnson",
              avatar_url: null
            },
            created_at: new Date(Date.now() - 15 * 60 * 1000)?.toISOString(),
            metadata: {
              contentTitle: "Holiday Season Campaign Launch",
              platform: "Instagram"
            }
          },
          {
            id: 2,
            type: "content_published",
            description: "published the behind-the-scenes video post",
            user_profiles: {
              full_name: "Michael Chen",
              avatar_url: null
            },
            created_at: new Date(Date.now() - 30 * 60 * 1000)?.toISOString(),
            metadata: {
              contentTitle: "Behind the Scenes Content",
              platform: "Instagram"
            }
          },
          {
            id: 3,
            type: "team_member_added",
            description: "invited Emily Rodriguez to join the workspace",
            user_profiles: {
              full_name: "Sarah Johnson",
              avatar_url: null
            },
            created_at: new Date(Date.now() - 60 * 60 * 1000)?.toISOString(),
            metadata: {
              role: "Editor"
            }
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error: activitiesError } = await activityService?.getActivities(organization?.id, 10);
        
        if (activitiesError) {
          setError(activitiesError?.message);
          return;
        }

        setActivities(data || []);
      } catch (err) {
        setError(err?.message);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [organization?.id]);

  const getActivityIcon = (activityType) => {
    const iconMap = {
      content_created: 'Plus',
      content_published: 'Send',
      content_scheduled: 'Calendar',
      content_approved: 'CheckCircle',
      content_rejected: 'XCircle',
      team_member_added: 'UserPlus',
      team_member_removed: 'UserMinus',
      role_changed: 'Shield',
      account_connected: 'Link',
      account_disconnected: 'Unlink'
    };
    return iconMap?.[activityType] || 'Activity';
  };

  const getActivityColor = (activityType) => {
    const colorMap = {
      content_created: 'text-blue-500',
      content_published: 'text-green-500',
      content_scheduled: 'text-purple-500',
      content_approved: 'text-green-500',
      content_rejected: 'text-red-500',
      team_member_added: 'text-blue-500',
      team_member_removed: 'text-red-500',
      role_changed: 'text-yellow-500',
      account_connected: 'text-green-500',
      account_disconnected: 'text-red-500'
    };
    return colorMap?.[activityType] || 'text-muted-foreground';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getInitials = (name) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)]?.map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-muted rounded"></div>
                <div className="w-1/2 h-3 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Failed to load activities</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button variant="ghost" size="sm" iconName="ExternalLink">
          View All
        </Button>
      </div>
      <div className="space-y-6">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No recent activity to show</p>
            <p className="text-sm text-muted-foreground mt-1">Activities will appear here when your team starts working</p>
          </div>
        ) : (
          activities?.slice(0, 5)?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-4">
              {/* Activity Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 ${getActivityColor(activity?.type)}`}>
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={18} 
                />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* User Avatar */}
                    {activity?.user_profiles?.avatar_url ? (
                      <img
                        src={activity?.user_profiles?.avatar_url}
                        alt={activity?.user_profiles?.full_name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {getInitials(activity?.user_profiles?.full_name)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {activity?.user_profiles?.full_name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {getTimeAgo(activity?.created_at)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {activity?.description}
                </p>

                {/* Metadata */}
                {activity?.metadata && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {activity?.metadata?.contentTitle && (
                      <span className="inline-flex items-center space-x-1">
                        <Icon name="FileText" size={12} />
                        <span>{activity?.metadata?.contentTitle}</span>
                      </span>
                    )}
                    {activity?.metadata?.platform && (
                      <span className="ml-2 inline-flex items-center space-x-1">
                        <Icon name="Share2" size={12} />
                        <span>{activity?.metadata?.platform}</span>
                      </span>
                    )}
                    {activity?.metadata?.role && (
                      <span className="inline-flex items-center space-x-1">
                        <Icon name="Shield" size={12} />
                        <span>Role: {activity?.metadata?.role}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {activities?.length > 5 && (
        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="ghost" fullWidth size="sm" iconName="ChevronDown">
            Show More Activity
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;