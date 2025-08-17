import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  settings: {
    theme: 'light' | 'dark';
    weightUnit: 'lbs' | 'kg';
    measurementUnit: 'imperial' | 'metric';
    defaultRestTime: number; // in seconds
  };
}

const PROFILES_STORAGE_KEY = 'iron-gains-profiles';
const ACTIVE_PROFILE_STORAGE_KEY = 'iron-gains-active-profile';

const DEFAULT_AVATARS = [
  '💪', '🔥', '⚡', '🏋️', '🎯', '🦁', '🐺', '🦅',
  '🌟', '💎', '🚀', '⭐', '🎨', '🎮', '🎭', '🎪'
];

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
    const profiles = saved ? JSON.parse(saved) : [];
    if (profiles.length > 0) {
      const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
      return savedActiveId 
        ? profiles.find(p => p.id === savedActiveId) || profiles[0]
        : profiles[0];
    }
    return null;
  });

  // Initialize active profile when profiles are loaded (only if no active profile exists)
  useEffect(() => {
    if (profiles.length > 0 && !activeProfile) {
      const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
      const profile = savedActiveId 
        ? profiles.find(p => p.id === savedActiveId) || profiles[0]
        : profiles[0];
      setActiveProfile(profile);
    }
  }, [profiles.length]); // Only depend on profiles.length, not activeProfile

  // Update active profile when profiles array changes (but only if current active profile was updated)
  useEffect(() => {
    if (activeProfile && profiles.length > 0) {
      const updatedProfile = profiles.find(p => p.id === activeProfile.id);
      if (updatedProfile) {
        // Only update if there are actual changes
        const hasChanges = JSON.stringify(updatedProfile) !== JSON.stringify(activeProfile);
        if (hasChanges) {
          setActiveProfile(updatedProfile);
        }
      } else {
        // Active profile was deleted, switch to first available
        setActiveProfile(profiles[0] || null);
      }
    }
  }, [profiles, activeProfile?.id]); // Only depend on activeProfile.id, not the full object

  // Persist profiles to localStorage
  useEffect(() => {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  // Persist active profile to localStorage
  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, activeProfile.id);
    }
  }, [activeProfile]);

  const createProfile = useCallback((name: string, avatar: string) => {
    const newProfile: UserProfile = {
      id: `profile-${Date.now()}-${Math.random()}`,
      name,
      avatar,
      createdAt: new Date(),
      settings: {
        theme: 'light',
        weightUnit: 'lbs',
        measurementUnit: 'imperial',
        defaultRestTime: 90
      }
    };

    setProfiles(prev => [...prev, newProfile]);
    
    // If this is the first profile, make it active
    if (profiles.length === 0) {
      setActiveProfile(newProfile);
    }
    
    return newProfile;
  }, [profiles.length]);

  const updateProfile = useCallback((profileId: string, updates: Partial<UserProfile>) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, ...updates }
          : profile
      )
    );
  }, []);

  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(prev => {
      const filtered = prev.filter(p => p.id !== profileId);
      // If we're deleting the active profile, switch to another one
      if (activeProfile?.id === profileId) {
        setActiveProfile(filtered[0] || null);
      }
      return filtered;
    });
  }, [activeProfile?.id]);

  const switchProfile = useCallback((profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setActiveProfile(profile);
    }
  }, [profiles]);

  const updateSettings = useCallback((settings: Partial<UserProfile['settings']>) => {
    if (!activeProfile) return;
    
    const updatedSettings = { ...activeProfile.settings, ...settings };
    updateProfile(activeProfile.id, { settings: updatedSettings });
  }, [activeProfile, updateProfile]);

  return {
    profiles,
    activeProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile,
    updateSettings,
    defaultAvatars: DEFAULT_AVATARS
  };
};