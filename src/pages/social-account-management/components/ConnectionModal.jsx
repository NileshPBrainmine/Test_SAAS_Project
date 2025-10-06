import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionModal = ({ isOpen, onClose, platform, onConnect }) => {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const platformConfig = {
    instagram: {
      name: 'Instagram',
      icon: 'Instagram',
      color: 'from-purple-500 to-pink-500',
      permissions: ['Basic Profile', 'Media Publishing', 'Insights Access'],
      requirements: `• Business or Creator account required\n• Must have Facebook Page connected\n• Posting permissions needed`,
      steps: [
        'Click "Connect Instagram" below',
        'Log in to your Instagram account',
        'Grant required permissions',
        'Confirm account connection'
      ]
    },
    facebook: {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-600',
      permissions: ['Page Management', 'Content Publishing', 'Analytics Access'],
      requirements: `• Facebook Page admin access required\n• Business Manager account recommended\n• Publishing permissions needed`,
      steps: [
        'Click "Connect Facebook" below',
        'Select your Facebook Page',
        'Grant publishing permissions',
        'Verify connection status'
      ]
    },
    linkedin: {
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: 'bg-blue-700',
      permissions: ['Profile Access', 'Company Page Management', 'Content Sharing'],
      requirements: `• LinkedIn Company Page admin access\n• Professional account recommended\n• Content sharing permissions needed`,
      steps: [
        'Click "Connect LinkedIn" below',
        'Authorize SocialSync Pro',
        'Select company pages to manage',
        'Confirm integration setup'
      ]
    },
    twitter: {
      name: 'Twitter/X',
      icon: 'Twitter',
      color: 'bg-sky-500',
      permissions: ['Tweet Publishing', 'Media Upload', 'Account Analytics'],
      requirements: `• Twitter/X account with API access\n• Tweet and media permissions required\n• Analytics access recommended`,
      steps: [
        'Click "Connect Twitter/X" below',
        'Authorize application access',
        'Grant posting permissions',
        'Complete setup process'
      ]
    }
  };

  const config = platformConfig?.[platform];

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate OAuth flow
    setTimeout(() => {
      onConnect(platform);
      setIsConnecting(false);
      setStep(1);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${config?.color}`}>
              <Icon name={config?.icon} size={20} color="white" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Connect {config?.name}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Requirements</h3>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm text-muted-foreground whitespace-pre-line font-sans">
                    {config?.requirements}
                  </pre>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Permissions Needed</h3>
                <div className="space-y-2">
                  {config?.permissions?.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-card-foreground">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Shield" size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Secure Connection</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your credentials are encrypted and never stored on our servers. 
                      You can revoke access anytime from your {config?.name} settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose} fullWidth>
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => setStep(2)} 
                  fullWidth
                  iconName="ArrowRight"
                  iconPosition="right"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Steps */}
              <div>
                <h3 className="font-semibold text-card-foreground mb-3">Connection Steps</h3>
                <div className="space-y-3">
                  {config?.steps?.map((stepText, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm text-card-foreground pt-0.5">{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connect Button */}
              <div className="space-y-3">
                <Button
                  variant="default"
                  onClick={handleConnect}
                  loading={isConnecting}
                  fullWidth
                  iconName={config?.icon}
                  iconPosition="left"
                >
                  {isConnecting ? 'Connecting...' : `Connect ${config?.name}`}
                </Button>
                
                <Button variant="ghost" onClick={() => setStep(1)} fullWidth>
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;