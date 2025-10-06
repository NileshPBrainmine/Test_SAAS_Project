import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MediaUploadZone from './components/MediaUploadZone';
import PlatformTabs from './components/PlatformTabs';
import CaptionEditor from './components/CaptionEditor';
import AIAssistant from './components/AIAssistant';
import ContentGeneratorSelector from './components/ContentGeneratorSelector';
import MediaVariants from './components/MediaVariants';
import PostPreview from './components/PostPreview';
import SchedulingControls from './components/SchedulingControls';

const ContentCreation = () => {
  const navigate = useNavigate();
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [captions, setCaptions] = useState({
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: ''
  });
  const [activeTab, setActiveTab] = useState('create');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState(null);

  const platforms = [
    { id: 'instagram', name: 'Instagram', connected: true },
    { id: 'facebook', name: 'Facebook', connected: true },
    { id: 'linkedin', name: 'LinkedIn', connected: false },
    { id: 'twitter', name: 'Twitter', connected: true }
  ];

  const tabs = [
    { id: 'create', label: 'Create', icon: 'PenTool' },
    { id: 'generate', label: 'AI Generate', icon: 'Sparkles' },
    { id: 'media', label: 'Media', icon: 'Image' },
    { id: 'preview', label: 'Preview', icon: 'Eye' },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar' }
  ];

  const handleMediaUpload = (mediaItem) => {
    setUploadedMedia(prev => [...prev, mediaItem]);
  };

  const handleRemoveMedia = (mediaId) => {
    setUploadedMedia(prev => prev?.filter(item => item?.id !== mediaId));
  };

  const handleCaptionChange = (caption) => {
    setCaptions(prev => ({
      ...prev,
      [activePlatform]: caption
    }));
  };

  const handleCaptionGenerated = (generatedCaption) => {
    setCaptions(prev => ({
      ...prev,
      [activePlatform]: generatedCaption
    }));
    setShowAIAssistant(false);
  };

  const handleGeneratorSelect = (generator) => {
    setSelectedGenerator(generator);
    if (generator?.content) {
      // If generator provides content, use it as caption
      setCaptions(prev => ({
        ...prev,
        [activePlatform]: generator?.content
      }));
    }
  };

  const handlePublishNow = async () => {
    // Simulate publishing
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Post published successfully!');
        resolve();
      }, 2000);
    });
  };

  const handleSchedule = async (scheduleData) => {
    // Simulate scheduling
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(`Post scheduled for ${scheduleData.date} at ${scheduleData.time}`);
        resolve();
      }, 2000);
    });
  };

  const isContentValid = () => {
    const currentCaption = captions?.[activePlatform];
    return currentCaption?.trim()?.length > 0 || uploadedMedia?.length > 0;
  };

  const getConnectedPlatforms = () => {
    return platforms?.filter(p => p?.connected);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Content Creation</h1>
                <p className="text-muted-foreground mt-2">
                  Create and customize social media posts with AI-powered assistance
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAIAssistant(!showAIAssistant);
                    setShowContentGenerator(false);
                  }}
                  iconName="Sparkles"
                  iconPosition="left"
                >
                  AI Assistant
                </Button>
                <Button
                  variant={showContentGenerator ? 'default' : 'ghost'}
                  onClick={() => {
                    setShowContentGenerator(!showContentGenerator);
                    setShowAIAssistant(false);
                  }}
                  iconName="Wand2"
                  iconPosition="left"
                >
                  Content Generator
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/content-calendar')}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  View Calendar
                </Button>
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Select Platforms</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/social-account-management')}
                iconName="Settings"
                iconPosition="left"
              >
                Manage Accounts
              </Button>
            </div>
            <PlatformTabs
              activePlatform={activePlatform}
              onPlatformChange={setActivePlatform}
              platforms={platforms}
            />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Creation Tools */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab?.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-card border border-border rounded-lg p-6">
                {activeTab === 'create' && (
                  <div className="space-y-8">
                    <MediaUploadZone
                      onMediaUpload={handleMediaUpload}
                      uploadedMedia={uploadedMedia}
                      onRemoveMedia={handleRemoveMedia}
                    />
                    <CaptionEditor
                      caption={captions?.[activePlatform]}
                      onCaptionChange={handleCaptionChange}
                      activePlatform={activePlatform}
                      platforms={platforms}
                    />
                  </div>
                )}

                {activeTab === 'generate' && (
                  <ContentGeneratorSelector
                    onGeneratorSelect={handleGeneratorSelect}
                    activePlatform={activePlatform}
                  />
                )}

                {activeTab === 'media' && (
                  <MediaVariants
                    uploadedMedia={uploadedMedia}
                    activePlatform={activePlatform}
                  />
                )}

                {activeTab === 'preview' && (
                  <PostPreview
                    caption={captions?.[activePlatform]}
                    uploadedMedia={uploadedMedia}
                    activePlatform={activePlatform}
                    platforms={platforms}
                  />
                )}

                {activeTab === 'schedule' && (
                  <SchedulingControls
                    onSchedule={handleSchedule}
                    onPublishNow={handlePublishNow}
                    isValid={isContentValid()}
                  />
                )}
              </div>
            </div>

            {/* Right Column - AI Assistant & Quick Actions */}
            <div className="space-y-6">
              {/* AI Assistant Panel */}
              {showAIAssistant && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <AIAssistant
                    onCaptionGenerated={handleCaptionGenerated}
                    activePlatform={activePlatform}
                  />
                </div>
              )}

              {/* Content Generator Panel */}
              {showContentGenerator && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <ContentGeneratorSelector
                    onGeneratorSelect={handleGeneratorSelect}
                    activePlatform={activePlatform}
                  />
                </div>
              )}

              {/* Selected Generator Info */}
              {selectedGenerator && !showContentGenerator && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Active Generator</h3>
                  <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Wand2" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{selectedGenerator?.name || 'Custom Generator'}</p>
                      <p className="text-sm text-muted-foreground">Ready to generate content</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Content Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Connected Platforms</span>
                    <span className="font-medium text-foreground">
                      {getConnectedPlatforms()?.length}/{platforms?.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Media Files</span>
                    <span className="font-medium text-foreground">{uploadedMedia?.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Caption Length</span>
                    <span className="font-medium text-foreground">
                      {captions?.[activePlatform]?.length || 0} chars
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Content Valid</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isContentValid() ? 'bg-success' : 'bg-error'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isContentValid() ? 'text-success' : 'text-error'
                      }`}>
                        {isContentValid() ? 'Ready' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                  {selectedGenerator && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">AI Generator</span>
                      <span className="font-medium text-primary">Active</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/content-calendar')}
                    iconName="Calendar"
                    iconPosition="left"
                  >
                    View Calendar
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/analytics-dashboard')}
                    iconName="BarChart3"
                    iconPosition="left"
                  >
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/team-collaboration')}
                    iconName="Users"
                    iconPosition="left"
                  >
                    Team Review
                  </Button>
                </div>
              </div>

              {/* Platform Tips */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Lightbulb" size={16} className="text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      {activePlatform?.charAt(0)?.toUpperCase() + activePlatform?.slice(1)} Tips
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {activePlatform === 'instagram' && (
                        <ul className="space-y-1">
                          <li>• Use 3-5 relevant hashtags</li>
                          <li>• Square images perform best</li>
                          <li>• Include a clear call-to-action</li>
                        </ul>
                      )}
                      {activePlatform === 'facebook' && (
                        <ul className="space-y-1">
                          <li>• Keep posts under 80 characters</li>
                          <li>• Ask questions to boost engagement</li>
                          <li>• Use landscape images (16:9)</li>
                        </ul>
                      )}
                      {activePlatform === 'linkedin' && (
                        <ul className="space-y-1">
                          <li>• Professional tone works best</li>
                          <li>• Share industry insights</li>
                          <li>• Tag relevant connections</li>
                        </ul>
                      )}
                      {activePlatform === 'twitter' && (
                        <ul className="space-y-1">
                          <li>• Keep it concise and punchy</li>
                          <li>• Use trending hashtags</li>
                          <li>• Engage with replies quickly</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreation;