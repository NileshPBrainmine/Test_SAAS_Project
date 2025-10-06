import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationSettings = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const notificationTypes = [
    {
      id: 'content_approval',
      title: 'Content Approval Requests',
      description: 'When content needs your approval',
      icon: 'CheckCircle'
    },
    {
      id: 'content_published',
      title: 'Content Published',
      description: 'When your content goes live',
      icon: 'Send'
    },
    {
      id: 'team_activity',
      title: 'Team Activity',
      description: 'When team members create or edit content',
      icon: 'Users'
    },
    {
      id: 'mentions',
      title: 'Mentions & Comments',
      description: 'When someone mentions you or comments',
      icon: 'MessageCircle'
    },
    {
      id: 'schedule_changes',
      title: 'Schedule Changes',
      description: 'When content scheduling is modified',
      icon: 'Calendar'
    },
    {
      id: 'system_updates',
      title: 'System Updates',
      description: 'Important system notifications and updates',
      icon: 'Bell'
    }
  ];

  const frequencyOptions = [
    { value: 'instant', label: 'Instant' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' }
  ];

  const handleToggleNotification = (notificationId, channel) => {
    const updatedSettings = {
      ...localSettings,
      [notificationId]: {
        ...localSettings?.[notificationId],
        [channel]: !localSettings?.[notificationId]?.[channel]
      }
    };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleFrequencyChange = (frequency) => {
    const updatedSettings = {
      ...localSettings,
      emailFrequency: frequency
    };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Notification Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure how and when you receive notifications
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleResetSettings}>
              Reset
            </Button>
            <Button variant="success" size="sm" onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-4">Email Notifications</h3>
            <div className="mb-4">
              <Select
                label="Email Frequency"
                description="How often you want to receive email notifications"
                options={frequencyOptions}
                value={localSettings?.emailFrequency || 'daily'}
                onChange={handleFrequencyChange}
                className="max-w-xs"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-4">Notification Types</h3>
            <div className="space-y-4">
              {notificationTypes?.map((notification) => (
                <div key={notification?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name={notification?.icon} size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground">{notification?.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{notification?.description}</p>
                      
                      <div className="flex items-center space-x-6">
                        <Checkbox
                          label="Email"
                          checked={localSettings?.[notification?.id]?.email || false}
                          onChange={() => handleToggleNotification(notification?.id, 'email')}
                        />
                        <Checkbox
                          label="In-App"
                          checked={localSettings?.[notification?.id]?.inApp || false}
                          onChange={() => handleToggleNotification(notification?.id, 'inApp')}
                        />
                        <Checkbox
                          label="Push"
                          checked={localSettings?.[notification?.id]?.push || false}
                          onChange={() => handleToggleNotification(notification?.id, 'push')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-medium text-card-foreground mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Volume2"
                onClick={() => {
                  const allEnabled = { ...localSettings };
                  notificationTypes?.forEach(type => {
                    allEnabled[type.id] = { email: true, inApp: true, push: true };
                  });
                  setLocalSettings(allEnabled);
                  setHasChanges(true);
                }}
              >
                Enable All
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="VolumeX"
                onClick={() => {
                  const allDisabled = { ...localSettings };
                  notificationTypes?.forEach(type => {
                    allDisabled[type.id] = { email: false, inApp: false, push: false };
                  });
                  setLocalSettings(allDisabled);
                  setHasChanges(true);
                }}
              >
                Disable All
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Mail"
                onClick={() => {
                  const emailOnly = { ...localSettings };
                  notificationTypes?.forEach(type => {
                    emailOnly[type.id] = { email: true, inApp: false, push: false };
                  });
                  setLocalSettings(emailOnly);
                  setHasChanges(true);
                }}
              >
                Email Only
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;