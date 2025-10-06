import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkScheduleModal = ({ isOpen, onClose, onSchedule }) => {
  const [scheduleType, setScheduleType] = useState('auto');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([
    { time: '09:00', enabled: true },
    { time: '13:00', enabled: true },
    { time: '17:00', enabled: true },
    { time: '20:00', enabled: false }
  ]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date()?.toISOString()?.split('T')?.[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0]
  });
  const [contentQueue, setContentQueue] = useState([]);

  const platformOptions = [
    { value: 'instagram', label: 'Instagram', bestTimes: ['11:00', '14:00', '17:00'] },
    { value: 'facebook', label: 'Facebook', bestTimes: ['13:00', '15:00', '19:00'] },
    { value: 'linkedin', label: 'LinkedIn', bestTimes: ['09:00', '12:00', '17:00'] },
    { value: 'twitter', label: 'Twitter', bestTimes: ['08:00', '12:00', '15:00'] }
  ];

  const scheduleTypeOptions = [
    { value: 'auto', label: 'Auto-Schedule (Best Times)' },
    { value: 'custom', label: 'Custom Time Slots' },
    { value: 'bulk', label: 'Bulk Upload from CSV' }
  ];

  // Mock content queue
  const mockContentQueue = [
    {
      id: 1,
      caption: "🌟 Exciting product launch coming soon! Stay tuned for amazing updates.",
      media: { thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400", type: "image" },
      platforms: ['instagram', 'facebook'],
      priority: 'high'
    },
    {
      id: 2,
      caption: "Behind the scenes: Our team working hard to deliver excellence every day.",
      media: { thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400", type: "image" },
      platforms: ['linkedin', 'twitter'],
      priority: 'medium'
    },
    {
      id: 3,
      caption: "Customer success story: How we helped transform their business journey.",
      media: { thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400", type: "image" },
      platforms: ['linkedin'],
      priority: 'low'
    }
  ];

  React.useEffect(() => {
    if (isOpen) {
      setContentQueue(mockContentQueue);
    }
  }, [isOpen]);

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev =>
      prev?.includes(platform)
        ? prev?.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleTimeSlotToggle = (index) => {
    setTimeSlots(prev =>
      prev?.map((slot, i) =>
        i === index ? { ...slot, enabled: !slot?.enabled } : slot
      )
    );
  };

  const handleAddTimeSlot = () => {
    setTimeSlots(prev => [...prev, { time: '12:00', enabled: true }]);
  };

  const handleRemoveTimeSlot = (index) => {
    setTimeSlots(prev => prev?.filter((_, i) => i !== index));
  };

  const handleSchedule = () => {
    const scheduleData = {
      type: scheduleType,
      platforms: selectedPlatforms,
      timeSlots: timeSlots?.filter(slot => slot?.enabled),
      dateRange,
      content: contentQueue
    };
    onSchedule(scheduleData);
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

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-error bg-error/5',
      medium: 'border-warning bg-warning/5',
      low: 'border-success bg-success/5'
    };
    return colors?.[priority] || 'border-border bg-surface';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Bulk Schedule Posts</h2>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Settings */}
            <div className="space-y-6">
              {/* Schedule Type */}
              <div>
                <Select
                  label="Schedule Type"
                  options={scheduleTypeOptions}
                  value={scheduleType}
                  onChange={setScheduleType}
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Select Platforms</label>
                <div className="grid grid-cols-2 gap-3">
                  {platformOptions?.map((platform) => (
                    <div
                      key={platform?.value}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPlatforms?.includes(platform?.value)
                          ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
                      }`}
                      onClick={() => handlePlatformToggle(platform?.value)}
                    >
                      <Checkbox
                        checked={selectedPlatforms?.includes(platform?.value)}
                        onChange={() => handlePlatformToggle(platform?.value)}
                      />
                      <Icon name={getPlatformIcon(platform?.value)} size={20} />
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {platform?.label}
                        </span>
                        {scheduleType === 'auto' && (
                          <p className="text-xs text-muted-foreground">
                            Best: {platform?.bestTimes?.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={dateRange?.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e?.target?.value }))}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={dateRange?.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e?.target?.value }))}
                />
              </div>

              {/* Custom Time Slots */}
              {scheduleType === 'custom' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Time Slots</label>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Plus"
                      onClick={handleAddTimeSlot}
                    >
                      Add Slot
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {timeSlots?.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox
                          checked={slot?.enabled}
                          onChange={() => handleTimeSlotToggle(index)}
                        />
                        <Input
                          type="time"
                          value={slot?.time}
                          onChange={(e) => {
                            const newSlots = [...timeSlots];
                            newSlots[index].time = e?.target?.value;
                            setTimeSlots(newSlots);
                          }}
                          className="flex-1"
                        />
                        {timeSlots?.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            onClick={() => handleRemoveTimeSlot(index)}
                            className="w-8 h-8 text-error hover:text-error"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CSV Upload */}
              {scheduleType === 'bulk' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Upload CSV File</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop your CSV file here or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      CSV should include: caption, date, time, platforms
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Content Queue */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Content Queue ({contentQueue?.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Content
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {contentQueue?.map((content, index) => (
                  <div
                    key={content?.id}
                    className={`p-4 border rounded-lg ${getPriorityColor(content?.priority)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={content?.media?.thumbnail}
                          alt="Content thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-2 mb-2">
                          {content?.caption}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {content?.platforms?.map((platform, idx) => (
                              <Icon
                                key={idx}
                                name={getPlatformIcon(platform)}
                                size={14}
                                className="text-muted-foreground"
                              />
                            ))}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            content?.priority === 'high' ? 'bg-error/20 text-error' :
                            content?.priority === 'medium'? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                          }`}>
                            {content?.priority}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreVertical"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule Preview */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Schedule Preview</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• {contentQueue?.length} posts to schedule</p>
                  <p>• {selectedPlatforms?.length} platforms selected</p>
                  <p>• {scheduleType === 'custom' ? timeSlots?.filter(s => s?.enabled)?.length : 'Auto'} time slots</p>
                  <p>• Date range: {dateRange?.startDate} to {dateRange?.endDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            This will schedule {contentQueue?.length} posts across {selectedPlatforms?.length} platforms
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSchedule}
              disabled={selectedPlatforms?.length === 0 || contentQueue?.length === 0}
              iconName="Calendar"
              iconPosition="left"
            >
              Schedule All Posts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkScheduleModal;