import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import AccountCard from './components/AccountCard';
import ConnectionModal from './components/ConnectionModal';
import BrandVoiceModal from './components/BrandVoiceModal';
import BulkActionsBar from './components/BulkActionsBar';
import PlatformGuide from './components/PlatformGuide';

const SocialAccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [connectionModal, setConnectionModal] = useState({ isOpen: false, platform: null });
  const [brandVoiceModal, setBrandVoiceModal] = useState({ isOpen: false, account: null });
  const [platformGuide, setPlatformGuide] = useState({ isOpen: false, platform: null });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for connected accounts
  useEffect(() => {
    const mockAccounts = [
      {
        id: 1,
        platform: 'instagram',
        username: 'socialsync_pro',
        status: 'connected',
        lastSync: new Date(Date.now() - 300000), // 5 minutes ago
        postsThisMonth: 24,
        apiLimits: {
          rateLimit: { used: 45, total: 200 },
          dailyPosts: { used: 3, total: 25 }
        },
        permissions: [
          { name: 'Basic Profile', granted: true },
          { name: 'Media Publishing', granted: true },
          { name: 'Insights Access', granted: true }
        ],
        customPrompts: true,
        brandVoice: {
          tone: 'professional',
          style: 'informative',
          customPrompt: 'Create engaging Instagram posts that showcase our innovative solutions.',
          keywords: 'innovation, technology, solutions',
          targetAudience: 'Tech professionals aged 25-40'
        }
      },
      {
        id: 2,
        platform: 'facebook',
        username: 'SocialSync Pro Business',
        status: 'connected',
        lastSync: new Date(Date.now() - 900000), // 15 minutes ago
        postsThisMonth: 18,
        apiLimits: {
          rateLimit: { used: 23, total: 100 },
          dailyPosts: { used: 2, total: 50 }
        },
        permissions: [
          { name: 'Page Management', granted: true },
          { name: 'Content Publishing', granted: true },
          { name: 'Analytics Access', granted: false }
        ],
        customPrompts: false,
        brandVoice: null
      },
      {
        id: 3,
        platform: 'linkedin',
        username: 'SocialSync Pro Company',
        status: 'expired',
        lastSync: new Date(Date.now() - 86400000), // 1 day ago
        postsThisMonth: 12,
        apiLimits: {
          rateLimit: { used: 15, total: 75 },
          dailyPosts: { used: 0, total: 20 }
        },
        permissions: [
          { name: 'Profile Access', granted: true },
          { name: 'Company Page Management', granted: true },
          { name: 'Content Sharing', granted: false }
        ],
        customPrompts: true,
        brandVoice: {
          tone: 'professional',
          style: 'educational',
          customPrompt: 'Share professional insights and industry expertise.',
          keywords: 'leadership, business, growth',
          targetAudience: 'Business professionals and decision makers'
        }
      },
      {
        id: 4,
        platform: 'twitter',
        username: 'socialsync_pro',
        status: 'error',
        lastSync: new Date(Date.now() - 3600000), // 1 hour ago
        postsThisMonth: 45,
        apiLimits: {
          rateLimit: { used: 180, total: 300 },
          dailyPosts: { used: 8, total: 100 }
        },
        permissions: [
          { name: 'Tweet Publishing', granted: true },
          { name: 'Media Upload', granted: false },
          { name: 'Account Analytics', granted: true }
        ],
        customPrompts: false,
        brandVoice: null
      }
    ];
    setAccounts(mockAccounts);
  }, []);

  const availablePlatforms = [
    { id: 'instagram', name: 'Instagram', icon: 'Instagram', connected: accounts?.some(a => a?.platform === 'instagram') },
    { id: 'facebook', name: 'Facebook', icon: 'Facebook', connected: accounts?.some(a => a?.platform === 'facebook') },
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', connected: accounts?.some(a => a?.platform === 'linkedin') },
    { id: 'twitter', name: 'Twitter/X', icon: 'Twitter', connected: accounts?.some(a => a?.platform === 'twitter') }
  ];

  const filteredAccounts = accounts?.filter(account => {
    const matchesStatus = filterStatus === 'all' || account?.status === filterStatus;
    const matchesSearch = account?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         account?.platform?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAccountSelection = (accountId, checked) => {
    if (checked) {
      setSelectedAccounts(prev => [...prev, accountId]);
    } else {
      setSelectedAccounts(prev => prev?.filter(id => id !== accountId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAccounts(filteredAccounts?.map(account => account?.id));
    } else {
      setSelectedAccounts([]);
    }
  };

  const handleConnect = (platform) => {
    // Simulate successful connection
    const newAccount = {
      id: Date.now(),
      platform,
      username: `new_${platform}_account`,
      status: 'connected',
      lastSync: new Date(),
      postsThisMonth: 0,
      apiLimits: {
        rateLimit: { used: 0, total: platform === 'instagram' ? 200 : 100 },
        dailyPosts: { used: 0, total: platform === 'instagram' ? 25 : 50 }
      },
      permissions: [
        { name: 'Basic Access', granted: true },
        { name: 'Publishing', granted: true },
        { name: 'Analytics', granted: true }
      ],
      customPrompts: false,
      brandVoice: null
    };
    
    setAccounts(prev => [...prev, newAccount]);
  };

  const handleReconnect = (accountId) => {
    setAccounts(prev => prev?.map(account => 
      account?.id === accountId 
        ? { ...account, status: 'connected', lastSync: new Date() }
        : account
    ));
  };

  const handleDisconnect = (accountId) => {
    setAccounts(prev => prev?.filter(account => account?.id !== accountId));
    setSelectedAccounts(prev => prev?.filter(id => id !== accountId));
  };

  const handleConfigure = (accountId, type) => {
    const account = accounts?.find(a => a?.id === accountId);
    if (type === 'prompts' || type === 'settings') {
      setBrandVoiceModal({ isOpen: true, account });
    }
  };

  const handleBrandVoiceSave = (accountId, brandVoiceData) => {
    setAccounts(prev => prev?.map(account => 
      account?.id === accountId 
        ? { ...account, brandVoice: brandVoiceData, customPrompts: true }
        : account
    ));
  };

  const handleBulkAction = (action, accountIds) => {
    switch (action) {
      case 'sync':
        setAccounts(prev => prev?.map(account => 
          accountIds?.includes(account?.id) 
            ? { ...account, lastSync: new Date() }
            : account
        ));
        break;
      case 'disconnect':
        setAccounts(prev => prev?.filter(account => !accountIds?.includes(account?.id)));
        setSelectedAccounts([]);
        break;
      case 'configure':
        // Open bulk configuration modal (simplified for this example)
        console.log('Bulk configure:', accountIds);
        break;
    }
  };

  const getStatusCounts = () => {
    return {
      all: accounts?.length,
      connected: accounts?.filter(a => a?.status === 'connected')?.length,
      expired: accounts?.filter(a => a?.status === 'expired')?.length,
      error: accounts?.filter(a => a?.status === 'error')?.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Social Account Management</h1>
                <p className="text-muted-foreground mt-2">
                  Connect and manage your social media accounts for automated posting
                </p>
              </div>
              <Button
                variant="default"
                onClick={() => setPlatformGuide({ isOpen: true, platform: 'instagram' })}
                iconName="HelpCircle"
                iconPosition="left"
              >
                Platform Guide
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Accounts</p>
                  <p className="text-2xl font-bold text-card-foreground">{statusCounts?.all}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected</p>
                  <p className="text-2xl font-bold text-success">{statusCounts?.connected}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                  <p className="text-2xl font-bold text-warning">{statusCounts?.expired}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-error">{statusCounts?.error}</p>
                </div>
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="XCircle" size={20} className="text-error" />
                </div>
              </div>
            </div>
          </div>

          {/* Add New Account */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Connect New Account</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availablePlatforms?.map((platform) => (
                <Button
                  key={platform?.id}
                  variant={platform?.connected ? "outline" : "default"}
                  onClick={() => setConnectionModal({ isOpen: true, platform: platform?.id })}
                  disabled={platform?.connected}
                  iconName={platform?.icon}
                  iconPosition="left"
                  fullWidth
                >
                  {platform?.connected ? 'Connected' : `Connect ${platform?.name}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedAccounts?.length === filteredAccounts?.length && filteredAccounts?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  label="Select All"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {['all', 'connected', 'expired', 'error']?.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-smooth capitalize ${
                      filterStatus === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {status} ({statusCounts?.[status]})
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent w-64"
              />
            </div>
          </div>

          {/* Account Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredAccounts?.map((account) => (
              <div key={account?.id} className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <Checkbox
                    checked={selectedAccounts?.includes(account?.id)}
                    onChange={(e) => handleAccountSelection(account?.id, e?.target?.checked)}
                  />
                </div>
                <AccountCard
                  account={account}
                  onReconnect={handleReconnect}
                  onDisconnect={handleDisconnect}
                  onConfigure={handleConfigure}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAccounts?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No accounts found' : 'No accounts connected'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterStatus !== 'all' ?'Try adjusting your search or filter criteria' :'Connect your first social media account to get started'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button
                  variant="default"
                  onClick={() => setConnectionModal({ isOpen: true, platform: 'instagram' })}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Connect Account
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <ConnectionModal
        isOpen={connectionModal?.isOpen}
        onClose={() => setConnectionModal({ isOpen: false, platform: null })}
        platform={connectionModal?.platform}
        onConnect={handleConnect}
      />
      <BrandVoiceModal
        isOpen={brandVoiceModal?.isOpen}
        onClose={() => setBrandVoiceModal({ isOpen: false, account: null })}
        account={brandVoiceModal?.account}
        onSave={handleBrandVoiceSave}
      />
      <PlatformGuide
        isOpen={platformGuide?.isOpen}
        onClose={() => setPlatformGuide({ isOpen: false, platform: null })}
        platform={platformGuide?.platform}
      />
      {/* Bulk Actions */}
      <BulkActionsBar
        selectedAccounts={selectedAccounts}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedAccounts([])}
      />
    </div>
  );
};

export default SocialAccountManagement;