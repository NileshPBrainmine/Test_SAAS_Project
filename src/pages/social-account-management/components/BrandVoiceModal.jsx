import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BrandVoiceModal = ({ isOpen, onClose, account, onSave }) => {
  const [formData, setFormData] = useState({
    tone: account?.brandVoice?.tone || 'professional',
    style: account?.brandVoice?.style || 'informative',
    customPrompt: account?.brandVoice?.customPrompt || '',
    keywords: account?.brandVoice?.keywords || '',
    avoidWords: account?.brandVoice?.avoidWords || '',
    targetAudience: account?.brandVoice?.targetAudience || '',
    brandPersonality: account?.brandVoice?.brandPersonality || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !account) return null;

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'playful', label: 'Playful' },
    { value: 'inspirational', label: 'Inspirational' }
  ];

  const styleOptions = [
    { value: 'informative', label: 'Informative' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'storytelling', label: 'Storytelling' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'educational', label: 'Educational' },
    { value: 'entertaining', label: 'Entertaining' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onSave(account?.id, formData);
      setIsSaving(false);
      onClose();
    }, 1500);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              account?.platform === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
              account?.platform === 'facebook' ? 'bg-blue-600' :
              account?.platform === 'linkedin'? 'bg-blue-700' : 'bg-sky-500'
            }`}>
              <Icon name={getPlatformIcon(account?.platform)} size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Brand Voice Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                @{account?.username} • {account?.platform}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tone of Voice"
              description="How should your content sound?"
              options={toneOptions}
              value={formData?.tone}
              onChange={(value) => handleInputChange('tone', value)}
            />
            
            <Select
              label="Content Style"
              description="What style fits your brand?"
              options={styleOptions}
              value={formData?.style}
              onChange={(value) => handleInputChange('style', value)}
            />
          </div>

          {/* Target Audience */}
          <Input
            label="Target Audience"
            description="Describe your ideal audience (e.g., young professionals, tech enthusiasts)"
            placeholder="Young professionals aged 25-35 interested in technology"
            value={formData?.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e?.target?.value)}
          />

          {/* Brand Personality */}
          <Input
            label="Brand Personality"
            description="Key traits that define your brand"
            placeholder="Innovative, reliable, customer-focused, forward-thinking"
            value={formData?.brandPersonality}
            onChange={(e) => handleInputChange('brandPersonality', e?.target?.value)}
          />

          {/* Keywords */}
          <Input
            label="Preferred Keywords"
            description="Words and phrases to include in content (comma-separated)"
            placeholder="innovation, technology, solutions, growth, success"
            value={formData?.keywords}
            onChange={(e) => handleInputChange('keywords', e?.target?.value)}
          />

          {/* Avoid Words */}
          <Input
            label="Words to Avoid"
            description="Words or phrases to exclude from content (comma-separated)"
            placeholder="cheap, basic, outdated, limited"
            value={formData?.avoidWords}
            onChange={(e) => handleInputChange('avoidWords', e?.target?.value)}
          />

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Custom AI Prompt
            </label>
            <p className="text-sm text-muted-foreground mb-3">
              Additional instructions for AI content generation
            </p>
            <textarea
              className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-input text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder={`Write engaging ${account?.platform} posts that showcase our innovative solutions. Always include a call-to-action and relevant hashtags. Keep the tone professional yet approachable.`}
              value={formData?.customPrompt}
              onChange={(e) => handleInputChange('customPrompt', e?.target?.value)}
            />
          </div>

          {/* Preview */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold text-card-foreground mb-2 flex items-center">
              <Icon name="Eye" size={16} className="mr-2" />
              Preview Settings
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium">Tone:</span> {toneOptions?.find(t => t?.value === formData?.tone)?.label}</p>
              <p><span className="font-medium">Style:</span> {styleOptions?.find(s => s?.value === formData?.style)?.label}</p>
              <p><span className="font-medium">Audience:</span> {formData?.targetAudience || 'Not specified'}</p>
              <p><span className="font-medium">Keywords:</span> {formData?.keywords || 'None specified'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              iconName="TestTube"
              iconPosition="left"
            >
              Test Generation
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandVoiceModal;