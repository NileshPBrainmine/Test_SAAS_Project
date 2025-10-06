import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const EventModal = ({ event, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    caption: '',
    scheduledDate: '',
    scheduledTime: '',
    platforms: [],
    type: 'post',
    recurrence: null,
    status: 'scheduled'
  });

  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrenceData, setRecurrenceData] = useState({
    frequency: 'daily',
    interval: 1,
    endDate: '',
    count: null
  });

  const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' }
  ];

  const typeOptions = [
    { value: 'post', label: 'Post' },
    { value: 'draft', label: 'Draft' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'hold', label: 'Hold' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.scheduledDate);
      setFormData({
        caption: event?.caption || '',
        scheduledDate: eventDate?.toISOString()?.split('T')?.[0],
        scheduledTime: eventDate?.toTimeString()?.slice(0, 5),
        platforms: event?.platforms || [],
        type: event?.type || 'post',
        recurrence: event?.recurrence || null,
        status: event?.status || 'scheduled'
      });
      
      if (event?.recurrence) {
        setShowRecurrence(true);
        setRecurrenceData({
          frequency: event?.recurrence?.frequency || 'daily',
          interval: event?.recurrence?.interval || 1,
          endDate: event?.recurrence?.endDate || '',
          count: event?.recurrence?.count || null
        });
      }
    }
  }, [event]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlatformChange = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev?.platforms?.includes(platform)
        ? prev?.platforms?.filter(p => p !== platform)
        : [...prev?.platforms, platform]
    }));
  };

  const handleRecurrenceChange = (field, value) => {
    setRecurrenceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      ...formData,
      scheduledDate: new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)?.toISOString(),
      recurrence: showRecurrence ? recurrenceData : null
    };
    onSave(updatedEvent);
  };

  const generateAICaption = () => {
    // Mock AI caption generation
    const aiCaptions = [
      "🌟 Exciting news! We're thrilled to share this amazing update with our community. What do you think? #Innovation #Community",
      "✨ Behind the scenes magic happening here! Our team has been working hard to bring you something special. Stay tuned! #BehindTheScenes",
      "🚀 Ready to take your experience to the next level? We\'ve got something incredible in store for you! #NextLevel #Excited"
    ];
    
    const randomCaption = aiCaptions?.[Math.floor(Math.random() * aiCaptions?.length)];
    handleInputChange('caption', randomCaption);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {event?.id ? 'Edit Post' : 'Create Post'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="w-8 h-8"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Media Preview */}
            {event?.media && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Media</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={event?.media?.thumbnail}
                      alt="Post media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Type: {event?.media?.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Size: {event?.media?.size}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Edit"
                      iconPosition="left"
                    >
                      Edit Media
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Caption */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Caption</label>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Sparkles"
                  iconPosition="left"
                  onClick={generateAICaption}
                >
                  AI Generate
                </Button>
              </div>
              <textarea
                value={formData?.caption}
                onChange={(e) => handleInputChange('caption', e?.target?.value)}
                placeholder="Write your caption here..."
                className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                {formData?.caption?.length}/2200 characters
              </p>
            </div>

            {/* Platforms */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Platforms</label>
              <div className="grid grid-cols-2 gap-3">
                {platformOptions?.map((platform) => (
                  <div
                    key={platform?.value}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData?.platforms?.includes(platform?.value)
                        ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
                    }`}
                    onClick={() => handlePlatformChange(platform?.value)}
                  >
                    <Checkbox
                      checked={formData?.platforms?.includes(platform?.value)}
                      onChange={() => handlePlatformChange(platform?.value)}
                    />
                    <Icon name={getPlatformIcon(platform?.value)} size={20} />
                    <span className="text-sm font-medium text-foreground">
                      {platform?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData?.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e?.target?.value)}
              />
              <Input
                label="Time"
                type="time"
                value={formData?.scheduledTime}
                onChange={(e) => handleInputChange('scheduledTime', e?.target?.value)}
              />
            </div>

            {/* Type and Status */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Type"
                options={typeOptions}
                value={formData?.type}
                onChange={(value) => handleInputChange('type', value)}
              />
              <Select
                label="Status"
                options={[
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'pending', label: 'Pending Approval' },
                  { value: 'draft', label: 'Draft' }
                ]}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
              />
            </div>

            {/* Recurrence */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={showRecurrence}
                  onChange={(e) => setShowRecurrence(e?.target?.checked)}
                />
                <label className="text-sm font-medium text-foreground">
                  Recurring Post
                </label>
              </div>
              
              {showRecurrence && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <Select
                    label="Frequency"
                    options={frequencyOptions}
                    value={recurrenceData?.frequency}
                    onChange={(value) => handleRecurrenceChange('frequency', value)}
                  />
                  <Input
                    label="Interval"
                    type="number"
                    min="1"
                    value={recurrenceData?.interval}
                    onChange={(e) => handleRecurrenceChange('interval', parseInt(e?.target?.value))}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={recurrenceData?.endDate}
                    onChange={(e) => handleRecurrenceChange('endDate', e?.target?.value)}
                  />
                  <Input
                    label="Max Occurrences"
                    type="number"
                    min="1"
                    placeholder="Optional"
                    value={recurrenceData?.count || ''}
                    onChange={(e) => handleRecurrenceChange('count', e?.target?.value ? parseInt(e?.target?.value) : null)}
                  />
                </div>
              )}
            </div>

            {/* Validation Warnings */}
            {formData?.platforms?.length === 0 && (
              <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning rounded-lg">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning">Please select at least one platform</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2">
            {event?.id && (
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => onDelete(event)}
              >
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              disabled={!formData?.caption || formData?.platforms?.length === 0}
            >
              {event?.id ? 'Update Post' : 'Schedule Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;