import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TopPerformingContent = ({ posts }) => {
  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      linkedin: 'Linkedin',
      twitter: 'Twitter'
    };
    return icons?.[platform] || 'Share2';
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'text-pink-500',
      facebook: 'text-blue-600',
      linkedin: 'text-blue-700',
      twitter: 'text-blue-400'
    };
    return colors?.[platform] || 'text-muted-foreground';
  };

  const formatEngagement = (engagement) => {
    if (engagement >= 1000) return `${(engagement / 1000)?.toFixed(1)}K`;
    return engagement?.toString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Performing Content</h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post?.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={post?.thumbnail}
                  alt={post?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground line-clamp-2">
                  {post?.title}
                </h4>
                <div className={`flex items-center space-x-1 ml-2 ${getPlatformColor(post?.platform)}`}>
                  <Icon name={getPlatformIcon(post?.platform)} size={16} />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Heart" size={14} />
                  <span>{formatEngagement(post?.likes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MessageCircle" size={14} />
                  <span>{formatEngagement(post?.comments)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Share2" size={14} />
                  <span>{formatEngagement(post?.shares)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Eye" size={14} />
                  <span>{formatEngagement(post?.reach)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(post.publishedAt)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success font-medium">
                    {post?.engagementRate}% engagement
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformingContent;