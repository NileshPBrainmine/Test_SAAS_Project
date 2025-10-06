import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlatformStatus = () => {
  const platforms = [
    {
      id: 1,
      name: 'Instagram',
      icon: 'Instagram',
      status: 'connected',
      account: '@company_official',
      followers: '24.5K',
      lastSync: new Date(Date.now() - 300000), // 5 minutes ago
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      posts: 156,
      engagement: '4.2%'
    },
    {
      id: 2,
      name: 'Facebook',
      icon: 'Facebook',
      status: 'connected',
      account: 'Company Page',
      followers: '18.2K',
      lastSync: new Date(Date.now() - 600000), // 10 minutes ago
      color: 'bg-blue-600',
      posts: 89,
      engagement: '3.8%'
    },
    {
      id: 3,
      name: 'LinkedIn',
      icon: 'Linkedin',
      status: 'connected',
      account: 'Company LinkedIn',
      followers: '12.8K',
      lastSync: new Date(Date.now() - 900000), // 15 minutes ago
      color: 'bg-blue-700',
      posts: 67,
      engagement: '5.1%'
    },
    {
      id: 4,
      name: 'Twitter',
      icon: 'Twitter',
      status: 'error',
      account: '@company_handle',
      followers: '31.7K',
      lastSync: new Date(Date.now() - 3600000), // 1 hour ago
      color: 'bg-sky-500',
      posts: 234,
      engagement: '2.9%',
      error: 'API rate limit exceeded'
    },
    {
      id: 5,
      name: 'TikTok',
      icon: 'Music',
      status: 'disconnected',
      account: 'Not connected',
      followers: '0',
      lastSync: null,
      color: 'bg-gray-400',
      posts: 0,
      engagement: '0%'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'error':
        return { icon: 'AlertCircle', color: 'text-error' };
      case 'disconnected':
        return { icon: 'XCircle', color: 'text-muted-foreground' };
      default:
        return { icon: 'Clock', color: 'text-warning' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-success/10 text-success border-success/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      case 'disconnected':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return timestamp?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const handleConnect = (platformId) => {
    console.log(`Connecting platform ${platformId}`);
  };

  const handleReconnect = (platformId) => {
    console.log(`Reconnecting platform ${platformId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Platform Status</h3>
            <p className="text-sm text-muted-foreground">Monitor your connected social media accounts</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            iconName="RefreshCw" 
            iconPosition="left"
            onClick={() => window.location?.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {platforms?.map((platform) => {
          const statusInfo = getStatusIcon(platform?.status);
          
          return (
            <div key={platform?.id} className="p-4 hover:bg-muted/30 transition-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${platform?.color}`}>
                    <Icon name={platform?.icon} size={20} color="white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">{platform?.name}</h4>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(platform?.status)}`}>
                        <Icon name={statusInfo?.icon} size={12} />
                        <span className="capitalize">{platform?.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{platform?.account}</span>
                      <span>•</span>
                      <span>{platform?.followers} followers</span>
                      <span>•</span>
                      <span>Last sync: {formatLastSync(platform?.lastSync)}</span>
                    </div>
                    
                    {platform?.error && (
                      <div className="mt-1 text-xs text-error">
                        <Icon name="AlertTriangle" size={12} className="inline mr-1" />
                        {platform?.error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {platform?.status === 'connected' && (
                    <div className="hidden sm:flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="text-center">
                        <div className="font-medium text-foreground">{platform?.posts}</div>
                        <div>Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-foreground">{platform?.engagement}</div>
                        <div>Engagement</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    {platform?.status === 'disconnected' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConnect(platform?.id)}
                      >
                        Connect
                      </Button>
                    ) : platform?.status === 'error' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReconnect(platform?.id)}
                      >
                        Reconnect
                      </Button>
                    ) : (
                      <Icon name={statusInfo?.icon} size={20} className={statusInfo?.color} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {platforms?.filter(p => p?.status === 'connected')?.length} of {platforms?.length} platforms connected
          </span>
          <button className="text-primary hover:text-primary/80 font-medium transition-smooth">
            Manage Connections
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformStatus;