import { supabase } from '../lib/supabase';

// =====================================
// USER PROFILES
// =====================================

export const userProfileService = {
  async getCurrentProfile() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: new Error('Not authenticated') };

      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateProfile(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: new Error('Not authenticated') };

      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// =====================================
// ORGANIZATIONS
// =====================================

export const organizationService = {
  async getUserOrganization() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: new Error('Not authenticated') };

      const { data, error } = await supabase?.from('team_members')?.select(`
          organization_id,
          role,
          status,
          organizations (
            id,
            name,
            owner_id,
            subscription_plan,
            created_at
          )
        `)?.eq('user_id', user?.id)?.eq('status', 'active')?.single();

      return { 
        data: data?.organizations ? {
          ...data?.organizations,
          userRole: data?.role,
          userStatus: data?.status
        } : null, 
        error 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getTeamMembers(organizationId) {
    try {
      const { data, error } = await supabase?.from('team_members')?.select(`
          id,
          role,
          status,
          joined_at,
          permissions,
          user_profiles (
            id,
            email,
            full_name,
            avatar_url
          )
        `)?.eq('organization_id', organizationId)?.order('joined_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async inviteTeamMember(organizationId, email, role = 'editor') {
    try {
      // This would typically involve sending an invitation email
      // For now, we'll just add a placeholder team member record
      const { data, error } = await supabase?.from('team_members')?.insert({
          organization_id: organizationId,
          // user_id would be set when the invited user signs up
          role,
          status: 'pending'
        })?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateTeamMemberRole(memberId, newRole) {
    try {
      const { data, error } = await supabase?.from('team_members')?.update({ role: newRole })?.eq('id', memberId)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async removeTeamMember(memberId) {
    try {
      const { error } = await supabase?.from('team_members')?.delete()?.eq('id', memberId);

      return { error };
    } catch (error) {
      return { error };
    }
  }
};

// =====================================
// SOCIAL ACCOUNTS
// =====================================

export const socialAccountService = {
  async getSocialAccounts(organizationId) {
    try {
      const { data, error } = await supabase?.from('social_accounts')?.select('*')?.eq('organization_id', organizationId)?.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async connectAccount(organizationId, accountData) {
    try {
      const { data, error } = await supabase?.from('social_accounts')?.insert({
          organization_id: organizationId,
          ...accountData
        })?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateAccount(accountId, updates) {
    try {
      const { data, error } = await supabase?.from('social_accounts')?.update(updates)?.eq('id', accountId)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async disconnectAccount(accountId) {
    try {
      const { data, error } = await supabase?.from('social_accounts')?.update({ is_connected: false })?.eq('id', accountId)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// =====================================
// POSTS
// =====================================

export const postService = {
  async getPosts(organizationId, filters = {}) {
    try {
      let query = supabase?.from('posts')?.select(`
          *,
          post_media (*),
          post_platforms (
            *,
            social_accounts (platform, account_name)
          ),
          user_profiles (full_name, avatar_url)
        `)?.eq('organization_id', organizationId);

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.authorId) {
        query = query?.eq('author_id', filters?.authorId);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createPost(organizationId, postData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: new Error('Not authenticated') };

      const { data, error } = await supabase?.from('posts')?.insert({
          organization_id: organizationId,
          author_id: user?.id,
          ...postData
        })?.select(`
          *,
          user_profiles (full_name, avatar_url)
        `)?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updatePost(postId, updates) {
    try {
      const { data, error } = await supabase?.from('posts')?.update(updates)?.eq('id', postId)?.select(`
          *,
          post_media (*),
          user_profiles (full_name, avatar_url)
        `)?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deletePost(postId) {
    try {
      const { error } = await supabase?.from('posts')?.delete()?.eq('id', postId);

      return { error };
    } catch (error) {
      return { error };
    }
  },

  async schedulePost(postId, scheduledFor) {
    try {
      const { data, error } = await supabase?.from('posts')?.update({
          scheduled_for: scheduledFor,
          status: 'scheduled'
        })?.eq('id', postId)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// =====================================
// ANALYTICS
// =====================================

export const analyticsService = {
  async getAnalyticsSummary(organizationId, dateRange = 30) {
    try {
      const fromDate = new Date();
      fromDate?.setDate(fromDate?.getDate() - dateRange);

      const { data, error } = await supabase?.from('analytics_summary')?.select(`
          *,
          social_accounts (platform, account_name)
        `)?.eq('organization_id', organizationId)?.gte('date', fromDate?.toISOString()?.split('T')?.[0])?.order('date', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPostAnalytics(postId) {
    try {
      const { data, error } = await supabase?.from('post_platforms')?.select(`
          engagement_metrics,
          platform_url,
          published_at,
          social_accounts (platform, account_name)
        `)?.eq('post_id', postId);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getMetricsOverview(organizationId) {
    try {
      // Get latest analytics summary
      const { data: latestSummary, error: summaryError } = await supabase?.from('analytics_summary')?.select('*')?.eq('organization_id', organizationId)?.order('date', { ascending: false })?.limit(1);

      if (summaryError) return { data: null, error: summaryError };

      // Get total followers across all accounts
      const { data: accounts, error: accountsError } = await supabase?.from('social_accounts')?.select('follower_count')?.eq('organization_id', organizationId)?.eq('is_connected', true);

      if (accountsError) return { data: null, error: accountsError };

      // Get recent posts count
      const { count: postsCount, error: postsError } = await supabase?.from('posts')?.select('id', { count: 'exact' })?.eq('organization_id', organizationId)?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString());

      if (postsError) return { data: null, error: postsError };

      const totalFollowers = accounts?.reduce((sum, account) => sum + (account?.follower_count || 0), 0) || 0;
      const averageEngagement = latestSummary?.[0]?.engagement_rate || 0;
      const totalReach = latestSummary?.[0]?.reach || 0;

      return {
        data: {
          totalFollowers,
          averageEngagement,
          totalReach,
          postsThisMonth: postsCount || 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// =====================================
// ACTIVITIES
// =====================================

export const activityService = {
  async getActivities(organizationId, limit = 50) {
    try {
      const { data, error } = await supabase?.from('activities')?.select(`
          *,
          user_profiles (full_name, avatar_url)
        `)?.eq('organization_id', organizationId)?.order('created_at', { ascending: false })?.limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createActivity(organizationId, activityData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: new Error('Not authenticated') };

      const { data, error } = await supabase?.from('activities')?.insert({
          organization_id: organizationId,
          user_id: user?.id,
          ...activityData
        })?.select(`
          *,
          user_profiles (full_name, avatar_url)
        `)?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// =====================================
// CALENDAR EVENTS
// =====================================

export const calendarService = {
  async getEvents(organizationId, startDate, endDate) {
    try {
      let query = supabase?.from('calendar_events')?.select(`
          *,
          posts (title, status),
          user_profiles (full_name)
        `)?.eq('organization_id', organizationId);

      if (startDate) {
        query = query?.gte('event_date', startDate);
      }

      if (endDate) {
        query = query?.lte('event_date', endDate);
      }

      const { data, error } = await query?.order('event_date', { ascending: true });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createEvent(organizationId, eventData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: new Error('Not authenticated') };

      const { data, error } = await supabase?.from('calendar_events')?.insert({
          organization_id: organizationId,
          created_by: user?.id,
          ...eventData
        })?.select(`
          *,
          user_profiles (full_name)
        `)?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateEvent(eventId, updates) {
    try {
      const { data, error } = await supabase?.from('calendar_events')?.update(updates)?.eq('id', eventId)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteEvent(eventId) {
    try {
      const { error } = await supabase?.from('calendar_events')?.delete()?.eq('id', eventId);

      return { error };
    } catch (error) {
      return { error };
    }
  }
};

// =====================================
// STORAGE
// =====================================

export const storageService = {
  async uploadFile(bucket, path, file) {
    try {
      const { data, error } = await supabase?.storage?.from(bucket)?.upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getFileUrl(bucket, path) {
    try {
      const { data } = supabase?.storage?.from(bucket)?.getPublicUrl(path);

      return { data: data?.publicUrl, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteFile(bucket, path) {
    try {
      const { error } = await supabase?.storage?.from(bucket)?.remove([path]);

      return { error };
    } catch (error) {
      return { error };
    }
  }
};

// =====================================
// NOTIFICATIONS
// =====================================

export const notificationService = {
  async getNotifications(limit = 50) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: new Error('Not authenticated') };

      const { data, error } = await supabase?.from('notifications')?.select('*')?.eq('user_id', user?.id)?.order('created_at', { ascending: false })?.limit(limit);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase?.from('notifications')?.update({ read: true })?.eq('id', notificationId)?.select()?.single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async markAllAsRead() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { error: new Error('Not authenticated') };

      const { error } = await supabase?.from('notifications')?.update({ read: true })?.eq('user_id', user?.id)?.eq('read', false);

      return { error };
    } catch (error) {
      return { error };
    }
  }
};
function supabaseService(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: supabaseService is not implemented yet.', args);
  return null;
}

export { supabaseService };