import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface ProfileStats {
  moviesWatched: number;
  showsWatched: number;
  myListCount: number;
  likesCount: number;
  awesomeCount: number;
  trashCount: number;
}

export interface WatchItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  progress: number; // 0-100
  duration: number; // in seconds
  currentTime: number; // in seconds
  season?: number;
  episode?: number;
  timestamp: number;
  lastWatchedAt: number;
}

export interface Profile {
  profileId: string;
  profileName: string;
  avatar: string;
  favoriteGenre: string | null;
  isKids: boolean;
  createdAt: number;
  stats: ProfileStats;
  continueWatching: WatchItem[];
  watchHistory: WatchItem[];
  favorites: number[];
  watchlist: number[];
}

interface ProfileContextType {
  profiles: Profile[];
  selectedProfile: Profile | null;
  isLoading: boolean;
  createProfile: (name: string, avatar: string, favoriteGenre?: string, isKids?: boolean) => Promise<void>;
  selectProfile: (profileId: string) => void;
  updateProfile: (profileId: string, updates: Partial<Profile>) => void;
  deleteProfile: (profileId: string) => void;
  resetAllProfiles: () => void;
  addToContinueWatching: (profileId: string, item: WatchItem) => void;
  updateWatchProgress: (profileId: string, itemId: number, progress: number, currentTime: number) => void;
  removeContinueWatching: (profileId: string, itemId: number) => void;
  updateStats: (profileId: string, stats: Partial<ProfileStats>) => void;
}

export const ProfileContext = createContext<ProfileContextType>({
  profiles: [],
  selectedProfile: null,
  isLoading: true,
  createProfile: async () => {},
  selectProfile: () => {},
  updateProfile: () => {},
  deleteProfile: () => {},
  resetAllProfiles: () => {},
  addToContinueWatching: () => {},
  updateWatchProgress: () => {},
  removeContinueWatching: () => {},
  updateStats: () => {},
});

