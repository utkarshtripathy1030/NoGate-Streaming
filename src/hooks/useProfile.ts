import { useContext } from 'react';
import { ProfileContext } from '@/context/ProfileContext';

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  
  // Backward compatibility: support both old single profile and new multi-profile context
  return {
    ...context,
    // Legacy properties for backward compatibility
    profile: context.selectedProfile,
    hasProfile: context.selectedProfile !== null,
    createProfileLegacy: (name: string, avatar: string, favoriteGenre?: string) => {
      return context.createProfile(name, avatar, favoriteGenre, false);
    },
  };
};
