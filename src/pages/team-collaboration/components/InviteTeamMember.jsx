import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InviteTeamMember = ({ onInvite, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'viewer',
    permissions: [],
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const permissionOptions = [
    { id: 'create_content', label: 'Create Content', description: 'Can create new posts and campaigns' },
    { id: 'edit_content', label: 'Edit Content', description: 'Can modify existing content' },
    { id: 'delete_content', label: 'Delete Content', description: 'Can remove content' },
    { id: 'schedule_content', label: 'Schedule Content', description: 'Can schedule posts' },
    { id: 'approve_content', label: 'Approve Content', description: 'Can approve pending content' },
    { id: 'view_analytics', label: 'View Analytics', description: 'Can access performance data' },
    { id: 'manage_team', label: 'Manage Team', description: 'Can invite and manage team members' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev?.permissions?.includes(permissionId)
        ? prev?.permissions?.filter(p => p !== permissionId)
        : [...prev?.permissions, permissionId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onInvite(formData);
      // Reset form
      setFormData({
        email: '',
        name: '',
        role: 'viewer',
        permissions: [],
        message: ''
      });
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPermissions = (role) => {
    switch (role) {
      case 'admin':
        return permissionOptions?.map(p => p?.id);
      case 'editor':
        return ['create_content', 'edit_content', 'schedule_content', 'view_analytics'];
      case 'viewer':
        return ['view_analytics'];
      default:
        return [];
    }
  };

  const handleRoleChange = (newRole) => {
    setFormData(prev => ({
      ...prev,
      role: newRole,
      permissions: getDefaultPermissions(newRole)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Invite Team Member</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send an invitation to join your workspace
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="colleague@company.com"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
            />
          </div>

          <Select
            label="Role"
            description="Choose the appropriate role for this team member"
            options={roleOptions}
            value={formData?.role}
            onChange={handleRoleChange}
          />

          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-3">Permissions</h3>
            <div className="space-y-3 bg-muted/50 rounded-lg p-4">
              {permissionOptions?.map((permission) => (
                <div key={permission?.id} className="flex items-start space-x-3">
                  <Checkbox
                    checked={formData?.permissions?.includes(permission?.id)}
                    onChange={() => handlePermissionToggle(permission?.id)}
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-card-foreground cursor-pointer">
                      {permission?.label}
                    </label>
                    <p className="text-xs text-muted-foreground">{permission?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Input
            label="Personal Message (Optional)"
            type="text"
            placeholder="Welcome to our team! Looking forward to working with you."
            value={formData?.message}
            onChange={(e) => handleInputChange('message', e?.target?.value)}
            description="Add a personal note to the invitation email"
          />

          {errors?.submit && (
            <div className="flex items-center space-x-2 text-error text-sm">
              <Icon name="AlertCircle" size={16} />
              <span>{errors?.submit}</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="success" 
              loading={isLoading}
              iconName="Send"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteTeamMember;