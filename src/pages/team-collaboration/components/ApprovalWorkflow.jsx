import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ApprovalWorkflow = ({ pendingApprovals, onApprove, onReject }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleAction = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setShowCommentModal(true);
  };

  const handleSubmitAction = () => {
    if (actionType === 'approve') {
      onApprove(selectedItem?.id, comment);
    } else {
      onReject(selectedItem?.id, comment);
    }
    setShowCommentModal(false);
    setComment('');
    setSelectedItem(null);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      linkedin: 'Linkedin',
      twitter: 'Twitter'
    };
    return icons?.[platform] || 'Share';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Pending Approvals</h2>
        <span className="px-3 py-1 bg-warning text-warning-foreground rounded-full text-sm font-medium">
          {pendingApprovals?.length} pending
        </span>
      </div>
      {pendingApprovals?.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">All caught up!</h3>
          <p className="text-muted-foreground">No content pending approval at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals?.map((item) => (
            <div key={item?.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {item?.media && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item?.media?.thumbnail}
                        alt="Content preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={item?.author?.avatar}
                        alt={item?.author?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-medium text-card-foreground">
                        {item?.author?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(item?.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item?.platforms?.map((platform) => (
                        <div key={platform} className="flex items-center space-x-1">
                          <Icon name={getPlatformIcon(platform)} size={16} className="text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-medium text-card-foreground mb-2">{item?.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item?.caption}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Scheduled: {new Date(item.scheduledDate)?.toLocaleDateString()}</span>
                      <span>Type: {item?.contentType}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="MessageCircle"
                        onClick={() => handleAction(item, 'reject')}
                      >
                        Request Changes
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        iconName="Check"
                        onClick={() => handleAction(item, 'approve')}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              {actionType === 'approve' ? 'Approve Content' : 'Request Changes'}
            </h3>
            
            <Input
              label={actionType === 'approve' ? 'Approval Comment (Optional)' : 'What needs to be changed?'}
              type="text"
              placeholder={actionType === 'approve' ? 'Add a comment...' : 'Describe the changes needed...'}
              value={comment}
              onChange={(e) => setComment(e?.target?.value)}
              className="mb-4"
            />

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                  setSelectedItem(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'success' : 'warning'}
                onClick={handleSubmitAction}
              >
                {actionType === 'approve' ? 'Approve' : 'Request Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;