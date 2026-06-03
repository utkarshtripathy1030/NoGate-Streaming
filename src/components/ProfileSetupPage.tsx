import React, { useState, FC } from 'react';
import styles from './ProfileSetupPage.module.css';
import { useProfile } from '@/hooks/useProfile';
import { GENRES } from '@/services/tmdbAPI';

import avatar1 from '@/assets/avatars/avatar1.png';
import avatar2 from '@/assets/avatars/avatar2.png';
import avatar3 from '@/assets/avatars/avatar3.png';
import avatar4 from '@/assets/avatars/avatar4.png';
import avatar5 from '@/assets/avatars/avatar5.png';

interface ProfileSetupPageProps {
  onComplete?: () => void;
}

interface AvatarConfig {
  id: string;
  image: string;
  label: string;
}

const AVATARS: AvatarConfig[] = [
  { id: 'avatar1', image: avatar1, label: 'Avatar 1' },
  { id: 'avatar2', image: avatar2, label: 'Avatar 2' },
  { id: 'avatar3', image: avatar3, label: 'Avatar 3' },
  { id: 'avatar4', image: avatar4, label: 'Avatar 4' },
  { id: 'avatar5', image: avatar5, label: 'Avatar 5' },
];

export const ProfileSetupPage: FC<ProfileSetupPageProps> = ({ onComplete }) => {
  const { createProfile } = useProfile();
  const [profileName, setProfileName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATARS[0].id);
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!profileName.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId)!.image;
      await createProfile(profileName, selectedAvatar, favoriteGenre || undefined);
      onComplete?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.setupContainer}>
      <div className={styles.setupContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to NoGate</h1>
          <p className={styles.subtitle}>Create your profile to get started</p>
        </div>

        <div className={styles.formSection}>
          {/* Profile Name Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Profile Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your profile name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              disabled={isSubmitting}
              maxLength={50}
              autoFocus
            />
          </div>

          {/* Avatar Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Choose Your Avatar</label>
            <div className={styles.avatarGrid}>
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}Id === avatar.id ? styles.selected : ''}`}
                  onClick={() => setSelectedAvatarId(avatar.idatar === avatar.image ? styles.selected : ''}`}
                  onClick={() => setSelectedAvatar(avatar.image)}
                  disabled={isSubmitting}
                  type="button"
                  title={avatar.label}
                >
                  <div className={styles.avatarImageWrapper}>
                    <img 
                      src={avatar.image} 
                      alt={avatar.label}
                    />
                  </div>
                  <span className={styles.avatarLabel}>{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Genre */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Favorite Genre (Optional)</label>
            <select
              className={styles.select}
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Select a genre...</option>
              {GENRES.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Create Button */}
          <button
            className={styles.createBtn}
            onClick={handleCreate}
            disabled={!profileName.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
