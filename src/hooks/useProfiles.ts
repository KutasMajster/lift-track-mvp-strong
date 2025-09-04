
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  settings: {
    theme: 'light' | 'dark' | 'system';
    weightUnit: 'lbs' | 'kg';
    measurementUnit: 'imperial' | 'metric';
    defaultRestTime: number; // in seconds
  };
}

const DEFAULT_AVATARS = [
  '💪', '🔥', '⚡', '🏋️', '🎯', '🦁', '🐺', '🦅',
  '🌟', '💎', '🚀', '⭐', '🎨', '🎮', '🎭', '🎪'
];

export const useProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = async () => {
    if (!user) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        // If no profile exists, create one
        await createInitialProfile();
        return;
      }

      // Convert Supabase profile to UserProfile format
      const settings = data.settings as any || {};
      const userProfile: UserProfile = {
        id: data.id,
        name: data.name || 'User',
        avatar: data.avatar === 'default' ? '💪' : (data.avatar || '💪'),
        createdAt: new Date(data.created_at || new Date()),
        settings: {
          theme: settings.theme || 'system',
          weightUnit: settings.weightUnit || 'kg',
          measurementUnit: settings.measurementUnit || 'metric',
          defaultRestTime: settings.defaultRestTime || 90
        }
      };

      setProfiles([userProfile]);
      setActiveProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Create a fallback profile if fetch fails
      const fallbackProfile: UserProfile = {
        id: user.id,
        name: user.user_metadata?.name || 'User',
        avatar: '💪',
        createdAt: new Date(),
        settings: {
          theme: 'system',
          weightUnit: 'kg',
          measurementUnit: 'metric',
          defaultRestTime: 90
        }
      };
      setProfiles([fallbackProfile]);
      setActiveProfile(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  // Create initial profile for new users
  const createInitialProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || 'User',
          avatar: '💪'
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error('Failed to create profile');
      }

      const settings = data.settings as any || {};
      const userProfile: UserProfile = {
        id: data.id,
        name: data.name || 'User',
        avatar: data.avatar === 'default' ? '💪' : (data.avatar || '💪'),
        createdAt: new Date(data.created_at || new Date()),
        settings: {
          theme: settings.theme || 'system',
          weightUnit: settings.weightUnit || 'kg',
          measurementUnit: settings.measurementUnit || 'metric',
          defaultRestTime: settings.defaultRestTime || 90
        }
      };

      setProfiles([userProfile]);
      setActiveProfile(userProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
      // Create a fallback profile if creation fails
      const fallbackProfile: UserProfile = {
        id: user.id,
        name: user.user_metadata?.name || 'User',
        avatar: '💪',
        createdAt: new Date(),
        settings: {
          theme: 'system',
          weightUnit: 'kg',
          measurementUnit: 'metric',
          defaultRestTime: 90
        }
      };
      setProfiles([fallbackProfile]);
      setActiveProfile(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  // Load profile when user changes
  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchProfile();
    } else {
      setProfiles([]);
      setActiveProfile(null);
      setLoading(false);
    }
  }, [user?.id]);

  const updateProfile = async (profileId: string, updates: Partial<UserProfile>) => {
    if (!activeProfile || !user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar: updates.avatar
        })
        .eq('id', user.id);

      if (error) throw error;

      const updatedProfile = {
        ...activeProfile,
        ...updates
      };
      
      setActiveProfile(updatedProfile);
      setProfiles([updatedProfile]);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error Updating Profile", 
        description: "Could not update your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Legacy functions for compatibility
  const createProfile = () => {
    console.warn('createProfile is deprecated in database mode');
  };

  const deleteProfile = () => {
    console.warn('deleteProfile is deprecated in database mode');
  };

  const switchProfile = () => {
    console.warn('switchProfile is deprecated in database mode');
  };

  return {
    profiles,
    activeProfile,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile,
    defaultAvatars: DEFAULT_AVATARS
  };
};
