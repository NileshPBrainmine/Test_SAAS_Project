import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountCard = ({ account, onReconnect, onDisconnect, onConfigure }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'expired': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'expired': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
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

  const formatLastSync = (timestamp) => {
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - syncTime) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-smooth">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            account?.platform === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
            account?.platform === 'facebook' ? 'bg-blue-600' :
            account?.platform === 'linkedin'? 'bg-blue-700' : 'bg-sky-500'
          }`}>
            <Icon name={getPlatformIcon(account?.platform)} size={24} color="white" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground capitalize">
              {account?.platform}
            </h3>
            <p className="text-sm text-muted-foreground">@{account?.username}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getStatusColor(account?.status)}`}>
            <Icon name={getStatusIcon(account?.status)} size={16} />
            <span className="text-sm font-medium capitalize">{account?.status}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Last Sync</p>
          <p className="text-sm font-medium text-card-foreground">
            {formatLastSync(account?.lastSync)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Posts This Month</p>
          <p className="text-sm font-medium text-card-foreground">
            {account?.postsThisMonth}
          </p>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* API Limits */}
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-2">API Limits</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rate Limit</span>
                <span className="text-sm font-medium text-card-foreground">
                  {account?.apiLimits?.rateLimit?.used}/{account?.apiLimits?.rateLimit?.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-smooth"
                  style={{ 
                    width: `${(account?.apiLimits?.rateLimit?.used / account?.apiLimits?.rateLimit?.total) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-2">Permissions</h4>
            <div className="grid grid-cols-2 gap-2">
              {account?.permissions?.map((permission) => (
                <div key={permission?.name} className="flex items-center space-x-2">
                  <Icon 
                    name={permission?.granted ? "Check" : "X"} 
                    size={14} 
                    className={permission?.granted ? "text-success" : "text-error"}
                  />
                  <span className="text-sm text-card-foreground">{permission?.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Prompts */}
          <div>
            <h4 className="text-sm font-semibold text-card-foreground mb-2">AI Prompts</h4>
            <p className="text-sm text-muted-foreground mb-2">
              {account?.customPrompts ? 'Custom prompts configured' : 'Using default prompts'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(account?.id, 'prompts')}
              iconName="Edit"
              iconPosition="left"
            >
              Configure Prompts
            </Button>
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex space-x-2">
          {account?.status === 'expired' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onReconnect(account?.id)}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Reconnect
            </Button>
          )}
          {account?.status === 'connected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(account?.id, 'settings')}
              iconName="Settings"
              iconPosition="left"
            >
              Configure
            </Button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDisconnect(account?.id)}
          iconName="Unlink"
          iconPosition="left"
          className="text-error hover:text-error"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default AccountCard;