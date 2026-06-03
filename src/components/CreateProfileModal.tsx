import React, { FC, useState, useRef, useEffect } from 'react';
import styles from './CreateProfileModal.module.css';
import { useProfile } from '@/hooks/useProfile';
import { GENRES } from '@/services/tmdbAPI';

import avatar1 from '@/assets/avatars/avatar1.png';
import avatar2 from '@/assets/avatars/avatar2.png';
import avatar3 from '@/assets/avatars/avatar3.png';
import avatar4 from '@/assets/avatars/avatar4.png';
import avatar5 from '@/assets/avatars/avatar5.png';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AvatarConfig {
  id: string;
  image: string;
  label: string;
}

const AVATARS: AvatarConfig[] = [
  { id: 'avatar1', image: avatar1, label: 'Patrick Bateman' },
  { id: 'avatar2', image: avatar2, label: 'Deadpool' },
  { id: 'avatar3', image: avatar3, label: 'Jake Sully' },
  { id: 'avatar4', image: avatar4, label: 'Batman' },
  { id: 'avatar5', image: avatar5, label: 'Spider-Man' },
];

export const CreateProfileModal: FC<CreateProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createProfile } = useProfile();

  const [profileName, setProfileName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATARS[0].id);
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap: when modal opens, focus the first interactive element
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const resetForm = () => {
    setProfileName('');
    setSelectedAvatarId(AVATARS[0].id);
    setFavoriteGenre('');
    setError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async () => {
    if (!profileName.trim()) {
      setError('Profile name is required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId)!.image;
      await createProfile(
        profileName.trim(),
        selectedAvatar,
        favoriteGenre || undefined
      );
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      console.error('Error creating profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.profileModalOverlay} ${isOpen ? styles.active : ''}`}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className={styles.profileModal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className={styles.closeButton}
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 id="modal-title" className={styles.profileTitle}>
          Create Your Profile
        </h2>
        <p className={styles.profileSubtitle}>
          Personalize your streaming experience
        </p>

        {error && <div className={styles.errorMessage} role="alert">{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="profileName" className={styles.formLabel}>
            Profile Name
          </label>
          <input
            id="profileName"
            type="text"
            className={styles.formInput}
            placeholder="Enter your profile name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            disabled={isSubmitting}
            maxLength={50}
            aria-required="true"
          />
        </div>

        <div className={styles.formGroup}>
          <span className={styles.formLabel}>Choose Your Avatar</span>
          <div className={styles.avatarGrid} role="radiogroup" aria-label="Avatar selection">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                title={avatar.label}
                disabled={isSubmitting}
                onClick={() => setSelectedAvatarId(avatar.id)}
                className={`${styles.avatarOption} ${
                  selectedAvatarId === avatar.id ? styles.selected : ''
                }`}
                role="radio"
                aria-checked={selectedAvatarId === avatar.id}
                aria-label={`Avatar: ${avatar.label}`}
              >
                <img src={avatar.image} alt={avatar.label} className={styles.avatarImage} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="favoriteGenre" className={styles.formLabel}>
            Favorite Genre (Optional)
          </label>
          <select
            id="favoriteGenre"
            className={styles.genreSelect}
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

        <div className={styles.formActions}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!profileName.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Profile'}
          </button>
          <button
            className={styles.skipBtn}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Skip For Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileModal;