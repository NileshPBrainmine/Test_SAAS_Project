import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: 'Create New Post',
      description: 'Design and schedule content across platforms',
      icon: 'PenTool',
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      route: '/content-creation',
      featured: true
    },
    {
      id: 2,
      title: 'Schedule Content',
      description: 'Plan your posting calendar',
      icon: 'Calendar',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      route: '/content-calendar',
      featured: true
    },
    {
      id: 3,
      title: 'Connect Accounts',
      description: 'Link your social media platforms',
      icon: 'Link',
      color: 'bg-accent',
      textColor: 'text-accent-foreground',
      route: '/social-account-management',
      featured: false
    },
    {
      id: 4,
      title: 'View Analytics',
      description: 'Analyze your performance metrics',
      icon: 'BarChart3',
      color: 'bg-success',
      textColor: 'text-success-foreground',
      route: '/analytics-dashboard',
      featured: false
    },
    {
      id: 5,
      title: 'Team Collaboration',
      description: 'Manage team members and permissions',
      icon: 'Users',
      color: 'bg-warning',
      textColor: 'text-warning-foreground',
      route: '/team-collaboration',
      featured: false
    },
    {
      id: 6,
      title: 'AI Content Generator',
      description: 'Generate captions with AI assistance',
      icon: 'Sparkles',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      textColor: 'text-white',
      route: '/content-creation',
      featured: false
    }
  ];

  const handleActionClick = (route) => {
    navigate(route);
  };

  const featuredActions = actions?.filter(action => action?.featured);
  const regularActions = actions?.filter(action => !action?.featured);

  return (
    <div className="space-y-6">
      {/* Featured Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredActions?.map((action) => (
          <div
            key={action?.id}
            className="group relative overflow-hidden bg-card border border-border rounded-lg shadow-elevation-1 hover:shadow-elevation-2 transition-smooth cursor-pointer"
            onClick={() => handleActionClick(action?.route)}
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${action?.color} group-hover:scale-110 transition-transform`}>
                  <Icon name={action?.icon} size={24} className={action?.textColor} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
                    {action?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action?.description}
                  </p>
                </div>
                <Icon 
                  name="ArrowRight" 
                  size={20} 
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
      {/* Regular Actions Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">More Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regularActions?.map((action) => (
            <button
              key={action?.id}
              onClick={() => handleActionClick(action?.route)}
              className="group p-4 bg-card border border-border rounded-lg shadow-elevation-1 hover:shadow-elevation-2 transition-smooth text-left"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action?.color} group-hover:scale-110 transition-transform`}>
                  <Icon name={action?.icon} size={20} className={action?.textColor} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {action?.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
            <p className="text-sm text-muted-foreground">Today's performance snapshot</p>
          </div>
          <Icon name="TrendingUp" size={24} className="text-primary" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">Posts Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">3.2K</div>
            <div className="text-xs text-muted-foreground">Engagements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">8.7K</div>
            <div className="text-xs text-muted-foreground">Reach</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">4</div>
            <div className="text-xs text-muted-foreground">Platforms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;