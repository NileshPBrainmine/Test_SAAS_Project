import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIAssistant = ({ onCaptionGenerated, activePlatform }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedCaptions, setGeneratedCaptions] = useState([]);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  const defaultPrompts = {
    instagram: 'Create an engaging Instagram caption with emojis and relevant hashtags',
    facebook: 'Write a conversational Facebook post that encourages engagement',
    linkedin: 'Generate a professional LinkedIn post with industry insights',
    twitter: 'Create a concise Twitter post with trending hashtags'
  };

  const mockGeneratedCaptions = [
    {
      id: 1,
      text: `🚀 Exciting news! We're launching our new AI-powered social media management tool that will revolutionize how you create and schedule content across all platforms.\n\nSay goodbye to manual posting and hello to intelligent automation! ✨\n\n#SocialMedia #AI #Marketing #ContentCreation #Automation`,
      tone: 'Excited'
    },
    {
      id: 2,
      text: `Transform your social media strategy with our cutting-edge AI technology. Create, optimize, and schedule content that resonates with your audience across Instagram, Facebook, LinkedIn, and Twitter.\n\nReady to boost your engagement? 📈\n\n#DigitalMarketing #SocialMediaTools #BusinessGrowth`,
      tone: 'Professional'
    },
    {
      id: 3,
      text: `Managing multiple social media accounts just got easier! 💪\n\nOur new platform uses AI to generate personalized content for each channel, ensuring your message hits the right note every time.\n\nWho's ready to save hours on content creation? 🙋‍♀️\n\n#ProductivityHack #SocialMediaManagement #TimesSaver`,
      tone: 'Casual'
    }
  ];

  const handleGenerateCaptions = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setGeneratedCaptions(mockGeneratedCaptions);
      setIsGenerating(false);
    }, 2000);
  };

  const handleUseCaption = (caption) => {
    onCaptionGenerated(caption?.text);
  };

  const handleRegenerateWithPrompt = async () => {
    if (!customPrompt?.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate custom prompt generation
    setTimeout(() => {
      const customCaptions = [
        {
          id: 4,
          text: `Based on your custom prompt: "${customPrompt}"\n\nHere's a tailored caption that matches your specific requirements and brand voice. This content is optimized for ${activePlatform} and designed to drive engagement.\n\n#CustomContent #BrandVoice #Engagement`,
          tone: 'Custom'
        }
      ];
      setGeneratedCaptions(customCaptions);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">AI Caption Assistant</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCustomPrompt(!showCustomPrompt)}
          iconName="Settings"
        />
      </div>
      {/* Custom Prompt Section */}
      {showCustomPrompt && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <label className="text-sm font-medium text-foreground">Custom Prompt</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e?.target?.value)}
            placeholder="Describe the tone, style, or specific requirements for your caption..."
            className="w-full h-20 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder-muted-foreground text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateWithPrompt}
            loading={isGenerating}
            iconName="Wand2"
            iconPosition="left"
            disabled={!customPrompt?.trim()}
          >
            Generate with Custom Prompt
          </Button>
        </div>
      )}
      {/* Default Generation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Generate 3 caption variations for {activePlatform}
          </p>
          <Button
            variant="default"
            onClick={handleGenerateCaptions}
            loading={isGenerating}
            iconName="Sparkles"
            iconPosition="left"
          >
            {isGenerating ? 'Generating...' : 'Generate Captions'}
          </Button>
        </div>

        {/* Generated Captions */}
        {generatedCaptions?.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Generated Captions</h4>
            {generatedCaptions?.map((caption) => (
              <div key={caption?.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {caption?.tone} Tone
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      onClick={() => navigator.clipboard?.writeText(caption?.text)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseCaption(caption)}
                      iconName="Check"
                      iconPosition="left"
                    >
                      Use This
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {caption?.text}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{caption?.text?.length} characters</span>
                  <span>{(caption?.text?.match(/#\w+/g) || [])?.length} hashtags</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Lightbulb" size={16} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">AI Writing Tips</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be specific about your target audience and goals</li>
                <li>• Include your brand voice and tone preferences</li>
                <li>• Mention any specific keywords or hashtags to include</li>
                <li>• Specify the call-to-action you want to include</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;