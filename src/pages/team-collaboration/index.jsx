import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TeamMemberCard from './components/TeamMemberCard';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import ActivityFeed from './components/ActivityFeed';
import NotificationSettings from './components/NotificationSettings';
import InviteTeamMember from './components/InviteTeamMember';

const TeamCollaboration = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentUserRole] = useState('admin'); // Mock current user role

  // Mock team members data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      role: "admin",
      status: "active",
      lastActivity: new Date(Date.now() - 1800000), // 30 minutes ago
      permissions: [
        { name: "Create", icon: "Plus" },
        { name: "Edit", icon: "Edit" },
        { name: "Approve", icon: "Check" },
        { name: "Analytics", icon: "BarChart" }
      ],
      contentCount: 45,
      joinedDate: "Jan 15, 2024"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "editor",
      status: "active",
      lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
      permissions: [
        { name: "Create", icon: "Plus" },
        { name: "Edit", icon: "Edit" },
        { name: "Schedule", icon: "Calendar" }
      ],
      contentCount: 32,
      joinedDate: "Feb 3, 2024"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      role: "viewer",
      status: "inactive",
      lastActivity: new Date(Date.now() - 86400000), // 1 day ago
      permissions: [
        { name: "View", icon: "Eye" },
        { name: "Analytics", icon: "BarChart" }
      ],
      contentCount: 8,
      joinedDate: "Mar 10, 2024"
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "editor",
      status: "pending",
      lastActivity: new Date(Date.now() - 172800000), // 2 days ago
      permissions: [
        { name: "Create", icon: "Plus" },
        { name: "Edit", icon: "Edit" }
      ],
      contentCount: 0,
      joinedDate: "Oct 1, 2024"
    }
  ]);

  // Mock pending approvals data
  const [pendingApprovals] = useState([
    {
      id: 1,
      title: "Holiday Season Campaign Launch",
      caption: "🎄 Get ready for the most wonderful time of the year! Our holiday collection is here with amazing deals and festive vibes. Shop now and spread the joy! #HolidayShopping #FestiveDeals",
      author: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      },
      media: {
        thumbnail: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300"
      },
      platforms: ["instagram", "facebook", "linkedin"],
      scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
      contentType: "image_post",
      createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    {
      id: 2,
      title: "Product Feature Highlight",
      caption: "Introducing our latest innovation! This game-changing feature will revolutionize how you work. Early access available now for premium users. #Innovation #ProductUpdate",
      author: {
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
      },
      media: {
        thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300"
      },
      platforms: ["linkedin", "twitter"],
      scheduledDate: new Date(Date.now() + 172800000), // Day after tomorrow
      contentType: "video_post",
      createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ]);

  // Mock activity feed data
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "content_created",
      description: "created a new Instagram post for the holiday campaign",
      user: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      },
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      metadata: {
        contentTitle: "Holiday Season Campaign Launch",
        platform: "Instagram"
      }
    },
    {
      id: 2,
      type: "content_approved",
      description: "approved the product feature highlight post",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
      },
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      metadata: {
        contentTitle: "Product Feature Highlight",
        platform: "LinkedIn"
      }
    },
    {
      id: 3,
      type: "team_member_added",
      description: "invited David Kim to join the workspace",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
      },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      metadata: {
        role: "Editor"
      }
    },
    {
      id: 4,
      type: "content_scheduled",
      description: "scheduled a LinkedIn post for tomorrow morning",
      user: {
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
      },
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      metadata: {
        contentTitle: "Weekly Industry Update",
        platform: "LinkedIn"
      }
    },
    {
      id: 5,
      type: "role_changed",
      description: "updated Michael Chen\'s role to Senior Editor",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
      },
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      metadata: {
        role: "Senior Editor"
      }
    }
  ]);

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailFrequency: 'daily',
    content_approval: { email: true, inApp: true, push: false },
    content_published: { email: true, inApp: true, push: true },
    team_activity: { email: false, inApp: true, push: false },
    mentions: { email: true, inApp: true, push: true },
    schedule_changes: { email: true, inApp: true, push: false },
    system_updates: { email: true, inApp: true, push: false }
  });

  const tabs = [
    { id: 'team', label: 'Team Members', icon: 'Users', count: teamMembers?.length },
    { id: 'approvals', label: 'Approvals', icon: 'CheckCircle', count: pendingApprovals?.length },
    { id: 'activity', label: 'Activity', icon: 'Activity', count: null },
    { id: 'notifications', label: 'Notifications', icon: 'Bell', count: null }
  ];

  const handleRoleChange = (memberId, newRole) => {
    setTeamMembers(prev => 
      prev?.map(member => 
        member?.id === memberId 
          ? { ...member, role: newRole }
          : member
      )
    );
    
    // Add activity
    const newActivity = {
      id: Date.now(),
      type: "role_changed",
      description: `changed ${teamMembers?.find(m => m?.id === memberId)?.name}'s role to ${newRole}`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      timestamp: new Date(),
      metadata: { role: newRole }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleRemoveMember = (memberId) => {
    const member = teamMembers?.find(m => m?.id === memberId);
    setTeamMembers(prev => prev?.filter(m => m?.id !== memberId));
    
    // Add activity
    const newActivity = {
      id: Date.now(),
      type: "team_member_removed",
      description: `removed ${member?.name} from the workspace`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      timestamp: new Date(),
      metadata: {}
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleApprove = (approvalId, comment) => {
    console.log(`Approved ${approvalId} with comment: ${comment}`);
    // Add activity
    const newActivity = {
      id: Date.now(),
      type: "content_approved",
      description: `approved content with ${comment ? 'comment' : 'no comment'}`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      timestamp: new Date(),
      metadata: { contentTitle: "Content Item" }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleReject = (approvalId, comment) => {
    console.log(`Rejected ${approvalId} with comment: ${comment}`);
    // Add activity
    const newActivity = {
      id: Date.now(),
      type: "content_rejected",
      description: `requested changes to content: ${comment}`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      timestamp: new Date(),
      metadata: { contentTitle: "Content Item" }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleInviteTeamMember = async (inviteData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMember = {
      id: Date.now(),
      name: inviteData?.name,
      email: inviteData?.email,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: inviteData?.role,
      status: "pending",
      lastActivity: new Date(),
      permissions: inviteData?.permissions?.map(p => ({ name: p, icon: "Check" })),
      contentCount: 0,
      joinedDate: new Date()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setTeamMembers(prev => [...prev, newMember]);
    
    // Add activity
    const newActivity = {
      id: Date.now(),
      type: "team_member_added",
      description: `invited ${inviteData?.name} to join the workspace`,
      user: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      timestamp: new Date(),
      metadata: { role: inviteData?.role }
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleLoadMoreActivities = () => {
    // Simulate loading more activities
    console.log('Loading more activities...');
  };

  const handleUpdateNotificationSettings = (newSettings) => {
    setNotificationSettings(newSettings);
    console.log('Notification settings updated:', newSettings);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Team Collaboration</h1>
              <p className="text-muted-foreground mt-2">
                Manage your team, approve content, and track collaboration activities
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="success"
                iconName="UserPlus"
                onClick={() => setShowInviteModal(true)}
              >
                Invite Team Member
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                  {tab?.count !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {tab?.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'team' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers?.map((member) => (
                    <TeamMemberCard
                      key={member?.id}
                      member={member}
                      onRoleChange={handleRoleChange}
                      onRemoveMember={handleRemoveMember}
                      currentUserRole={currentUserRole}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <ApprovalWorkflow
                pendingApprovals={pendingApprovals}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}

            {activeTab === 'activity' && (
              <ActivityFeed
                activities={activities}
                onLoadMore={handleLoadMoreActivities}
                hasMore={true}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings
                settings={notificationSettings}
                onUpdateSettings={handleUpdateNotificationSettings}
              />
            )}
          </div>
        </div>
      </div>
      {/* Invite Team Member Modal */}
      <InviteTeamMember
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteTeamMember}
      />
    </div>
  );
};

export default TeamCollaboration;