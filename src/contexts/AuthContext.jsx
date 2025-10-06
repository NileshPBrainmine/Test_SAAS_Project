import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Separate async operations object (required pattern for Supabase)
  const profileOperations = {
    async load(userId) {
      if (!userId) return;
      setProfileLoading(true);
      try {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

        if (!profileError && profile) {
          setUserProfile(profile);
          
          // Fetch user's primary organization
          const { data: teamMember, error: orgError } = await supabase?.from('team_members')?.select(`organization_id,role,organizations (*)`)?.eq('user_id', userId)?.eq('status', 'active')?.single();

          if (!orgError && teamMember?.organizations) {
            setOrganization(teamMember?.organizations);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setProfileLoading(false);
      }
    },

    clear() {
      setUserProfile(null);
      setOrganization(null);
      setProfileLoading(false);
    }
  };

  // Protected auth handlers (must remain synchronous)
  const authStateHandlers = {
    // CRITICAL: This MUST remain synchronous - no async keyword!
    onChange: (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        profileOperations?.load(session?.user?.id); // Fire-and-forget
      } else {
        profileOperations?.clear();
      }
    }
  };

  // Auth functions
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error?.message?.includes('Failed to fetch')) {
          throw new Error('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard.');
        } else {
          throw new Error(error.message);
        }
      }
      
      return { user: data?.user, error: null };
    } catch (error) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        if (error?.message?.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else if (error?.message?.includes('Failed to fetch')) {
          throw new Error('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard.');
        } else {
          throw new Error(error.message);
        }
      }
      
      return { user: data?.user, error: null };
    } catch (error) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase?.auth?.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email);
      if (error) {
        if (error?.message?.includes('Failed to fetch')) {
          throw new Error('Cannot connect to authentication service. Please check your internet connection.');
        } else {
          throw new Error(error.message);
        }
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error('No user logged in');
      
      const { error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id);
      
      if (error) throw error;
      
      // Reload profile after update
      profileOperations?.load(user?.id);
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    );

    return () => subscription?.unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    organization,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};