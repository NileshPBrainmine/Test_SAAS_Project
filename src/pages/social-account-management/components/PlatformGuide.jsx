import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlatformGuide = ({ isOpen, onClose, platform }) => {
  const [activeTab, setActiveTab] = useState('requirements');

  if (!isOpen) return null;

  const platformData = {
    instagram: {
      name: 'Instagram',
      icon: 'Instagram',
      color: 'from-purple-500 to-pink-500',
      requirements: {
        account: 'Business or Creator account',
        connection: 'Facebook Page connection required',
        permissions: 'Content publishing and insights access'
      },
      formats: {
        image: { ratio: '1:1, 4:5, 9:16', size: 'Max 30MB', formats: 'JPG, PNG' },
        video: { ratio: '1:1, 4:5, 9:16', size: 'Max 4GB', duration: '3-60 seconds', formats: 'MP4, MOV' },
        carousel: { images: '2-10 images', ratio: '1:1 recommended' }
      },
      bestPractices: [
        'Use high-quality, visually appealing images',
        'Include relevant hashtags (5-10 recommended)',
        'Post consistently during peak hours (11 AM - 1 PM)',
        'Engage with your audience through Stories',
        'Use Instagram-specific features like Reels and IGTV'
      ]
    },
    facebook: {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-600',
      requirements: {
        account: 'Facebook Page admin access',
        connection: 'Business Manager recommended',
        permissions: 'Page management and publishing rights'
      },
      formats: {
        image: { ratio: '1.91:1, 1:1', size: 'Max 10MB', formats: 'JPG, PNG, GIF' },
        video: { ratio: '16:9, 1:1, 9:16', size: 'Max 4GB', duration: '1-240 minutes', formats: 'MP4, MOV, AVI' },
        link: { preview: 'Auto-generated from URL', description: 'Up to 90 characters' }
      },
      bestPractices: [
        'Write engaging captions with clear call-to-actions',
        'Use Facebook-native video for better reach',
        'Post when your audience is most active',
        'Encourage comments and shares',
        'Use Facebook Events for announcements'
      ]
    },
    linkedin: {
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: 'bg-blue-700',
      requirements: {
        account: 'LinkedIn Company Page admin',
        connection: 'Professional account recommended',
        permissions: 'Content sharing and analytics access'
      },
      formats: {
        image: { ratio: '1.91:1, 1:1', size: 'Max 5MB', formats: 'JPG, PNG, GIF' },
        video: { ratio: '1:2.4 to 2.4:1', size: 'Max 5GB', duration: '3 seconds - 10 minutes', formats: 'MP4, MOV, WMV' },
        document: { formats: 'PDF, PPT, DOC', size: 'Max 100MB', pages: 'Up to 300 pages' }
      },
      bestPractices: [
        'Share professional insights and industry news',
        'Use professional tone and language',
        'Include relevant industry hashtags',
        'Post during business hours (Tuesday-Thursday)',
        'Engage with professional network actively'
      ]
    },
    twitter: {
      name: 'Twitter/X',
      icon: 'Twitter',
      color: 'bg-sky-500',
      requirements: {
        account: 'Twitter/X account with API access',
        connection: 'Developer account for advanced features',
        permissions: 'Tweet publishing and media upload'
      },
      formats: {
        text: { limit: '280 characters', threads: 'Up to 25 tweets' },
        image: { ratio: '16:9, 1:1', size: 'Max 5MB', formats: 'JPG, PNG, GIF, WebP' },
        video: { ratio: '1:2.39 to 2.39:1', size: 'Max 512MB', duration: '2 minutes 20 seconds', formats: 'MP4, MOV' }
      },
      bestPractices: [
        'Keep tweets concise and engaging',
        'Use trending hashtags strategically',
        'Tweet frequently throughout the day',
        'Engage with trending topics when relevant',
        'Use Twitter Spaces for live conversations'
      ]
    }
  };

  const data = platformData?.[platform];
  if (!data) return null;

  const tabs = [
    { id: 'requirements', label: 'Requirements', icon: 'CheckCircle' },
    { id: 'formats', label: 'Content Formats', icon: 'Image' },
    { id: 'practices', label: 'Best Practices', icon: 'Lightbulb' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${data?.color}`}>
              <Icon name={data?.icon} size={20} color="white" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">
              {data?.name} Integration Guide
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-0">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-card-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-card-foreground">
                Account Requirements
              </h3>
              <div className="grid gap-4">
                {Object.entries(data?.requirements)?.map(([key, value]) => (
                  <div key={key} className="flex items-start space-x-3">
                    <Icon name="Check" size={16} className="text-success mt-0.5" />
                    <div>
                      <p className="font-medium text-card-foreground capitalize">
                        {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                      </p>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'formats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-card-foreground">
                Supported Content Formats
              </h3>
              <div className="grid gap-6">
                {Object.entries(data?.formats)?.map(([type, specs]) => (
                  <div key={type} className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground capitalize mb-3">
                      {type} Content
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(specs)?.map(([spec, value]) => (
                        <div key={spec}>
                          <p className="text-sm font-medium text-card-foreground capitalize">
                            {spec?.replace(/([A-Z])/g, ' $1')?.trim()}
                          </p>
                          <p className="text-sm text-muted-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'practices' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-card-foreground">
                Best Practices for {data?.name}
              </h3>
              <div className="space-y-3">
                {data?.bestPractices?.map((practice, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
                    <p className="text-sm text-card-foreground">{practice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <Button variant="default" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformGuide;