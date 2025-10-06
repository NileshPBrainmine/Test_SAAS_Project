import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentGeneratorSelector = ({ onGeneratorSelect, activePlatform }) => {
  const [selectedGenerator, setSelectedGenerator] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentType, setContentType] = useState('caption');

  const generators = [
    {
      id: 'veo3',
      name: 'VEO-3',
      description: 'Advanced video and visual content generation',
      icon: 'Video',
      capabilities: ['Video Generation', 'Visual Effects', 'Motion Graphics'],
      bestFor: 'video content, reels, stories',
      color: 'bg-purple-500',
      available: true
    },
    {
      id: 'adcreative',
      name: 'AdCreative AI',
      description: 'AI-powered ad creative and copy generation',
      icon: 'Megaphone',
      capabilities: ['Ad Copy', 'Headlines', 'CTA Generation'],
      bestFor: 'promotional posts, advertisements',
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: 'High-quality image and artwork generation',
      icon: 'Image',
      capabilities: ['Image Creation', 'Artwork', 'Visual Design'],
      bestFor: 'creative visuals, brand imagery',
      color: 'bg-green-500',
      available: true
    },
    {
      id: 'claude',
      name: 'Claude AI',
      description: 'Advanced text and content generation',
      icon: 'FileText',
      capabilities: ['Long-form Content', 'Copywriting', 'Analysis'],
      bestFor: 'detailed captions, articles',
      color: 'bg-orange-500',
      available: true
    },
    {
      id: 'gpt4',
      name: 'GPT-4',
      description: 'Versatile AI for various content types',
      icon: 'Brain',
      capabilities: ['Text Generation', 'Creative Writing', 'Code'],
      bestFor: 'general content, captions',
      color: 'bg-teal-500',
      available: true
    },
    {
      id: 'runway',
      name: 'Runway ML',
      description: 'Creative AI tools for multimedia content',
      icon: 'Zap',
      capabilities: ['Video Editing', 'Audio Generation', 'Creative Effects'],
      bestFor: 'multimedia content, editing',
      color: 'bg-pink-500',
      available: false
    }
  ];

  const contentTypes = [
    { id: 'caption', name: 'Caption', icon: 'Type' },
    { id: 'image', name: 'Image', icon: 'Image' },
    { id: 'video', name: 'Video', icon: 'Video' },
    { id: 'story', name: 'Story', icon: 'BookOpen' },
    { id: 'ad', name: 'Advertisement', icon: 'Target' }
  ];

  const handleGeneratorSelect = (generator) => {
    setSelectedGenerator(generator?.id);
    onGeneratorSelect?.(generator);
  };

  const handleGenerateContent = async () => {
    if (!selectedGenerator) return;
    
    setIsGenerating(true);
    
    // Simulate API call with different responses based on generator
    setTimeout(() => {
      const mockContent = generateMockContent(selectedGenerator, contentType, activePlatform);
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 3000);
  };

  const generateMockContent = (generatorId, type, platform) => {
    const contentMap = {
      veo3: {
        caption: `🎬 Created with VEO-3 AI\n\nExperience the future of video content creation! Our AI-generated video perfectly captures your brand's essence while maximizing engagement on ${platform}.\n\n✨ Key features:\n• Advanced motion graphics\n• Professional transitions\n• Platform-optimized aspect ratio\n\n#VEO3 #AIVideo #${platform}Content #Innovation`,
        image: 'Generated a stunning 4K video preview optimized for ' + platform,
        video: 'Created a 30-second engaging video with custom branding and music'
      },
      adcreative: {
        caption: `🚀 AdCreative AI Generated Content\n\nBoost your ${platform} performance with this conversion-optimized post! Our AI analyzed thousands of high-performing ads to create content that drives results.\n\n💡 Features:\n• High-conversion copy\n• A/B tested headlines\n• Platform-specific CTAs\n\nReady to see 3x more engagement? 📈\n\n#AdCreativeAI #MarketingAI #${platform}Ads #Conversion`,
        image: 'Generated high-converting ad creative with compelling visuals',ad: 'Created complete ad campaign with headlines, descriptions, and CTAs'
      },
      midjourney: {
        caption: `🎨 Midjourney AI Artwork\n\nTransform your ${platform} feed with this breathtaking AI-generated artwork! Every pixel crafted to perfection using advanced AI image generation.\n\n🌟 Artwork specs:\n• Ultra-high resolution\n• Brand-consistent style\n• Optimized for ${platform}\n\n#MidjourneyAI #AIArt #DigitalArt #${platform}Design #Creative`,
        image: 'Generated photorealistic artwork with stunning detail and composition',story: 'Created a series of cohesive story visuals with consistent artistic style'
      },
      claude: {
        caption: `📝 Claude AI Content\n\nCrafted with advanced reasoning and nuanced understanding, this ${platform} post balances informativeness with engagement. Claude AI ensures your message resonates with your specific audience.\n\n🧠 Content highlights:\n• Contextually aware\n• Audience-optimized\n• Brand voice consistent\n• Platform best practices\n\n#ClaudeAI #SmartContent #${platform}Strategy #AIWriting`,
        story: 'Generated compelling long-form narrative optimized for your audience'
      },
      gpt4: {
        caption: `🤖 GPT-4 Generated Content\n\nLeveraging the power of advanced language AI to create engaging ${platform} content that speaks directly to your audience. Versatile, creative, and optimized for maximum impact.\n\n⚡ GPT-4 advantages:\n• Context understanding\n• Creative versatility\n• Multi-language support\n• Trend awareness\n\n#GPT4 #OpenAI #${platform}Content #AIWriting #Innovation`,
        image: 'Generated detailed content brief for visual creation',story: 'Created engaging narrative content with perfect tone and style'
      }
    };

    return contentMap?.[generatorId]?.[type] || `Generated ${type} content using ${generatorId} for ${platform}`;
  };

  const getGeneratorByPlatform = (platform) => {
    const platformRecommendations = {
      instagram: ['veo3', 'midjourney', 'adcreative'],
      facebook: ['adcreative', 'gpt4', 'claude'],
      linkedin: ['claude', 'gpt4', 'adcreative'],
      twitter: ['gpt4', 'claude', 'adcreative']
    };
    return platformRecommendations?.[platform] || [];
  };

  const recommendedForPlatform = getGeneratorByPlatform(activePlatform);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Content Generator</h3>
          <p className="text-sm text-muted-foreground">Choose your AI-powered content creation tool</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Sparkles" size={20} className="text-primary" />
          <span className="text-sm font-medium text-primary">AI Powered</span>
        </div>
      </div>

      {/* Content Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Content Type</label>
        <div className="flex flex-wrap gap-2">
          {contentTypes?.map((type) => (
            <button
              key={type?.id}
              onClick={() => setContentType(type?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                contentType === type?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={type?.icon} size={14} />
              <span>{type?.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generator Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">AI Generator</label>
          <span className="text-xs text-muted-foreground">
            Recommended for {activePlatform}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {generators?.map((generator) => {
            const isRecommended = recommendedForPlatform?.includes(generator?.id);
            const isSelected = selectedGenerator === generator?.id;
            
            return (
              <button
                key={generator?.id}
                onClick={() => generator?.available && handleGeneratorSelect(generator)}
                disabled={!generator?.available}
                className={`relative p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : generator?.available
                    ? 'border-border hover:border-primary/50 hover:bg-muted/50' :'border-muted bg-muted/20 opacity-50 cursor-not-allowed'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Recommended
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${generator?.color} text-white`}>
                    <Icon name={generator?.icon} size={20} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{generator?.name}</h4>
                      {!generator?.available && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{generator?.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {generator?.capabilities?.slice(0, 2)?.map((capability, index) => (
                        <span
                          key={index}
                          className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                        >
                          {capability}
                        </span>
                      ))}
                      {generator?.capabilities?.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{generator?.capabilities?.length - 2} more
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Best for: {generator?.bestFor}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      {selectedGenerator && (
        <div className="space-y-4">
          <Button
            variant="default"
            fullWidth
            onClick={handleGenerateContent}
            loading={isGenerating}
            iconName="Wand2"
            iconPosition="left"
          >
            {isGenerating ? 'Generating Content...' : `Generate ${contentType} with ${generators?.find(g => g?.id === selectedGenerator)?.name}`}
          </Button>

          {/* Generated Content Preview */}
          {generatedContent && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Content Generated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    onClick={() => navigator?.clipboard?.writeText(generatedContent)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onGeneratorSelect?.({ content: generatedContent, type: contentType })}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Use Content
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-foreground whitespace-pre-wrap">{generatedContent}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Generated by {generators?.find(g => g?.id === selectedGenerator)?.name}</span>
                <span>{generatedContent?.length} characters</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generator Info */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Info" size={16} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-foreground">Content Generation Tips</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Choose the generator that best matches your content needs</li>
              <li>• VEO-3 excels at video content and motion graphics</li>
              <li>• AdCreative AI optimizes for conversion and engagement</li>
              <li>• Midjourney creates stunning visual artwork</li>
              <li>• Claude and GPT-4 are perfect for detailed text content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGeneratorSelector;