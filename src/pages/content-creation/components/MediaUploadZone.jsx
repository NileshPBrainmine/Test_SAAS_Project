import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MediaUploadZone = ({ onMediaUpload, uploadedMedia, onRemoveMedia }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    files?.forEach(file => {
      if (file?.type?.startsWith('image/') || file?.type?.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const mediaItem = {
            id: Date.now() + Math.random(),
            file,
            url: e?.target?.result,
            type: file?.type?.startsWith('image/') ? 'image' : 'video',
            name: file?.name,
            size: file?.size
          };
          onMediaUpload(mediaItem);
        };
        reader?.readAsDataURL(file);
      }
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            <Icon name="Upload" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Media Files
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your images or videos here, or click to browse
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              iconName="FolderOpen"
              iconPosition="left"
            >
              Browse Files
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Supports: JPG, PNG, GIF, MP4, MOV (Max 100MB)
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      {/* Uploaded Media Preview */}
      {uploadedMedia?.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Uploaded Media</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedMedia?.map((media) => (
              <div key={media?.id} className="relative bg-card border border-border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {media?.type === 'image' ? (
                    <Image
                      src={media?.url}
                      alt={media?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media?.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {media?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(media?.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMedia(media?.id)}
                      iconName="X"
                      className="ml-2"
                    />
                  </div>
                </div>
                <button
                  onClick={() => onRemoveMedia(media?.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center hover:bg-error/80 transition-colors"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploadZone;