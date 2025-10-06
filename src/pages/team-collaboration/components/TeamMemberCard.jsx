import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TeamMemberCard = ({ member, onRoleChange, onRemoveMember, currentUserRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member?.role);

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-error text-error-foreground';
      case 'editor': return 'bg-warning text-warning-foreground';
      case 'viewer': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-muted';
      case 'pending': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const handleSaveRole = () => {
    onRoleChange(member?.id, selectedRole);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setSelectedRole(member?.role);
    setIsEditing(false);
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInHours = Math.floor((now - activity) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const canEditMember = currentUserRole === 'admin' && member?.role !== 'admin';

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={member?.avatar}
              alt={member?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member?.status)}`} />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{member?.name}</h3>
            <p className="text-sm text-muted-foreground">{member?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Last active: {formatLastActivity(member?.lastActivity)}
            </p>
          </div>
        </div>
        
        {canEditMember && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              onClick={() => onRemoveMember(member?.id)}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Role</span>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Select
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
                className="w-32"
              />
              <Button variant="success" size="xs" onClick={handleSaveRole}>
                Save
              </Button>
              <Button variant="ghost" size="xs" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          ) : (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleColor(member?.role)}`}>
              {member?.role?.charAt(0)?.toUpperCase() + member?.role?.slice(1)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Permissions</span>
          <div className="flex items-center space-x-2">
            {member?.permissions?.map((permission, index) => (
              <div key={index} className="flex items-center space-x-1">
                <Icon 
                  name={permission?.icon} 
                  size={14} 
                  className="text-muted-foreground" 
                />
                <span className="text-xs text-muted-foreground">{permission?.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Content Created</span>
          <span className="text-sm font-medium text-card-foreground">{member?.contentCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Joined</span>
          <span className="text-sm text-muted-foreground">{member?.joinedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;