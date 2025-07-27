import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  settings: {
    theme: 'light' | 'dark' | 'system';
    weightUnit: 'lbs' | 'kg';
    measurementUnit: 'imperial' | 'metric';
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

  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  // Initialize active profile when profiles are loaded
  useEffect(() => {
    if (profiles.length > 0 && !activeProfile) {
      const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
      const profile = savedActiveId 
        ? profiles.find(p => p.id === savedActiveId) || profiles[0]
        : profiles[0];
      setActiveProfile(profile);
    }
  }, [profiles, activeProfile]);

  // Ensure active profile is always in sync with profiles array changes
  useEffect(() => {
    if (activeProfile && profiles.length > 0) {
      const updatedProfile = profiles.find(p => p.id === activeProfile.id);
      if (updatedProfile && JSON.stringify(updatedProfile) !== JSON.stringify(activeProfile)) {
        setActiveProfile(updatedProfile);
      }
    }
  }, [profiles, activeProfile]);

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
        theme: 'system',
        weightUnit: 'lbs',
        measurementUnit: 'imperial'
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

    // Update active profile if it's the one being updated
    if (activeProfile?.id === profileId) {
      setActiveProfile(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [activeProfile]);

  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    
    // If we're deleting the active profile, switch to another one
    if (activeProfile?.id === profileId) {
      const remainingProfiles = profiles.filter(p => p.id !== profileId);
      setActiveProfile(remainingProfiles[0] || null);
    }
  }, [activeProfile, profiles]);

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