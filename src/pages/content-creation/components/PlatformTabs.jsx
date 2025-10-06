import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformTabs = ({ activePlatform, onPlatformChange, platforms }) => {
  const platformIcons = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'Linkedin',
    twitter: 'Twitter'
  };

  const platformColors = {
    instagram: 'from-pink-500 to-purple-600',
    facebook: 'from-blue-600 to-blue-700',
    linkedin: 'from-blue-700 to-blue-800',
    twitter: 'from-sky-400 to-sky-600'
  };

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
      {platforms?.map((platform) => (
        <button
          key={platform?.id}
          onClick={() => onPlatformChange(platform?.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activePlatform === platform?.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <div className={`w-5 h-5 rounded bg-gradient-to-r ${platformColors?.[platform?.id]} flex items-center justify-center`}>
            <Icon name={platformIcons?.[platform?.id]} size={12} color="white" />
          </div>
          <span className="capitalize">{platform?.name}</span>
          {platform?.connected && (
            <div className="w-2 h-2 bg-success rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default PlatformTabs;