const PROFILES_STORAGE_KEY = 'nogate_profiles';
const SELECTED_PROFILE_KEY = 'nogate_selected_profile';

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles from localStorage on mount
  useEffect(() => {
    const loadProfiles = () => {
      try {
        const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
        const selectedId = localStorage.getItem(SELECTED_PROFILE_KEY);
        
        if (stored) {
          const loadedProfiles = JSON.parse(stored);
          setProfiles(loadedProfiles);
          
          // Try to restore selected profile
          if (selectedId) {
            const selected = loadedProfiles.find((p: Profile) => p.profileId === selectedId);
            if (selected) {
              setSelectedProfile(selected);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfiles();
  }, []);

  const saveProfiles = useCallback((updatedProfiles: Profile[]) => {
    setProfiles(updatedProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updatedProfiles));
  }, []);

  const createProfile = useCallback(async (name: string, avatar: string, favoriteGenre?: string, isKids = false): Promise<void> => {
    return new Promise((resolve) => {
      const newProfile: Profile = {
        profileId: `profile_${Date.now()}`,
        profileName: name,
        avatar,
        favoriteGenre: favoriteGenre || null,
        isKids,
        createdAt: Date.now(),
        stats: {
          moviesWatched: 0,
          showsWatched: 0,
          myListCount: 0,
          likesCount: 0,
          awesomeCount: 0,
          trashCount: 0,
        },
        continueWatching: [],
        watchHistory: [],
        favorites: [],
        watchlist: [],
      };
      
      const updatedProfiles = [...profiles, newProfile];
      saveProfiles(updatedProfiles);
      setSelectedProfile(newProfile);
      localStorage.setItem(SELECTED_PROFILE_KEY, newProfile.profileId);
      
      console.log('Profile created:', newProfile);
      resolve();
    });
  }, [profiles, saveProfiles]);

  const selectProfile = useCallback((profileId: string) => {
    const profile = profiles.find(p => p.profileId === profileId);
    if (profile) {
      setSelectedProfile(profile);
      localStorage.setItem(SELECTED_PROFILE_KEY, profileId);
    }
  }, [profiles]);

  const updateProfile = useCallback((profileId: string, updates: Partial<Profile>) => {
    const updatedProfiles = profiles.map(p => {
      if (p.profileId === profileId) {
        const updated = { ...p, ...updates };
        if (selectedProfile?.profileId === profileId) {
          setSelectedProfile(updated);
        }
        return updated;
      }
      return p;
    });
    saveProfiles(updatedProfiles);
  }, [profiles, selectedProfile, saveProfiles]);

  const deleteProfile = useCallback((profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.profileId !== profileId);
    saveProfiles(updatedProfiles);
    
    if (selectedProfile?.profileId === profileId) {
      if (updatedProfiles.length > 0) {
        setSelectedProfile(updatedProfiles[0]);
        localStorage.setItem(SELECTED_PROFILE_KEY, updatedProfiles[0].profileId);
      } else {
        setSelectedProfile(null);
        localStorage.removeItem(SELECTED_PROFILE_KEY);
      }
    }
  }, [profiles, selectedProfile, saveProfiles]);

  const resetAllProfiles = useCallback(() => {
    setProfiles([]);
    setSelectedProfile(null);
    localStorage.removeItem(PROFILES_STORAGE_KEY);
    localStorage.removeItem(SELECTED_PROFILE_KEY);
  }, []);

  const addToContinueWatching = useCallback((profileId: string, item: WatchItem) => {
    const updatedProfiles = profiles.map(p => {
      if (p.profileId === profileId) {
        const continueWatching = p.continueWatching.filter(i => !(i.id === item.id && i.type === item.type));
        continueWatching.unshift(item);
        const updated = { ...p, continueWatching: continueWatching.slice(0, 20) }; // Keep last 20
        if (selectedProfile?.profileId === profileId) {
          setSelectedProfile(updated);
        }
        return updated;
      }
      return p;
    });
    saveProfiles(updatedProfiles);
  }, [profiles, selectedProfile, saveProfiles]);

  const updateWatchProgress = useCallback((profileId: string, itemId: number, progress: number, currentTime: number) => {
    const updatedProfiles = profiles.map(p => {
      if (p.profileId === profileId) {
        const continueWatching = p.continueWatching.map(item => {
          if (item.id === itemId) {
            return { ...item, progress, currentTime, lastWatchedAt: Date.now() };
          }
          return item;
        });
        const updated = { ...p, continueWatching };
        if (selectedProfile?.profileId === profileId) {
          setSelectedProfile(updated);
        }
        return updated;
      }
      return p;
    });
    saveProfiles(updatedProfiles);
  }, [profiles, selectedProfile, saveProfiles]);

  const removeContinueWatching = useCallback((profileId: string, itemId: number) => {
    const updatedProfiles = profiles.map(p => {
      if (p.profileId === profileId) {
        const continueWatching = p.continueWatching.filter(i => i.id !== itemId);
        const updated = { ...p, continueWatching };
        if (selectedProfile?.profileId === profileId) {
          setSelectedProfile(updated);
        }
        return updated;
      }
      return p;
    });
    saveProfiles(updatedProfiles);
  }, [profiles, selectedProfile, saveProfiles]);

  const updateStats = useCallback((profileId: string, stats: Partial<ProfileStats>) => {
    const updatedProfiles = profiles.map(p => {
      if (p.profileId === profileId) {
        const updated = {
          ...p,
          stats: { ...p.stats, ...stats },
        };
        if (selectedProfile?.profileId === profileId) {
          setSelectedProfile(updated);
        }
        return updated;
      }
      return p;
    });
    saveProfiles(updatedProfiles);
  }, [profiles, selectedProfile, saveProfiles]);

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        selectedProfile,
        isLoading,
        createProfile,
        selectProfile,
        updateProfile,
        deleteProfile,
        resetAllProfiles,
        addToContinueWatching,
        updateWatchProgress,
        removeContinueWatching,
        updateStats,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
