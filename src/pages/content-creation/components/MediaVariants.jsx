import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MediaVariants = ({ uploadedMedia, activePlatform }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [cropMode, setCropMode] = useState('smart-crop');

  const aspectRatios = {
    instagram: [
      { name: 'Square', ratio: '1:1', width: 1080, height: 1080 },
      { name: 'Portrait', ratio: '4:5', width: 1080, height: 1350 },
      { name: 'Story', ratio: '9:16', width: 1080, height: 1920 }
    ],
    facebook: [
      { name: 'Landscape', ratio: '16:9', width: 1200, height: 675 },
      { name: 'Square', ratio: '1:1', width: 1200, height: 1200 }
    ],
    linkedin: [
      { name: 'Landscape', ratio: '16:9', width: 1200, height: 675 },
      { name: 'Square', ratio: '1:1', width: 1080, height: 1080 }
    ],
    twitter: [
      { name: 'Landscape', ratio: '16:9', width: 1200, height: 675 },
      { name: 'Square', ratio: '1:1', width: 1080, height: 1080 }
    ]
  };

  const cropModes = [
    { id: 'smart-crop', name: 'Smart Crop', description: 'AI-powered intelligent cropping' },
    { id: 'crop', name: 'Center Crop', description: 'Crop from center' },
    { id: 'pad', name: 'Pad', description: 'Add padding to maintain aspect ratio' }
  ];

  const currentRatios = aspectRatios?.[activePlatform] || [];

  const generateVariants = (media) => {
    return currentRatios?.map(ratio => ({
      id: `${media?.id}-${ratio?.ratio}`,
      originalId: media?.id,
      ratio: ratio?.ratio,
      name: ratio?.name,
      width: ratio?.width,
      height: ratio?.height,
      url: media?.url, // In real app, this would be the processed variant URL
      cropMode: cropMode
    }));
  };

  if (uploadedMedia?.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <Icon name="ImageIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Media Uploaded</h3>
        <p className="text-muted-foreground">
          Upload images or videos to see platform-specific variants
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Media Variants</h3>
        <div className="flex items-center space-x-2">
          <select
            value={cropMode}
            onChange={(e) => setCropMode(e?.target?.value)}
            className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {cropModes?.map(mode => (
              <option key={mode?.id} value={mode?.id}>
                {mode?.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Regenerate
          </Button>
        </div>
      </div>
      {/* Crop Mode Info */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground">
            {cropModes?.find(mode => mode?.id === cropMode)?.description}
          </span>
        </div>
      </div>
      {/* Media Selection */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Select Media to Process</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {uploadedMedia?.map((media) => (
            <button
              key={media?.id}
              onClick={() => setSelectedMedia(media)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedMedia?.id === media?.id
                  ? 'border-primary shadow-lg'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {media?.type === 'image' ? (
                <Image
                  src={media?.url}
                  alt={media?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Icon name="Play" size={24} className="text-muted-foreground" />
                </div>
              )}
              {selectedMedia?.id === media?.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={14} color="white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Generated Variants */}
      {selectedMedia && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">
            Variants for {activePlatform} ({selectedMedia?.name})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generateVariants(selectedMedia)?.map((variant) => (
              <div key={variant?.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="relative bg-muted flex items-center justify-center" style={{ aspectRatio: variant?.ratio }}>
                  {selectedMedia?.type === 'image' ? (
                    <Image
                      src={variant?.url}
                      alt={`${variant?.name} variant`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Icon name="Play" size={32} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-foreground">
                    {variant?.ratio}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground">{variant?.name}</h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Dimensions: {variant?.width} × {variant?.height}</div>
                    <div>Crop Mode: {cropModes?.find(m => m?.id === variant?.cropMode)?.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Platform Requirements */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h5 className="font-medium text-foreground mb-3">
          {activePlatform?.charAt(0)?.toUpperCase() + activePlatform?.slice(1)} Requirements
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h6 className="font-medium text-foreground mb-2">Image Specs</h6>
            <ul className="text-muted-foreground space-y-1">
              {activePlatform === 'instagram' && (
                <>
                  <li>• Max file size: 30MB</li>
                  <li>• Formats: JPG, PNG</li>
                  <li>• Min resolution: 320px</li>
                </>
              )}
              {activePlatform === 'facebook' && (
                <>
                  <li>• Max file size: 4MB</li>
                  <li>• Formats: JPG, PNG, GIF</li>
                  <li>• Min resolution: 600px</li>
                </>
              )}
              {activePlatform === 'linkedin' && (
                <>
                  <li>• Max file size: 5MB</li>
                  <li>• Formats: JPG, PNG, GIF</li>
                  <li>• Min resolution: 552px</li>
                </>
              )}
              {activePlatform === 'twitter' && (
                <>
                  <li>• Max file size: 5MB</li>
                  <li>• Formats: JPG, PNG, GIF</li>
                  <li>• Min resolution: 600px</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-foreground mb-2">Video Specs</h6>
            <ul className="text-muted-foreground space-y-1">
              {activePlatform === 'instagram' && (
                <>
                  <li>• Max duration: 60 seconds</li>
                  <li>• Max file size: 100MB</li>
                  <li>• Formats: MP4, MOV</li>
                </>
              )}
              {activePlatform === 'facebook' && (
                <>
                  <li>• Max duration: 240 minutes</li>
                  <li>• Max file size: 4GB</li>
                  <li>• Formats: MP4, MOV</li>
                </>
              )}
              {activePlatform === 'linkedin' && (
                <>
                  <li>• Max duration: 10 minutes</li>
                  <li>• Max file size: 5GB</li>
                  <li>• Formats: MP4, MOV</li>
                </>
              )}
              {activePlatform === 'twitter' && (
                <>
                  <li>• Max duration: 140 seconds</li>
                  <li>• Max file size: 512MB</li>
                  <li>• Formats: MP4, MOV</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaVariants;