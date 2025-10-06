import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaptionEditor = ({ caption, onCaptionChange, activePlatform, platforms }) => {
  const [characterCount, setCharacterCount] = useState(0);
  const [hashtagCount, setHashtagCount] = useState(0);

  const platformLimits = {
    instagram: { caption: 2200, hashtags: 30 },
    facebook: { caption: 63206, hashtags: 30 },
    linkedin: { caption: 3000, hashtags: 30 },
    twitter: { caption: 280, hashtags: 10 }
  };

  useEffect(() => {
    setCharacterCount(caption?.length);
    const hashtags = caption?.match(/#\w+/g) || [];
    setHashtagCount(hashtags?.length);
  }, [caption]);

  const currentPlatform = platforms?.find(p => p?.id === activePlatform);
  const limits = platformLimits?.[activePlatform];
  const isOverLimit = characterCount > limits?.caption;
  const isHashtagOverLimit = hashtagCount > limits?.hashtags;

  const handleTextChange = (e) => {
    onCaptionChange(e?.target?.value);
  };

  const insertHashtag = () => {
    const hashtags = ['#socialmedia', '#marketing', '#content', '#business', '#growth'];
    const randomHashtag = hashtags?.[Math.floor(Math.random() * hashtags?.length)];
    onCaptionChange(caption + ' ' + randomHashtag);
  };

  const insertEmoji = () => {
    const emojis = ['🚀', '💡', '🎯', '📈', '✨', '🔥', '💪', '🌟'];
    const randomEmoji = emojis?.[Math.floor(Math.random() * emojis?.length)];
    onCaptionChange(caption + ' ' + randomEmoji);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Caption for {currentPlatform?.name}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={insertHashtag}
            iconName="Hash"
            iconPosition="left"
          >
            Add #
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={insertEmoji}
            iconName="Smile"
            iconPosition="left"
          >
            Emoji
          </Button>
        </div>
      </div>
      <div className="relative">
        <textarea
          value={caption}
          onChange={handleTextChange}
          placeholder={`Write your ${currentPlatform?.name} caption here...`}
          className="w-full h-32 p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
        />
        
        {/* Character count overlay */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-xs">
          <div className={`px-2 py-1 rounded ${
            isOverLimit ? 'bg-error text-error-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {characterCount}/{limits?.caption}
          </div>
          <div className={`px-2 py-1 rounded ${
            isHashtagOverLimit ? 'bg-error text-error-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            #{hashtagCount}/{limits?.hashtags}
          </div>
        </div>
      </div>
      {/* Platform-specific tips */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            {activePlatform === 'instagram' && (
              <span>Instagram tip: Use 3-5 relevant hashtags and include a call-to-action for better engagement.</span>
            )}
            {activePlatform === 'facebook' && (
              <span>Facebook tip: Posts with 1-2 sentences get 60% more engagement than longer posts.</span>
            )}
            {activePlatform === 'linkedin' && (
              <span>LinkedIn tip: Professional tone works best. Ask questions to encourage comments.</span>
            )}
            {activePlatform === 'twitter' && (
              <span>Twitter tip: Keep it concise and use trending hashtags for better visibility.</span>
            )}
          </div>
        </div>
      </div>
      {(isOverLimit || isHashtagOverLimit) && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
            <div className="text-sm text-error">
              {isOverLimit && <div>Caption exceeds character limit for {currentPlatform?.name}</div>}
              {isHashtagOverLimit && <div>Too many hashtags for {currentPlatform?.name}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptionEditor;