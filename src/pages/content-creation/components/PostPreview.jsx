import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PostPreview = ({ caption, uploadedMedia, activePlatform, platforms }) => {
  const currentPlatform = platforms?.find(p => p?.id === activePlatform);
  
  const formatCaption = (text) => {
    if (!text) return '';
    
    // Convert hashtags to clickable links (visual representation)
    return text?.split('\n')?.map((line, index) => (
      <div key={index} className="mb-1">
        {line?.split(' ')?.map((word, wordIndex) => (
          <span key={wordIndex}>
            {word?.startsWith('#') ? (
              <span className="text-primary font-medium">{word}</span>
            ) : (
              word
            )}
            {wordIndex < line?.split(' ')?.length - 1 && ' '}
          </span>
        ))}
      </div>
    ));
  };

  const getPreviewLayout = () => {
    switch (activePlatform) {
      case 'instagram':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
            {/* Instagram Header */}
            <div className="flex items-center p-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-semibold text-gray-900 text-sm">your_business</div>
                <div className="text-gray-500 text-xs">Sponsored</div>
              </div>
              <Icon name="MoreHorizontal" size={20} className="text-gray-400" />
            </div>
            {/* Instagram Media */}
            {uploadedMedia?.length > 0 && (
              <div className="aspect-square bg-gray-100">
                {uploadedMedia?.[0]?.type === 'image' ? (
                  <Image
                    src={uploadedMedia?.[0]?.url}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Icon name="Play" size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
            )}
            {/* Instagram Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <Icon name="Heart" size={24} className="text-gray-700" />
                  <Icon name="MessageCircle" size={24} className="text-gray-700" />
                  <Icon name="Send" size={24} className="text-gray-700" />
                </div>
                <Icon name="Bookmark" size={24} className="text-gray-700" />
              </div>
              
              <div className="text-sm text-gray-900 mb-2">
                <span className="font-semibold">1,234 likes</span>
              </div>
              
              {caption && (
                <div className="text-sm text-gray-900">
                  <span className="font-semibold">your_business</span>{' '}
                  <span className="whitespace-pre-wrap">{formatCaption(caption)}</span>
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">2 hours ago</div>
            </div>
          </div>
        );

      case 'facebook':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-lg mx-auto">
            {/* Facebook Header */}
            <div className="flex items-center p-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-semibold text-gray-900">Your Business Page</div>
                <div className="text-gray-500 text-sm flex items-center">
                  2h • <Icon name="Globe" size={12} className="ml-1" />
                </div>
              </div>
              <Icon name="MoreHorizontal" size={20} className="text-gray-400" />
            </div>
            {/* Facebook Content */}
            {caption && (
              <div className="px-4 pb-3">
                <div className="text-gray-900 whitespace-pre-wrap">{formatCaption(caption)}</div>
              </div>
            )}
            {/* Facebook Media */}
            {uploadedMedia?.length > 0 && (
              <div className="bg-gray-100">
                {uploadedMedia?.[0]?.type === 'image' ? (
                  <Image
                    src={uploadedMedia?.[0]?.url}
                    alt="Post media"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                    <Icon name="Play" size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
            )}
            {/* Facebook Actions */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>👍❤️😊 You and 42 others</span>
                <span>5 comments • 2 shares</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded">
                  <Icon name="ThumbsUp" size={16} />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded">
                  <Icon name="MessageCircle" size={16} />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded">
                  <Icon name="Share" size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-lg mx-auto">
            {/* LinkedIn Header */}
            <div className="flex items-center p-4">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                <Icon name="Building" size={20} color="white" />
              </div>
              <div className="ml-3 flex-1">
                <div className="font-semibold text-gray-900">Your Company</div>
                <div className="text-gray-500 text-sm">1,234 followers</div>
                <div className="text-gray-500 text-xs">2h • Edited</div>
              </div>
              <Icon name="MoreHorizontal" size={20} className="text-gray-400" />
            </div>
            {/* LinkedIn Content */}
            {caption && (
              <div className="px-4 pb-3">
                <div className="text-gray-900 whitespace-pre-wrap">{formatCaption(caption)}</div>
              </div>
            )}
            {/* LinkedIn Media */}
            {uploadedMedia?.length > 0 && (
              <div className="bg-gray-100">
                {uploadedMedia?.[0]?.type === 'image' ? (
                  <Image
                    src={uploadedMedia?.[0]?.url}
                    alt="Post media"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                    <Icon name="Play" size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
            )}
            {/* LinkedIn Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>15 reactions • 3 comments</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded">
                  <Icon name="ThumbsUp" size={16} />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded">
                  <Icon name="MessageCircle" size={16} />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded">
                  <Icon name="Repeat" size={16} />
                  <span>Repost</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded">
                  <Icon name="Send" size={16} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'twitter':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-lg mx-auto">
            {/* Twitter Header */}
            <div className="flex items-start p-4">
              <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} color="white" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-900">Your Business</span>
                  <Icon name="BadgeCheck" size={16} className="text-blue-500" />
                  <span className="text-gray-500">@yourbusiness</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">2h</span>
                </div>
                
                {/* Twitter Content */}
                {caption && (
                  <div className="mt-2 text-gray-900 whitespace-pre-wrap">{formatCaption(caption)}</div>
                )}
                
                {/* Twitter Media */}
                {uploadedMedia?.length > 0 && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                    {uploadedMedia?.[0]?.type === 'image' ? (
                      <Image
                        src={uploadedMedia?.[0]?.url}
                        alt="Post media"
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                        <Icon name="Play" size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Twitter Actions */}
                <div className="flex items-center justify-between mt-3 max-w-md">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50">
                      <Icon name="MessageCircle" size={16} />
                    </div>
                    <span className="text-sm">12</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 group">
                    <div className="p-2 rounded-full group-hover:bg-green-50">
                      <Icon name="Repeat2" size={16} />
                    </div>
                    <span className="text-sm">5</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 group">
                    <div className="p-2 rounded-full group-hover:bg-red-50">
                      <Icon name="Heart" size={16} />
                    </div>
                    <span className="text-sm">28</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50">
                      <Icon name="Share" size={16} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Preview</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Eye" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground capitalize">
            {activePlatform} Preview
          </span>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-6">
        {getPreviewLayout()}
      </div>

      {/* Preview Notes */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Preview Notes:</p>
            <ul className="space-y-1">
              <li>• This is a visual representation of how your post will appear</li>
              <li>• Actual engagement metrics and timestamps will vary</li>
              <li>• Media aspect ratios are automatically optimized for each platform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;