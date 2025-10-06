import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SchedulingControls = ({ onSchedule, onPublishNow, isValid }) => {
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [recurrence, setRecurrence] = useState('none');
  const [isPublishing, setIsPublishing] = useState(false);

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
  ];

  const recurrenceOptions = [
    { value: 'none', label: 'No Repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const scheduleTypeOptions = [
    { value: 'now', label: 'Publish Now' },
    { value: 'scheduled', label: 'Schedule for Later' },
    { value: 'optimal', label: 'Best Time (AI Suggested)' }
  ];

  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      await onPublishNow();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSchedule = async () => {
    const scheduleData = {
      type: scheduleType,
      date: scheduledDate,
      time: scheduledTime,
      timezone,
      recurrence: recurrence !== 'none' ? recurrence : null
    };
    
    setIsPublishing(true);
    try {
      await onSchedule(scheduleData);
    } finally {
      setIsPublishing(false);
    }
  };

  const getOptimalTimes = () => {
    return [
      { time: '09:00', engagement: '85%', day: 'Today' },
      { time: '15:00', engagement: '92%', day: 'Today' },
      { time: '19:00', engagement: '88%', day: 'Today' },
      { time: '10:00', engagement: '90%', day: 'Tomorrow' }
    ];
  };

  const isScheduleValid = () => {
    if (scheduleType === 'now' || scheduleType === 'optimal') return true;
    return scheduledDate && scheduledTime;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Publishing Options</h3>
        <div className="flex items-center space-x-2">
          {!isValid && (
            <div className="flex items-center space-x-1 text-warning">
              <Icon name="AlertTriangle" size={16} />
              <span className="text-sm">Content validation required</span>
            </div>
          )}
        </div>
      </div>
      {/* Schedule Type Selection */}
      <div className="space-y-4">
        <Select
          label="Publishing Option"
          options={scheduleTypeOptions}
          value={scheduleType}
          onChange={setScheduleType}
        />

        {/* Immediate Publishing */}
        {scheduleType === 'now' && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Publish Immediately</h4>
                <p className="text-sm text-muted-foreground">
                  Your content will be posted to all selected platforms right away
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Publishing */}
        {scheduleType === 'scheduled' && (
          <div className="space-y-4 bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground">Schedule Details</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                required
              />
              
              <Input
                label="Time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e?.target?.value)}
                required
              />
            </div>

            <Select
              label="Timezone"
              options={timezoneOptions}
              value={timezone}
              onChange={setTimezone}
            />

            <Select
              label="Repeat"
              options={recurrenceOptions}
              value={recurrence}
              onChange={setRecurrence}
            />

            {recurrence !== 'none' && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Repeat" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Recurring Post</p>
                    <p>This post will be published {recurrence} starting from the selected date and time.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Optimal Time Publishing */}
        {scheduleType === 'optimal' && (
          <div className="space-y-4 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <h4 className="font-medium text-foreground">AI-Suggested Best Times</h4>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Based on your audience engagement patterns, here are the optimal posting times:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getOptimalTimes()?.map((slot, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {slot?.day} at {slot?.time}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expected engagement: {slot?.engagement}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow?.setDate(tomorrow?.getDate() + 1);
                        
                        setScheduledDate(slot?.day === 'Today' ? today?.toISOString()?.split('T')?.[0]
                          : tomorrow?.toISOString()?.split('T')?.[0]
                        );
                        setScheduledTime(slot?.time);
                        setScheduleType('scheduled');
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Validation Messages */}
      {!isValid && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-error">Content Validation Required</h4>
              <ul className="text-sm text-error space-y-1">
                <li>• Add a caption or media content</li>
                <li>• Ensure media meets platform requirements</li>
                <li>• Check character limits for selected platforms</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          fullWidth
          iconName="Save"
          iconPosition="left"
          disabled={!isValid}
        >
          Save as Draft
        </Button>
        
        {scheduleType === 'now' ? (
          <Button
            variant="default"
            fullWidth
            onClick={handlePublishNow}
            loading={isPublishing}
            disabled={!isValid}
            iconName="Send"
            iconPosition="left"
          >
            {isPublishing ? 'Publishing...' : 'Publish Now'}
          </Button>
        ) : (
          <Button
            variant="default"
            fullWidth
            onClick={handleSchedule}
            loading={isPublishing}
            disabled={!isValid || !isScheduleValid()}
            iconName="Calendar"
            iconPosition="left"
          >
            {isPublishing ? 'Scheduling...' : 'Schedule Post'}
          </Button>
        )}
      </div>
      {/* Publishing Info */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Publishing Notes:</p>
            <ul className="space-y-1">
              <li>• Posts are automatically formatted for each platform</li>
              <li>• You'll receive notifications when posts are published</li>
              <li>• Scheduled posts can be edited or cancelled anytime</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingControls;