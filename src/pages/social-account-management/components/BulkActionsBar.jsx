import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedAccounts, onBulkAction, onClearSelection }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  if (selectedAccounts?.length === 0) return null;

  const handleBulkAction = (action) => {
    if (action === 'disconnect') {
      setActionType('disconnect');
      setShowConfirmDialog(true);
    } else {
      onBulkAction(action, selectedAccounts);
    }
  };

  const confirmAction = () => {
    onBulkAction(actionType, selectedAccounts);
    setShowConfirmDialog(false);
    setActionType('');
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-card border border-border rounded-lg shadow-elevation-3 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {selectedAccounts?.length}
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {selectedAccounts?.length} account{selectedAccounts?.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('sync')}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Sync All
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('configure')}
                iconName="Settings"
                iconPosition="left"
              >
                Configure
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('disconnect')}
                iconName="Unlink"
                iconPosition="left"
                className="text-error hover:text-error border-error/20 hover:border-error/40"
              >
                Disconnect
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                iconName="X"
                iconPosition="left"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Confirm Bulk Disconnect</h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm text-card-foreground mb-6">
                Are you sure you want to disconnect {selectedAccounts?.length} account{selectedAccounts?.length > 1 ? 's' : ''}? 
                You'll need to reconnect them individually to resume posting.
              </p>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmAction}
                  fullWidth
                  iconName="Unlink"
                  iconPosition="left"
                >
                  Disconnect All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;